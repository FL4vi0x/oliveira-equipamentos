import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categoriasService, type Categoria } from '../../../services/categorias.service';
import { Modal } from '../../../components/ui/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '../../../contexts/ToastContext';
import './CategoriasPage.css';

const schema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function CategoriasPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoriaEditing, setCategoriaEditing] = useState<Categoria | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Categoria | null>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categorias, isLoading } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
  });

  const openNovoModal = () => {
    setCategoriaEditing(null);
    reset({ nome: '' });
    setIsFormOpen(true);
  };

  const openEditarModal = (cat: Categoria) => {
    setCategoriaEditing(cat);
    reset({ nome: cat.nome });
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setCategoriaEditing(null);
  };

  const mutation = useMutation({
    mutationFn: (data: FormData) => 
      categoriaEditing ? categoriasService.update(categoriaEditing.id, data) : categoriasService.create(data),
    onSuccess: () => {
      toast(categoriaEditing ? 'Categoria atualizada!' : 'Categoria criada!', 'success');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      closeFormModal();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast(error.response?.data?.message || 'Erro ao salvar categoria', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriasService.remover(id),
    onSuccess: () => {
      toast('Categoria removida com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      setConfirmDelete(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast(error.response?.data?.message || 'Erro ao remover, confira se não existem produtos atrelados.', 'error');
    }
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="categorias-page">
      <div className="page-header">
        <h1>Categorias</h1>
        <button className="btn btn-primary" onClick={openNovoModal}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Nova Categoria
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Carregando categorias...</div>
      ) : (
        <div className="table-container">
          <table className="categorias-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Qtd. Produtos</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias?.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.nome}</td>
                  <td>{cat.produtosCount || 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-icon" title="Editar" onClick={() => openEditarModal(cat)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-icon" title="Excluir" onClick={() => setConfirmDelete(cat)}>
                      <Trash2 size={16} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
              {categorias?.length === 0 && (
                <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma categoria cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={isFormOpen} onClose={closeFormModal} title={categoriaEditing ? 'Editar Categoria' : 'Nova Categoria'}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>Nome da Categoria *</label>
            <input {...register('nome')} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.nome && <span style={{ color: 'red', fontSize: '0.75rem' }}>{errors.nome.message}</span>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={closeFormModal}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmação de Exclusão */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Excluir Categoria">
        <p style={{ marginBottom: '1.5rem' }}>Tem certeza que deseja excluir a categoria <strong>{confirmDelete?.nome}</strong>?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancelar</button>
          <button className="btn btn-primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}>
            {deleteMutation.isPending ? 'Aguarde...' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
