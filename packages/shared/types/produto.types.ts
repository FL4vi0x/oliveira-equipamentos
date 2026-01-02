export interface Produto {
    id: string;
    codigoInterno: string;
    codigoBarras?: string;
    nome: string;
    descricao?: string;
    categoriaId: string;
    unidadeMedida: string;
    precoCompra: number;
    precoVenda: number;
    margemLucro: number;
    estoqueAtual: number;
    estoqueMinimo: number;
    estoqueMaximo?: number;
    ativo: boolean;
    ncm?: string;
    cest?: string;
    observacoes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProdutoInput {
    codigoInterno: string;
    codigoBarras?: string;
    nome: string;
    descricao?: string;
    categoriaId: string;
    unidadeMedida: string;
    precoCompra: number;
    precoVenda: number;
    estoqueAtual?: number;
    estoqueMinimo?: number;
    estoqueMaximo?: number;
    ncm?: string;
    cest?: string;
    observacoes?: string;
}

export interface UpdateProdutoInput {
    codigoInterno?: string;
    codigoBarras?: string;
    nome?: string;
    descricao?: string;
    categoriaId?: string;
    unidadeMedida?: string;
    precoCompra?: number;
    precoVenda?: number;
    estoqueAtual?: number;
    estoqueMinimo?: number;
    estoqueMaximo?: number;
    ativo?: boolean;
    ncm?: string;
    cest?: string;
    observacoes?: string;
}