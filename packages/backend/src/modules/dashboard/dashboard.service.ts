import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getResumo() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [vendasHoje, vendasMes, produtosBaixoEstoque, caixasAbertos] =
      await Promise.all([
        // Vendas Hoje
        this.prisma.venda.aggregate({
          where: { dataVenda: { gte: hoje }, status: 'CONCLUIDA' },
          _sum: { total: true },
          _count: { id: true },
        }),
        // Vendas Mês
        this.prisma.venda.aggregate({
          where: { dataVenda: { gte: inicioMes }, status: 'CONCLUIDA' },
          _sum: { total: true },
          _count: { id: true },
        }),
        // Produtos com estoque baixo
        this.prisma
          .$queryRaw`SELECT COUNT(*) as count FROM "produtos" WHERE ativo = true AND "estoque_atual" <= "estoque_minimo"`,
        // Caixas Abertos
        this.prisma.caixaRegistro.count({
          where: { status: 'ABERTO' },
        }),
      ]);

    const countProdutosBaixoEstoque =
      Array.isArray(produtosBaixoEstoque) && produtosBaixoEstoque[0]?.count
        ? Number(produtosBaixoEstoque[0].count)
        : 0;

    return {
      vendas: {
        hoje: {
          total: vendasHoje._sum.total || 0,
          quantidade: vendasHoje._count.id,
        },
        mes: {
          total: vendasMes._sum.total || 0,
          quantidade: vendasMes._count.id,
        },
      },
      produtos: {
        estoqueBaixo: countProdutosBaixoEstoque,
      },
      caixa: {
        abertos: caixasAbertos,
      },
    };
  }
}
