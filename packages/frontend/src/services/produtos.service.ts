import api from './api';

export interface ProdutoInput {
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

export const produtosService = {
  async create(data: ProdutoInput) {
    return api.post('/produtos', data);
  },

  async update(id: string, data: Partial<ProdutoInput>) {
    return api.patch(`/produtos/${id}`, data);
  },

  async remover(id: string) {
    return api.delete(`/produtos/${id}`);
  },

  async toggleAtivo(id: string) {
    return api.patch(`/produtos/${id}/toggle-ativo`, {});
  },
};
