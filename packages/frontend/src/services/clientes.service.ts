import api from './api';
import type { 
  Cliente, 
  CreateClienteInput, 
  UpdateClienteInput, 
  FilterClienteParams, 
  PaginatedClientes 
} from '../../../shared/types/cliente.types';

export type { Cliente, CreateClienteInput, UpdateClienteInput, FilterClienteParams, PaginatedClientes };

/**
 * Constrói query string a partir de um objeto de parâmetros,
 * omitindo valores undefined/null.
 */
function buildQuery(params: Record<string, unknown>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export const clientesService = {
  getAll(params?: FilterClienteParams) {
    const qs = buildQuery((params ?? {}) as Record<string, unknown>);
    return api.get<PaginatedClientes>(`/clientes${qs}`);
  },

  getById(id: string) {
    return api.get<Cliente>(`/clientes/${id}`);
  },

  getByCpfCnpj(documento: string) {
    const digits = documento.replace(/\D/g, '');
    return api.get<Cliente>(`/clientes/buscar/cpf-cnpj/${digits}`);
  },

  create(data: CreateClienteInput) {
    return api.post<Cliente>('/clientes', {
      ...data,
      cpfCnpj: data.cpfCnpj.replace(/\D/g, ''),
      cep: data.cep?.replace(/\D/g, ''),
    });
  },

  update(id: string, data: UpdateClienteInput) {
    return api.patch<Cliente>(`/clientes/${id}`, {
      ...data,
      ...(data.cpfCnpj && { cpfCnpj: data.cpfCnpj.replace(/\D/g, '') }),
      ...(data.cep && { cep: data.cep.replace(/\D/g, '') }),
    });
  },

  toggleAtivo(id: string) {
    return api.patch<Cliente>(`/clientes/${id}/toggle-ativo`, {});
  },
};
