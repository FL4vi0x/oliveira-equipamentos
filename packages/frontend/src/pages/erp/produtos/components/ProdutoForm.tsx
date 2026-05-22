import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriasService, type Categoria } from '../../../../services/categorias.service';
import { produtosService } from '../../../../services/produtos.service';
import { useToast } from '../../../../contexts/ToastContext';
import './ProdutoForm.css';

const schema = z.object({
  codigoInterno: z.string().min(1, 'Código é obrigatório'),
  codigoBarras: z.string().optional(),
  nome: z.string().min(3, 'Nome muito curto'),
  descricao: z.string().optional(),
  categoriaId: z.string().uuid('Categoria inválida'),
  unidadeMedida: z.string().min(1, 'Obrigatório'),
  precoCompra: z.coerce.number().min(0, 'Não pode ser negativo'),
  precoVenda: z.coerce.number().min(0, 'Não pode ser negativo'),
  estoqueAtual: z.coerce.number().optional().default(0),
  estoqueMinimo: z.coerce.number().optional().default(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  produtoId?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProdutoForm: React.FC<Props> = ({ produtoId, initialData, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!produtoId;

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: initialData || {
      unidadeMedida: 'UN',
      precoCompra: 0,
      precoVenda: 0,
      estoqueAtual: 0,
      estoqueMinimo: 0,
    }
  });

  const { data: categorias, isLoading: loadingCat } = useQuery<Categoria[]>({
    queryKey: ['categorias'],
    queryFn: categoriasService.getAll,
  });

  const precoCompra = useWatch({ control, name: 'precoCompra', defaultValue: 0 });
  const precoVenda = useWatch({ control, name: 'precoVenda', defaultValue: 0 });

  const margem = precoCompra > 0 && precoVenda > 0 
    ? ((precoVenda - precoCompra) / precoCompra) * 100 
    : 0;

  const mutation = useMutation({
    mutationFn: (data: FormData) => isEditing ? produtosService.update(produtoId, data) : produtosService.create(data),
    onSuccess: () => {
      toast(isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      queryClient.invalidateQueries({ queryKey: ['categorias'] }); // pra att contador
      onSuccess();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Erro ao salvar produto';
      toast(msg, 'error');
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    mutation.mutate(data as FormData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="produto-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Código Interno *</label>
          <input {...register('codigoInterno')} className={errors.codigoInterno ? 'error' : ''} />
          {errors.codigoInterno && <span className="error-text">{errors.codigoInterno.message}</span>}
        </div>
        
        <div className="form-group">
          <label>Nome do Produto *</label>
          <input {...register('nome')} className={errors.nome ? 'error' : ''} />
          {errors.nome && <span className="error-text">{errors.nome.message}</span>}
        </div>

        <div className="form-group">
          <label>Categoria *</label>
          <select {...register('categoriaId')} className={errors.categoriaId ? 'error' : ''}>
            <option value="">Selecione...</option>
            {loadingCat ? <option disabled>Carregando...</option> : categorias?.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          {errors.categoriaId && <span className="error-text">{errors.categoriaId.message}</span>}
        </div>

        <div className="form-group">
          <label>Unidade de Medida *</label>
          <select {...register('unidadeMedida')}>
            <option value="UN">Unidade (UN)</option>
            <option value="KG">Quilograma (KG)</option>
            <option value="CX">Caixa (CX)</option>
            <option value="PC">Peça (PC)</option>
            <option value="M">Metro (M)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Preço de Compra</label>
          <div className="input-money">
            <span>R$</span>
            <input type="number" step="0.01" {...register('precoCompra')} />
          </div>
        </div>

        <div className="form-group">
          <label>Preço de Venda</label>
          <div className="input-money">
            <span>R$</span>
            <input type="number" step="0.01" {...register('precoVenda')} />
          </div>
        </div>

        <div className="form-group">
          <label>Margem de Lucro</label>
          <div className={`margem-badge ${margem > 30 ? 'good' : margem > 10 ? 'warn' : 'bad'}`}>
            {margem.toFixed(2)}%
          </div>
        </div>

        <div className="form-group">
          <label>Estoque Atual</label>
          <input type="number" {...register('estoqueAtual')} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  );
};
