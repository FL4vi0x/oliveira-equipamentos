export const mockProductsData = [
  {
    id: 'prod-1',
    nome: 'Betoneira 400L CSM',
    codigoInterno: 'BET-400',
    codigoBarras: '7891234567890',
    descricao: 'Betoneira CSM 400 Litros Monofásica',
    categoriaId: 'cat-1',
    unidadeMedida: 'UN',
    precoCusto: 2500.00,
    margemLucro: 40,
    precoVenda: 3500.00,
    estoqueAtual: 5,
    estoqueMinimo: 2,
    status: 'ATIVO',
    createdAt: new Date(),
    updatedAt: new Date(),
    categoria: { nome: 'Equipamentos Pesados' }
  },
  {
    id: 'prod-2',
    nome: 'Furadeira de Impacto Bosch',
    codigoInterno: 'FUR-001',
    codigoBarras: '7890987654321',
    descricao: 'Furadeira de Impacto Bosch GSB 16 RE',
    categoriaId: 'cat-2',
    unidadeMedida: 'UN',
    precoCusto: 300.00,
    margemLucro: 50,
    precoVenda: 450.00,
    estoqueAtual: 12,
    estoqueMinimo: 5,
    status: 'ATIVO',
    createdAt: new Date(),
    updatedAt: new Date(),
    categoria: { nome: 'Ferramentas Elétricas' }
  }
];

export const mockProductsResponse = {
  data: mockProductsData,
  meta: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};
