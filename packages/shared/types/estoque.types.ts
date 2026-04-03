// ─── Tipos espelho do Prisma ──────────────────────────────────
export type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'VENDA' | 'DEVOLUCAO';

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string;
  usuarioId?: string;
  createdAt: string | Date; // Vem como string no JSON via HTTP, Date no Prisma
  
  // Relacionamento preenchido via join
  produto?: { nome: string; codigoInterno: string; unidadeMedida: string };
  usuario?: { nome: string };
}

// ─── Input DTOs ───────────────────────────────────────────────
export interface CreateMovimentacaoInput {
  produtoId: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  motivo?: string;
}

// ─── Consultas Paginadas ──────────────────────────────────────
export interface ExtratoEstoqueParams {
  page?: number;
  limit?: number;
}

export interface PaginatedExtrato {
  data: MovimentacaoEstoque[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Relatórios / Dashboard ───────────────────────────────────
export type CriticidadeEstoque = 'CRITICO' | 'BAIXO' | 'NORMAL';

export interface ProdutoEstoqueAlert {
  id: string;
  nome: string;
  codigoInterno: string;
  unidadeMedida: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  criticidade: CriticidadeEstoque;
  precoVenda?: number; // Adicionado para PDV
}

// ─── Vendas ───────────────────────────────────────────────────
export type FormaPagamento = 
  | 'DINHEIRO' 
  | 'CARTAO_CREDITO' 
  | 'CARTAO_DEBITO' 
  | 'PIX' 
  | 'BOLETO' 
  | 'TRANSFERENCIA' 
  | 'CHEQUE' 
  | 'OUTROS';
