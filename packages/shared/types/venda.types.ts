export const StatusVenda = {
  PENDENTE: 'PENDENTE',
  ORCAMENTO: 'ORCAMENTO',
  CONCLUIDA: 'CONCLUIDA',
  CANCELADA: 'CANCELADA',
} as const;
export type StatusVenda = typeof StatusVenda[keyof typeof StatusVenda];

export const FormaPagamento = {
  DINHEIRO: 'DINHEIRO',
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  CARTAO_DEBITO: 'CARTAO_DEBITO',
  PIX: 'PIX',
  BOLETO: 'BOLETO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  CHEQUE: 'CHEQUE',
  PROMISSORIA: 'PROMISSORIA',
  OUTROS: 'OUTROS',
} as const;
export type FormaPagamento = typeof FormaPagamento[keyof typeof FormaPagamento];

export interface PagamentoVenda {
  id: string;
  vendaId: string;
  formaPagamento: FormaPagamento;
  valor: number;
  createdAt: Date;
}

export interface ItemVenda {
  id: string;
  vendaId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  desconto: number;
  total: number;
  produto?: {
    nome: string;
    codigoInterno: string;
  };
}

export interface Venda {
  id: string;
  numero: number;
  clienteId: string | null;
  usuarioId: string;
  dataVenda: Date;
  subtotal: number;
  desconto: number;
  total: number;
  status: StatusVenda;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  cliente?: {
    nome: string;
    cpfCnpj: string;
  };
  usuario?: {
    nome: string;
  };
  itens: ItemVenda[];
  pagamentos: PagamentoVenda[];
}

export interface VendaResumo {
  id: string;
  numero: number;
  dataVenda: string;
  clienteNome: string;
  clienteCpfCnpj?: string;
  operadorNome: string;
  total: number;
  status: StatusVenda;
  pagamentos: FormaPagamento[];
}

export interface VendasResponse {
  data: Venda[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary?: {
    totalVendido: number;
    vendasConcluidas: number;
    ticketMedio: number;
    cancelamentos: number;
  };
}
