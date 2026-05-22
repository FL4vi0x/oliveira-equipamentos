import api from './api';
import { type StatusVenda, type FormaPagamento } from '../../../shared/types/venda.types';

export interface ItemVendaInput {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
}

export interface PagamentoVendaInput {
  formaPagamento: FormaPagamento;
  valor: number;
}

export interface VendaInput {
  clienteId?: string;
  status?: StatusVenda;
  pagamentos: PagamentoVendaInput[];
  descontoGeral?: number;
  observacoes?: string;
  itens: ItemVendaInput[];
}

export interface FilterVendaParams {
  [key: string]: string | number | boolean | undefined;
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusVenda;
  formaPagamento?: FormaPagamento;
  dataInicio?: string;
  dataFim?: string;
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

  getAll: async (params?: FilterVendaParams) => {
    return api.get('/vendas', { params });
  },

  getById: async (id: string) => {
    return api.get(`/vendas/${id}`);
  },

  getVendasHoje: async () => {
    return api.get('/vendas/hoje');
  },

  cancelar: async (id: string) => {
    return api.patch(`/vendas/${id}/cancelar`);
  },

  gerarDocumentos: async (vendaId: string, params: { numeroParcelas: number; valorEntrada?: number; dataInicio?: string }) => {
    return api.post<{ data: BlobPart }>(`/documentos/gerar/${vendaId}`, params, { responseType: 'blob' });
  },
};
