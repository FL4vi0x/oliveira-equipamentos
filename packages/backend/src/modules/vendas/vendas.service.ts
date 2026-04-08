import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { FilterVendaDto } from './dto/filter-venda.dto';
import { CaixaService } from '../caixa/caixa.service';
import { Prisma, StatusVenda } from '@prisma/client';

@Injectable()
export class VendasService {
  constructor(
    private prisma: PrismaService,
    private caixaService: CaixaService,
  ) {}

  /**
   * Cria uma nova venda (ou orçamento) de forma transacional.
   */
  async criarVenda(usuarioId: string, dto: CreateVendaDto) {
    const status = dto.status || StatusVenda.CONCLUIDA;
    const isOrcamento = status === StatusVenda.ORCAMENTO;

    let caixa: any = null;
    if (!isOrcamento) {
      caixa = await this.caixaService.getAtivo(usuarioId);
      if (!caixa) {
        throw new BadRequestException(
          'O PDV não pode processar vendas sem um caixa aberto.',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      let subtotalVenda = 0;
      const itensData: Prisma.ItemVendaCreateManyVendaInput[] = [];

      for (const item of dto.itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new NotFoundException(
            `Produto ${item.produtoId} não encontrado.`,
          );
        }

        if (!isOrcamento) {
          if (Number(produto.estoqueAtual) < item.quantidade) {
            throw new BadRequestException(
              `Estoque insuficiente para: ${produto.nome}.`,
            );
          }

          await tx.produto.update({
            where: { id: item.produtoId },
            data: { estoqueAtual: { decrement: item.quantidade } },
          });

          await tx.movimentacaoEstoque.create({
            data: {
              produtoId: item.produtoId,
              tipo: 'VENDA',
              quantidade: item.quantidade,
              usuarioId,
              motivo: `Venda #${status}`,
            },
          });
        }

        const subtotalItem = item.quantidade * item.precoUnitario;
        const totalItem = subtotalItem - (item.desconto || 0);
        subtotalVenda += totalItem;

        itensData.push({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: subtotalItem,
          desconto: item.desconto || 0,
          total: totalItem,
        });
      }

      const totalVenda = subtotalVenda - (dto.descontoGeral || 0);

      // Criar Venda com tipagem nativa
      const venda = await tx.venda.create({
        data: {
          usuarioId,
          caixaId: caixa?.id || null,
          clienteId: dto.clienteId || null,
          subtotal: subtotalVenda,
          desconto: dto.descontoGeral || 0,
          total: totalVenda,
          status,
          observacoes: dto.observacoes,
          itens: {
            create: itensData,
          },
          pagamentos: {
            create: dto.pagamentos.map((p) => ({
              formaPagamento: p.formaPagamento,
              valor: p.valor,
            })),
          },
        },
        include: {
          itens: { include: { produto: true } },
          pagamentos: true,
          cliente: true,
        },
      });

      if (caixa && status === StatusVenda.CONCLUIDA) {
        await tx.caixaRegistro.update({
          where: { id: caixa.id },
          data: { totalVendas: { increment: totalVenda } },
        });
      }

      return venda;
    });
  }

  /**
   * Lista vendas com filtros e resumo.
   */
  async findAll(filter: FilterVendaDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      formaPagamento,
      dataInicio,
      dataFim,
    } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.VendaWhereInput = {};

    if (status) where.status = status;
    if (formaPagamento) {
      where.pagamentos = { some: { formaPagamento } };
    }

    if (dataInicio || dataFim) {
      where.createdAt = {
        ...(dataInicio && { gte: new Date(dataInicio) }),
        ...(dataFim && { lte: new Date(dataFim) }),
      };
    }

    if (search) {
      where.OR = [
        { cliente: { nome: { contains: search, mode: 'insensitive' } } },
        { cliente: { cpfCnpj: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.venda.findMany({
        where,
        include: {
          cliente: { select: { nome: true, cpfCnpj: true } },
          usuario: { select: { nome: true } },
          pagamentos: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.venda.count({ where }),
    ]);

    const aggregation = await this.prisma.venda.aggregate({
      where,
      _sum: { total: true },
      _count: { id: true },
      _avg: { total: true },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      summary: {
        totalVendido: Number(aggregation._sum.total) || 0,
        vendasConcluidas: aggregation._count.id || 0,
        ticketMedio: Number(aggregation._avg.total) || 0,
        cancelamentos: 0,
      },
    };
  }

  async findOne(id: string) {
    const venda = await this.prisma.venda.findUnique({
      where: { id },
      include: {
        cliente: true,
        usuario: { select: { nome: true } },
        itens: { include: { produto: true } },
        pagamentos: true,
      },
    });

    if (!venda) throw new NotFoundException('Venda não encontrada');
    return venda;
  }

  async cancelar(id: string) {
    const venda = await this.findOne(id);

    if (venda.status === StatusVenda.CANCELADA) {
      throw new BadRequestException('Venda já está cancelada.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedVenda = await tx.venda.update({
        where: { id },
        data: { status: StatusVenda.CANCELADA },
      });

      if (venda.status !== StatusVenda.ORCAMENTO) {
        // Tipagem amigável para acesso seguro às relações incluídas pelo findOne
        const vendaComRels = venda as any;

        for (const item of vendaComRels.itens) {
          await tx.produto.update({
            where: { id: item.produtoId },
            data: { estoqueAtual: { increment: item.quantidade } },
          });

          await tx.movimentacaoEstoque.create({
            data: {
              produtoId: item.produtoId,
              tipo: 'DEVOLUCAO',
              quantidade: item.quantidade,
              usuarioId: venda.usuarioId,
              motivo: `Cancelamento de Venda: ${venda.id}`,
            },
          });
        }

        if (venda.caixaId && venda.status === StatusVenda.CONCLUIDA) {
          await tx.caixaRegistro.update({
            where: { id: venda.caixaId },
            data: { totalVendas: { decrement: venda.total } },
          });
        }
      }

      return updatedVenda;
    });
  }

  async getVendasDoDia(usuarioId: string) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return this.prisma.venda.findMany({
      where: {
        usuarioId,
        createdAt: { gte: hoje },
      },
      include: {
        cliente: { select: { nome: true } },
        itens: true,
        pagamentos: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
