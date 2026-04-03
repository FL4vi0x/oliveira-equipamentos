import api from './api';
import type { FormaPagamento } from '../../../shared/types/estoque.types';

export interface ItemVenda {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
}

export interface VendaInput {
  clienteId?: string;
  formaPagamento: FormaPagamento;
  descontoGeral?: number;
  observacoes?: string;
  itens: ItemVenda[];
}

export const vendasService = {
  // --- CAIXA ---
  getCaixaAtivo: async () => {
    return api.get('/estoque/caixas/ativo');
  },

  abrirCaixa: async (saldoAbertura: number) => {
    return api.post('/estoque/caixas/abrir', { saldoAbertura });
  },

  fecharCaixa: async (caixaId: string) => {
    return api.patch(`/estoque/caixas/${caixaId}/fechar`);
  },

  // --- VENDAS ---
  finalizarVenda: async (venda: VendaInput) => {
    return api.post('/vendas', venda);
  },

  getVendasHoje: async () => {
    return api.get('/vendas/hoje');
  },
};
