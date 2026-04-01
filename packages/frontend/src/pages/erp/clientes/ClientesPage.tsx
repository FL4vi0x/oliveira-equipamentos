import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Power, PowerOff, Users } from 'lucide-react';
import { clientesService, type Cliente } from '../../../services/clientes.service';
import { Modal } from '../../../components/ui/Modal/Modal';
import { ClienteForm } from './components/ClienteForm';
import { useToast } from '../../../contexts/ToastContext';
import { formatCpfCnpj } from '../../../utils/cpfCnpj';
import './ClientesPage.css';

type TipoFiltro = '' | 'FISICA' | 'JURIDICA';

const ClientesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clienteEditing, setClienteEditing] = useState<Cliente | null>(null);
  const [confirmToggle, setConfirmToggle] = useState<Cliente | null>(null);
  const limit = 10;

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['clientes', page, search, tipoFiltro],
    queryFn: () =>
      clientesService.getAll({
        page,
        limit,
        search: search || undefined,
        tipo: tipoFiltro || undefined,
      }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => clientesService.toggleAtivo(id),
    onSuccess: (res) => {
      const cliente = res as unknown as Cliente;
      toast(
        `Cliente ${cliente?.ativo ? 'ativado' : 'inativado'} com sucesso!`,
        'success',
      );
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setConfirmToggle(null);
    },
    onError: () => toast('Erro ao alterar status do cliente.', 'error'),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const openNovoModal = () => {
    setClienteEditing(null);
    setIsFormOpen(true);
  };

  const openEditarModal = (c: Cliente) => {
    setClienteEditing(c);
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setClienteEditing(null);
  };

  const handleFormSuccess = () => {
    closeFormModal();
    queryClient.invalidateQueries({ queryKey: ['clientes'] });
  };

  if (error) {
    return (
      <div className="clientes-error">
        <p>Erro ao carregar clientes. Tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="clientes-page">
      {/* ── Cabeçalho ── */}
      <div className="clientes-header">
        <div className="clientes-header-left">
          <Users size={22} className="clientes-icon" />
          <h1 className="clientes-title">Clientes</h1>
        </div>

        <div className="clientes-header-right">
          <form onSubmit={handleSearch} className="clientes-search-form">
            <select
              value={tipoFiltro}
              onChange={(e) => {
                setTipoFiltro(e.target.value as TipoFiltro);
                setPage(1);
              }}
              className="clientes-select"
              aria-label="Filtrar por tipo"
            >
              <option value="">Todos os tipos</option>
              <option value="FISICA">Pessoa Física</option>
              <option value="JURIDICA">Pessoa Jurídica</option>
            </select>

            <input
              id="clientes-search-input"
              type="text"
              placeholder="Buscar por nome, CPF/CNPJ, e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="clientes-search-input"
            />
            <button type="submit" className="btn btn-secondary clientes-btn-search">
              <Search size={16} />
              Buscar
            </button>
          </form>

          <button id="btn-novo-cliente" className="btn btn-primary" onClick={openNovoModal}>
            <Plus size={16} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* ── Tabela ── */}
      {isLoading ? (
        <div className="clientes-loading">
          <div className="clientes-spinner" />
          Carregando clientes...
        </div>
      ) : (
        <>
          <div className="clientes-table-wrapper">
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Nome / Razão Social</th>
                  <th>CPF / CNPJ</th>
                  <th>Tipo</th>
                  <th>Contato</th>
                  <th>Cidade / UF</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length === 0 && (
                  <tr>
                    <td colSpan={7} className="clientes-empty">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
                {data?.data.map((cliente: Cliente) => (
                  <tr key={cliente.id} className={!cliente.ativo ? 'row-inativo' : ''}>
                    <td>
                      <div className="cliente-nome">{cliente.nome}</div>
                      {cliente.nomeFantasia && (
                        <div className="cliente-fantasia">{cliente.nomeFantasia}</div>
                      )}
                    </td>
                    <td className="cliente-doc">{formatCpfCnpj(cliente.cpfCnpj)}</td>
                    <td>
                      <span className={`badge-tipo ${cliente.tipo === 'FISICA' ? 'fisica' : 'juridica'}`}>
                        {cliente.tipo === 'FISICA' ? 'PF' : 'PJ'}
                      </span>
                    </td>
                    <td>
                      <div>{cliente.celular || cliente.telefone || '—'}</div>
                      {cliente.email && (
                        <div className="cliente-email">{cliente.email}</div>
                      )}
                    </td>
                    <td>
                      {cliente.cidade
                        ? `${cliente.cidade}${cliente.estado ? ` / ${cliente.estado}` : ''}`
                        : '—'}
                    </td>
                    <td>
                      <span className={`status ${cliente.ativo ? 'ativo' : 'inativo'}`}>
                        {cliente.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <div className="clientes-actions">
                        <button
                          className="btn-icon"
                          title="Editar"
                          onClick={() => openEditarModal(cliente)}
                          aria-label={`Editar ${cliente.nome}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          title={cliente.ativo ? 'Inativar' : 'Ativar'}
                          onClick={() => setConfirmToggle(cliente)}
                          aria-label={`${cliente.ativo ? 'Inativar' : 'Ativar'} ${cliente.nome}`}
                        >
                          {cliente.ativo ? (
                            <PowerOff size={15} color="#ef4444" />
                          ) : (
                            <Power size={15} color="#10b981" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Paginação ── */}
          {data && data.meta.totalPages > 0 && (
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
                &nbsp;({data.meta.total} clientes)
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

      {/* ── Modal Formulário ── */}
      <Modal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        title={clienteEditing ? `Editar Cliente — ${clienteEditing.nome}` : 'Novo Cliente'}
      >
        <ClienteForm
          clienteId={clienteEditing?.id}
          initialData={clienteEditing}
          onSuccess={handleFormSuccess}
          onCancel={closeFormModal}
        />
      </Modal>

      {/* ── Modal Confirmação Toggle ── */}
      <Modal
        isOpen={!!confirmToggle}
        onClose={() => setConfirmToggle(null)}
        title="Confirmar Ação"
      >
        <div style={{ padding: '0 0 1rem 0' }}>
          <p>
            Tem certeza que deseja{' '}
            <strong>{confirmToggle?.ativo ? 'INATIVAR' : 'ATIVAR'}</strong> o
            cliente <strong>{confirmToggle?.nome}</strong>?
          </p>
          {confirmToggle?.ativo && (
            <p className="toggle-aviso">
              ⚠️ Clientes inativados não aparecem na pesquisa padrão.
            </p>
          )}
          <div className="toggle-actions">
            <button className="btn btn-secondary" onClick={() => setConfirmToggle(null)}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              style={{
                backgroundColor: confirmToggle?.ativo ? '#ef4444' : '#10b981',
                borderColor: confirmToggle?.ativo ? '#ef4444' : '#10b981',
              }}
              onClick={() => confirmToggle && toggleMutation.mutate(confirmToggle.id)}
              disabled={toggleMutation.isPending}
            >
              {toggleMutation.isPending ? 'Aguarde...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClientesPage;
