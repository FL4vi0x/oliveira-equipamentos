import api from './api';
import type {
  CreateMovimentacaoInput,
  PaginatedExtrato,
  ProdutoEstoqueAlert,
  ExtratoEstoqueParams,
} from '../../../shared/types/estoque.types';

export const estoqueService = {
  // Retorna todos os produtos formatados para a tabela principal
  getAllProdutos() {
    return api.get<ProdutoEstoqueAlert[]>('/estoque/produtos');
  },

  // Retorna histórico (extrato) de um produto específico paginado
  getExtrato(produtoId: string, params?: ExtratoEstoqueParams) {
    const qs = params?.page ? `?page=${params.page}&limit=${params.limit || 10}` : '';
    return api.get<PaginatedExtrato>(`/estoque/extrato/${produtoId}${qs}`);
  },

  // Top 5 ou todos alertas de estoque baixo (Dashboards)
  getAlertasMinimo() {
    return api.get<ProdutoEstoqueAlert[]>('/estoque/alertas/minimo');
  },

  // Registra uma nova entrada, saída ou devolução
  movimentarEstoque(data: CreateMovimentacaoInput) {
    return api.post('/estoque/movimentar', data);
  },
};
