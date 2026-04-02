import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMovimentacaoDto } from './dto/create-movimentacao.dto';
import { ExtratoEstoqueDto } from './dto/extrato-estoque.dto';

@Injectable()
export class EstoqueService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────
  // 1. Registrar Movimentação (Transacional / Double-Entry)
  // ─────────────────────────────────────────────────────────────
  async registrarMovimentacao(dto: CreateMovimentacaoDto, usuarioId?: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Validações iniciais e Lock do Produto
      // Usar transação e se possível atualizar com base na linha atual
      const produto = await tx.produto.findUnique({
        where: { id: dto.produtoId },
      });

      if (!produto) throw new NotFoundException('Produto não encontrado');
      if (!produto.ativo)
        throw new BadRequestException(
          'Produto inativo não pode ser movimentado',
        );

      // 2. Definir a operação matemática (Somar ou Subtrair)
      const isEntrada = ['ENTRADA', 'AJUSTE', 'DEVOLUCAO'].includes(dto.tipo);
      // Se for AJUSTE, mas o usuário preencheu uma quantidade negativa (caso do backend permitir decimal nativamente),
      // ou se tivermos UI com saídas de ajuste, assumiremos que AJUSTE é tipo de entrada, e "AJUSTE DE SAIDA" pode ser SAIDA com motivo Ajuste.
      // O Prisma suporta apenas Math Absoluto na API de increment/decrement
      const qty = Number(dto.quantidade);

      // Usando query builder para atualizar o saldo matematicamente
      const updatedProduto = await tx.produto.update({
        where: { id: dto.produtoId },
        data: {
          estoqueAtual: {
            [isEntrada ? 'increment' : 'decrement']: qty,
          },
        },
      });

      // 3. Cadastrar a Movimentação (Histórico / Ledger)
      const movimentacao = await tx.movimentacaoEstoque.create({
        data: {
          produtoId: dto.produtoId,
          tipo: dto.tipo,
          quantidade: qty, // sempre salva positivo
          motivo: dto.motivo,
          usuarioId: usuarioId || null,
        },
      });

      return { movimentacao, saldoAtualizado: updatedProduto.estoqueAtual };
    });
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Extrato/Histórico (Paginado)
  // ─────────────────────────────────────────────────────────────
  async buscarExtrato(produtoId: string, filter: ExtratoEstoqueDto) {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    const where = { produtoId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.movimentacaoEstoque.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          usuario: { select: { nome: true } },
          produto: {
            select: { nome: true, codigoInterno: true, unidadeMedida: true },
          },
        },
      }),
      this.prisma.movimentacaoEstoque.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 3. Relatório de Alertas (Alertas de Estoque Mínimo no Dashboard)
  // ─────────────────────────────────────────────────────────────
  async relatorioEstoqueBaixo() {
    // Busca e processa a criticidade in-memory ou na DB
    const produtos = await this.prisma.produto.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        codigoInterno: true,
        nome: true,
        unidadeMedida: true,
        estoqueAtual: true,
        estoqueMinimo: true,
      },
    });

    // Filtra e assoca a criticidade no JS, limitando os top riscos
    const alertas = produtos
      .map((p) => {
        const atual = Number(p.estoqueAtual);
        const min = Number(p.estoqueMinimo);

        let criticidade: 'NORMAL' | 'BAIXO' | 'CRITICO' = 'NORMAL';
        if (atual <= 0) {
          criticidade = 'CRITICO';
        } else if (atual <= min) {
          criticidade = 'BAIXO';
        }

        return { ...p, criticidade, estoqueAtual: atual, estoqueMinimo: min };
      })
      .filter((p) => p.criticidade !== 'NORMAL')
      // Ordena CRITICO primeiro, depois pelo gap de estoqueAtual
      .sort((a, b) => {
        if (a.criticidade === 'CRITICO' && b.criticidade !== 'CRITICO')
          return -1;
        if (b.criticidade === 'CRITICO' && a.criticidade !== 'CRITICO')
          return 1;
        return a.estoqueAtual - b.estoqueAtual; // Menos produto primeiro
      });

    return alertas;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Listagem Geral para a EstoquePage
  // ─────────────────────────────────────────────────────────────
  async findAllProdutosParaEstoque() {
    const produtos = await this.prisma.produto.findMany({
      where: { ativo: true },
      orderBy: { nome: 'asc' },
      select: {
        id: true,
        codigoInterno: true,
        nome: true,
        categoria: { select: { nome: true } },
        unidadeMedida: true,
        estoqueAtual: true,
        estoqueMinimo: true,
        estoqueMaximo: true,
      },
    });

    return produtos.map((p) => {
      const atual = Number(p.estoqueAtual);
      const min = Number(p.estoqueMinimo);
      let criticidade: 'NORMAL' | 'BAIXO' | 'CRITICO' = 'NORMAL';
      if (atual <= 0) criticidade = 'CRITICO';
      else if (atual <= min) criticidade = 'BAIXO';

      return {
        ...p,
        criticidade,
        estoqueAtual: atual,
        estoqueMinimo: min,
        estoqueMaximo: p.estoqueMaximo ? Number(p.estoqueMaximo) : null,
      };
    });
  }
}
