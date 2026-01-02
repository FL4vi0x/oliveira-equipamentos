import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/api';
import './ProdutosPage.css';

interface Produto {
  id: string;
  codigoInterno: string;
  nome: string;
  categoria: string;
  unidadeMedida: string;
  precoVenda: number;
  estoqueAtual: number;
  ativo: boolean;
}

interface ProdutosResponse {
  data: Produto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const ProdutosPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading, error } = useQuery<ProdutosResponse>({
    queryKey: ['produtos', page, search],
    queryFn: () => 
      api.get<ProdutosResponse>(
        `/produtos?page=${page}&limit=${limit}&search=${search}`
      ),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset para primeira página
  };

  if (error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar produtos</p>
      </div>
    );
  }

  return (
    <div className="produtos-page">
      <div className="produtos-header">
        <button className="btn btn-primary">+ Novo Produto</button>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">
            🔍 Buscar
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="loading">Carregando produtos...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="produtos-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Unidade</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.codigoInterno}</td>
                    <td>{produto.nome}</td>
                    <td>{produto.categoria}</td>
                    <td>{produto.unidadeMedida}</td>
                    <td>R$ {Number(produto.precoVenda).toFixed(2)}</td>
                    <td className={produto.estoqueAtual <= 5 ? 'estoque-baixo' : ''}>
                      {produto.estoqueAtual}
                    </td>
                    <td>
                      <span className={`status ${produto.ativo ? 'ativo' : 'inativo'}`}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon" title="Excluir">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && (
            <div className="pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-secondary"
              >
                ← Anterior
              </button>
              
              <span className="page-info">
                Página {data.meta.page} de {data.meta.totalPages} 
                ({data.meta.total} produtos)
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= data.meta.totalPages}
                className="btn btn-secondary"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProdutosPage;