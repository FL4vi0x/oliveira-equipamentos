import api from './api';
import { type StatusVenda, type FormaPagamento, type Venda } from '../../../shared/types/venda.types';

// UI Preview Mode - dados mock para desenvolvimento visual
const UI_PREVIEW_MODE = import.meta.env.VITE_UI_PREVIEW_MODE === 'true';

const MOCK_VENDAS: Venda[] = [
  {
    id: 'v001',
    numero: 10,
    status: 'CONCLUIDA',
    subtotal: 359.60,
    descontoGeral: 0,
    total: 359.60,
    createdAt: '2026-05-12T15:12:00Z',
    updatedAt: '2026-05-12T15:12:00Z',
    clienteId: 'c001',
    operadorId: 'op001',
    cliente: { id: 'c001', nome: 'Carol', cpfCnpj: '05825250476', tipo: 'PF', email: '', telefone: '', createdAt: '', updatedAt: '' },
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p001', vendaId: 'v001', formaPagamento: 'PROMISSORIA', valor: 359.60, createdAt: '' }],
    itens: [],
  },
  {
    id: 'v002',
    numero: 9,
    status: 'CANCELADA',
    subtotal: 269.70,
    descontoGeral: 0,
    total: 269.70,
    createdAt: '2026-05-12T15:02:00Z',
    updatedAt: '2026-05-12T15:02:00Z',
    operadorId: 'op001',
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p002', vendaId: 'v002', formaPagamento: 'PROMISSORIA', valor: 269.70, createdAt: '' }],
    itens: [],
  },
  {
    id: 'v003',
    numero: 8,
    status: 'CANCELADA',
    subtotal: 179.80,
    descontoGeral: 0,
    total: 179.80,
    createdAt: '2026-04-22T18:31:00Z',
    updatedAt: '2026-04-22T18:31:00Z',
    clienteId: 'c001',
    operadorId: 'op001',
    cliente: { id: 'c001', nome: 'Carol', cpfCnpj: '05825250476', tipo: 'PF', email: '', telefone: '', createdAt: '', updatedAt: '' },
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p003', vendaId: 'v003', formaPagamento: 'PROMISSORIA', valor: 179.80, createdAt: '' }],
    itens: [],
  },
  {
    id: 'v004',
    numero: 7,
    status: 'CANCELADA',
    subtotal: 179.80,
    descontoGeral: 0,
    total: 179.80,
    createdAt: '2026-04-22T18:28:00Z',
    updatedAt: '2026-04-22T18:28:00Z',
    operadorId: 'op001',
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p004', vendaId: 'v004', formaPagamento: 'PROMISSORIA', valor: 179.80, createdAt: '' }],
    itens: [],
  },
  {
    id: 'v005',
    numero: 6,
    status: 'CONCLUIDA',
    subtotal: 449.50,
    descontoGeral: 0,
    total: 449.50,
    createdAt: '2026-04-22T18:19:00Z',
    updatedAt: '2026-04-22T18:19:00Z',
    operadorId: 'op001',
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p005', vendaId: 'v005', formaPagamento: 'PROMISSORIA', valor: 449.50, createdAt: '' }],
    itens: [],
  },
  {
    id: 'v006',
    numero: 5,
    status: 'CONCLUIDA',
    subtotal: 500.00,
    descontoGeral: 0,
    total: 500.00,
    createdAt: '2026-04-22T18:10:00Z',
    updatedAt: '2026-04-22T18:10:00Z',
    operadorId: 'op001',
    operador: { id: 'op001', nome: 'Administrador Oliveira', email: 'admin@oliveira.com', role: 'admin' },
    pagamentos: [{ id: 'p006', vendaId: 'v006', formaPagamento: 'PROMISSORIA', valor: 500.00, createdAt: '' }],
    itens: [],
  },
];

const getMockVendasResponse = () => {
  const concluidas = MOCK_VENDAS.filter(v => v.status === 'CONCLUIDA');
  const totalVendido = concluidas.reduce((acc, v) => acc + v.total, 0);
  return {
    data: MOCK_VENDAS,
    meta: { total: MOCK_VENDAS.length, page: 1, limit: 10, totalPages: 1 },
    summary: {
      totalVendido,
      vendasConcluidas: concluidas.length,
      ticketMedio: concluidas.length > 0 ? totalVendido / concluidas.length : 0,
      cancelamentos: MOCK_VENDAS.filter(v => v.status === 'CANCELADA').length,
    },
  };
};

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
    if (UI_PREVIEW_MODE) {
      return getMockVendasResponse();
    }
    return api.get('/vendas', { params });
  },

  getById: async (id: string) => {
    if (UI_PREVIEW_MODE) {
      return { data: MOCK_VENDAS.find(v => v.id === id) };
    }
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
