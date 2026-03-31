import api from './api';

export interface Categoria {
  id: string;
  nome: string;
  produtosCount?: number;
}

export const categoriasService = {
  async getAll(): Promise<Categoria[]> {
    return api.get<Categoria[]>('/categorias');
  },

  async create(data: { nome: string }): Promise<Categoria> {
    return api.post<Categoria>('/categorias', data);
  },

  async update(id: string, data: { nome: string }): Promise<Categoria> {
    return api.patch<Categoria>(`/categorias/${id}`, data);
  },

  async remover(id: string): Promise<void> {
    return api.delete(`/categorias/${id}`);
  },
};
