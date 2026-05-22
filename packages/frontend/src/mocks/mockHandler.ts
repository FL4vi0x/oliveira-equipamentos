import { mockSalesResponse } from './sales.mock';
import { mockProductsResponse } from './products.mock';

const mockCategoriesResponse = {
  data: [
    { id: 'cat-1', nome: 'Equipamentos Pesados', descricao: 'Máquinas de grande porte' },
    { id: 'cat-2', nome: 'Ferramentas Elétricas', descricao: 'Furadeiras, serras, etc' },
  ],
  meta: { total: 2, page: 1, limit: 10, totalPages: 1 }
};

const mockCustomersResponse = {
  data: [
    { id: 'cli-1', nome: 'Carol', cpfCnpj: '058.252.504-76', email: 'carol@email.com', telefone: '11999999999' },
    { id: 'cli-2', nome: 'João Construções', cpfCnpj: '12.345.678/0001-90', email: 'contato@joao.com', telefone: '11888888888' },
  ],
  meta: { total: 2, page: 1, limit: 10, totalPages: 1 }
};

const mockCaixaAtivo = {
  id: 'caixa-123',
  usuarioId: 'user-1',
  status: 'ABERTO',
  saldoAbertura: 150.00,
  saldoAtual: 150.00,
  dataAbertura: new Date().toISOString(),
};

const mockDashboardResponse = {
  faturamentoDia: 3500.00,
  vendasConcluidasHoje: 12,
  ticketMedio: 291.66,
  produtosBaixoEstoque: 3,
  recentSales: mockSalesResponse.data.slice(0, 5),
};

const mockDocumentoBlob = new Blob(['Mock PDF Content'], { type: 'application/pdf' });

export const handleMockRequest = (method: string, endpoint: string, _data?: unknown) => {
  console.log(`[UI Preview Mode] Intercepted ${method} ${endpoint}`);

  // Vendas
  if (endpoint.includes('/vendas/hoje')) return [];
  if (endpoint.includes('/vendas')) return mockSalesResponse;
  
  // Produtos
  if (endpoint.includes('/produtos')) return mockProductsResponse;
  
  // Categorias
  if (endpoint.includes('/categorias')) return mockCategoriesResponse;
  
  // Clientes
  if (endpoint.includes('/clientes')) return mockCustomersResponse;
  
  // Caixa / Estoque
  if (endpoint.includes('/estoque/caixas/ativo')) return mockCaixaAtivo;
  if (endpoint.includes('/estoque/caixas/abrir')) return { ...mockCaixaAtivo, saldoAbertura: (_data as { saldoAbertura?: number })?.saldoAbertura || 0 };
  if (endpoint.includes('/estoque')) return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  
  // Dashboard
  if (endpoint.includes('/dashboard')) return mockDashboardResponse;

  // Documentos
  if (endpoint.includes('/documentos/gerar/')) return { data: mockDocumentoBlob };

  // Fallback genérico para rotas não mockadas
  if (method === 'GET') return { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  if (method === 'POST') return { success: true, message: 'Mocked POST response' };
  
  return null;
};
