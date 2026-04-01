import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Power, PowerOff } from 'lucide-react';
import api from '../../../services/api';
import { produtosService } from '../../../services/produtos.service';
import { Modal } from '../../../components/ui/Modal/Modal';
import { ProdutoForm } from './components/ProdutoForm';
import { useToast } from '../../../contexts/ToastContext';
import './ProdutosPage.css';

interface Categoria {
  id: string;
  nome: string;
}

interface Produto {
  id: string;
  codigoInterno: string;
  nome: string;
  categoria: Categoria;
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [produtoEditing, setProdutoEditing] = useState<Produto | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<Produto | null>(null);
  const limit = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<ProdutosResponse>({
    queryKey: ['produtos', page, search],
    queryFn: () => 
      api.get<ProdutosResponse>(
        `/produtos?page=${page}&limit=${limit}&search=${search}`
      ),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => produtosService.toggleAtivo(id),
    onSuccess: () => {
      toast('Status do produto alterado com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      setConfirmToggle(null);
    },
    onError: () => toast('Erro ao alterar status do produto.', 'error'),
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

  const openNovoModal = () => {
    setProdutoEditing(null);
    setIsFormOpen(true);
  };

  const openEditarModal = (p: Produto) => {
    setProdutoEditing(p);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setProdutoEditing(null);
  };

  return (
    <div className="produtos-page">
      <div className="produtos-header">
        <button className="btn btn-primary" onClick={openNovoModal}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Novo Produto
        </button>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} /> Buscar
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
                    <td>{produto.categoria.nome}</td>
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
                      <button className="btn-icon" title="Editar" onClick={() => openEditarModal(produto)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon" title={produto.ativo ? 'Inativar' : 'Ativar'} onClick={() => setConfirmToggle(produto)}>
                        {produto.ativo ? <PowerOff size={16} color="#ef4444" /> : <Power size={16} color="#10b981" />}
                      </button>
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

      {/* Modal de Formulário */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={closeFormModal} 
        title={produtoEditing ? `Editar Produto - ${produtoEditing.codigoInterno}` : 'Novo Produto'}
      >
        <ProdutoForm 
          produtoId={produtoEditing?.id} 
          initialData={produtoEditing} 
          onSuccess={closeFormModal} 
          onCancel={closeFormModal} 
        />
      </Modal>

      {/* Modal de Confirmação de Toggle */}
      <Modal 
        isOpen={!!confirmToggle} 
        onClose={() => setConfirmToggle(null)} 
        title="Confirmar Ação"
      >
        <div style={{ padding: '0 0 1rem 0' }}>
          <p>Tem certeza que deseja <strong>{confirmToggle?.ativo ? 'INATIVAR' : 'ATIVAR'}</strong> o produto <strong>{confirmToggle?.nome}</strong>?</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setConfirmToggle(null)}>Cancelar</button>
            <button 
              className="btn btn-primary" 
              style={{ backgroundColor: confirmToggle?.ativo ? '#ef4444' : '#10b981', borderColor: confirmToggle?.ativo ? '#ef4444' : '#10b981' }}
              onClick={() => confirmToggle && toggleMutation.mutate(confirmToggle.id)}
            >
              {toggleMutation.isPending ? 'Aguarde...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProdutosPage;