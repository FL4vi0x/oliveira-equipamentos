export type TipoCliente = 'FISICA' | 'JURIDICA';

export interface Cliente {
  id: string;
  tipo: TipoCliente;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  observacoes?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClienteInput {
  tipo: TipoCliente;
  nome: string;
  cpfCnpj: string;
  email?: string;
  telefone?: string;
  celular?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  observacoes?: string;
}

export interface UpdateClienteInput extends Partial<CreateClienteInput> {
  ativo?: boolean;
}

export interface FilterClienteParams {
  page?: number;
  limit?: number;
  search?: string;
  tipo?: TipoCliente;
  ativo?: boolean;
}

export interface PaginatedClientes {
  data: Cliente[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
