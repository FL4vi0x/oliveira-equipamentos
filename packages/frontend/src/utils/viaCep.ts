import api from '../services/api';

export interface EnderecoData {
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
}

/**
 * Consulta a API de CEP do Backend, que atua como proxy para a BrasilAPI/ViaCEP,
 * contornando restrições de CORS e bloqueadores de rede no navegador.
 */
export async function buscarCep(cep: string): Promise<EnderecoData> {
  const digits = cep.replace(/\D/g, '');

  if (digits.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos');
  }

  try {
    const endereco = await api.get<EnderecoData>(`/clientes/cep/${digits}`);
    return endereco;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Falha de conexão ao buscar o CEP com o servidor.');
  }
}
