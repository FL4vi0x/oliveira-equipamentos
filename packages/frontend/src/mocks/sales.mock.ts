import { StatusVenda, FormaPagamento, type VendasResponse, type Venda } from '../../../shared/types/venda.types';

const mockVendasData: Venda[] = [
  {
    id: 'venda-1',
    numero: 10,
    clienteId: 'cliente-1',
    usuarioId: 'user-1',
    dataVenda: new Date('2026-05-12T15:12:00'),
    subtotal: 359.60,
    desconto: 0,
    total: 359.60,
    status: StatusVenda.CONCLUIDA,
    createdAt: new Date('2026-05-12T15:12:00'),
    updatedAt: new Date('2026-05-12T15:12:00'),
    cliente: {
      nome: 'Carol',
      cpfCnpj: '058.252.504-76',
    },
    usuario: {
      nome: 'Administrador Oliveira',
    },
    itens: [],
    pagamentos: [
      { id: 'pag-1', vendaId: 'venda-1', formaPagamento: FormaPagamento.PROMISSORIA, valor: 359.60, createdAt: new Date() }
    ],
  },
  {
    id: 'venda-2',
    numero: 9,
    clienteId: null,
    usuarioId: 'user-1',
    dataVenda: new Date('2026-05-12T15:02:00'),
    subtotal: 269.70,
    desconto: 0,
    total: 269.70,
    status: StatusVenda.CANCELADA,
    createdAt: new Date('2026-05-12T15:02:00'),
    updatedAt: new Date('2026-05-12T15:02:00'),
    usuario: {
      nome: 'Administrador Oliveira',
    },
    itens: [],
    pagamentos: [
      { id: 'pag-2', vendaId: 'venda-2', formaPagamento: FormaPagamento.PROMISSORIA, valor: 269.70, createdAt: new Date() }
    ],
  },
  {
    id: 'venda-3',
    numero: 8,
    clienteId: 'cliente-1',
    usuarioId: 'user-1',
    dataVenda: new Date('2026-04-22T18:31:00'),
    subtotal: 179.80,
    desconto: 0,
    total: 179.80,
    status: StatusVenda.CANCELADA,
    createdAt: new Date('2026-04-22T18:31:00'),
    updatedAt: new Date('2026-04-22T18:31:00'),
    cliente: {
      nome: 'Carol',
      cpfCnpj: '058.252.504-76',
    },
    usuario: {
      nome: 'Administrador Oliveira',
    },
    itens: [],
    pagamentos: [
      { id: 'pag-3', vendaId: 'venda-3', formaPagamento: FormaPagamento.PROMISSORIA, valor: 179.80, createdAt: new Date() }
    ],
  },
  {
    id: 'venda-4',
    numero: 7,
    clienteId: null,
    usuarioId: 'user-1',
    dataVenda: new Date('2026-04-22T18:28:00'),
    subtotal: 179.80,
    desconto: 0,
    total: 179.80,
    status: StatusVenda.CANCELADA,
    createdAt: new Date('2026-04-22T18:28:00'),
    updatedAt: new Date('2026-04-22T18:28:00'),
    usuario: {
      nome: 'Administrador Oliveira',
    },
    itens: [],
    pagamentos: [
      { id: 'pag-4', vendaId: 'venda-4', formaPagamento: FormaPagamento.PROMISSORIA, valor: 179.80, createdAt: new Date() }
    ],
  },
  {
    id: 'venda-5',
    numero: 6,
    clienteId: null,
    usuarioId: 'user-1',
    dataVenda: new Date('2026-04-22T18:19:00'),
    subtotal: 449.50,
    desconto: 0,
    total: 449.50,
    status: StatusVenda.CONCLUIDA,
    createdAt: new Date('2026-04-22T18:19:00'),
    updatedAt: new Date('2026-04-22T18:19:00'),
    usuario: {
      nome: 'Administrador Oliveira',
    },
    itens: [],
    pagamentos: [
      { id: 'pag-5', vendaId: 'venda-5', formaPagamento: FormaPagamento.PROMISSORIA, valor: 449.50, createdAt: new Date() }
    ],
  },
];

export const mockSalesResponse: VendasResponse = {
  data: mockVendasData,
  meta: {
    total: 5,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  summary: {
    totalVendido: 3188.40,
    vendasConcluidas: 10,
    ticketMedio: 318.84,
    cancelamentos: 3,
  },
};
