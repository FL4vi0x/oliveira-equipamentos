import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { CaixaService } from '../caixa/caixa.service';

@Injectable()
export class VendasService {
  constructor(
    private prisma: PrismaService,
    private caixaService: CaixaService,
  ) {}

  async criarVenda(usuarioId: string, dto: CreateVendaDto) {
    // 1. Verificar se o usuário tem um caixa aberto
    const caixa = await this.caixaService.getAtivo(usuarioId);
    if (!caixa) {
      throw new BadRequestException(
        'O PDV não pode processar vendas sem um caixa aberto.',
      );
    }

    // 2. Transação Atômica para Garantir Estoque e Consistência
    return this.prisma.$transaction(async (tx) => {
      let subtotalVenda = 0;

      // Processar cada item da venda
      const itensCompletos: any[] = [];

      for (const item of dto.itens) {
        // Buscar produto e travar para atualização segura (SELECT FOR UPDATE implícito em findUnique com transação no PostgreSQL dependendo da isolamento, mas aqui garantiremos via lógica)
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new NotFoundException(
            `Produto ${item.produtoId} não encontrado.`,
          );
        }

        if (Number(produto.estoqueAtual) < item.quantidade) {
          throw new BadRequestException(
            `Estoque insuficiente para o produto: ${produto.nome}. (Atual: ${Number(produto.estoqueAtual)})`,
          );
        }

        const subtotalItem = item.quantidade * item.precoUnitario;
        const totalItem = subtotalItem - (item.desconto || 0);
        subtotalVenda += totalItem;

        // Atualizar Estoque (Dar Baixa)
        await tx.produto.update({
          where: { id: item.produtoId },
          data: {
            estoqueAtual: { decrement: item.quantidade },
          },
        });

        // Registrar Movimentação de Estoque (Histórico)
        await tx.movimentacaoEstoque.create({
          data: {
            produtoId: item.produtoId,
            tipo: 'VENDA',
            quantidade: item.quantidade,
            usuarioId,
            motivo: `Venda Ref: PDV - Caixa ${caixa.id}`,
          },
        });

        itensCompletos.push({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          subtotal: subtotalItem,
          desconto: item.desconto || 0,
          total: totalItem,
        });
      }

      const totalVenda = subtotalVenda - (dto.descontoGeral || 0);

      // 3. Criar o Registro da Venda
      const venda = await (tx as any).venda.create({
        data: {
          usuarioId,
          caixaId: caixa.id,
          clienteId: dto.clienteId || null,
          subtotal: subtotalVenda,
          desconto: dto.descontoGeral || 0,
          total: totalVenda,
          formaPagamento: dto.formaPagamento,
          observacoes: dto.observacoes,
          itens: {
            create: itensCompletos,
          },
        },
        include: {
          itens: {
            include: {
              produto: { select: { nome: true, codigoInterno: true } },
            },
          },
        },
      });

      // 4. Atualizar o total acumulado do Caixa
      await (tx as any).caixaRegistro.update({
        where: { id: caixa.id },
        data: {
          totalVendas: { increment: totalVenda },
        },
      });

      return venda;
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
