import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, ArrowRight, Loader2, PackageOpen } from 'lucide-react';
import { estoqueService } from '../../../../services/estoque.service';
import { useToast } from '../../../../contexts/ToastContext';
import type { TipoMovimentacao } from '../../../../../../shared/types/estoque.types';
import './AjusteEstoqueModal.css';

interface Props {
  produtoId: string;
  produtoNome: string;
  estoqueAtual: number;
  unidadeMedida: string;
  onClose: () => void;
}

export const AjusteEstoqueModal = ({ produtoId, produtoNome, estoqueAtual, unidadeMedida, onClose }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [tipo, setTipo] = useState<TipoMovimentacao>('ENTRADA');
  const [quantidade, setQuantidade] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');

  const numQtd = parseFloat(quantidade) || 0;
  
  // Calcula o preview em tempo real
  const isSoma = ['ENTRADA', 'AJUSTE', 'DEVOLUCAO'].includes(tipo);
  const saldoFinal = isSoma ? estoqueAtual + numQtd : estoqueAtual - numQtd;

  const m = useMutation({
    mutationFn: () => estoqueService.movimentarEstoque({
      produtoId,
      tipo,
      quantidade: numQtd,
      motivo: motivo.trim() || undefined,
    }),
    onSuccess: () => {
      toast('Estoque movimentado com sucesso!', 'success');
      // Invalida a query global de estoque
      queryClient.invalidateQueries({ queryKey: ['produtos-estoque'] });
      // Invalida a query dos alertas do dashboard
      queryClient.invalidateQueries({ queryKey: ['alertas-estoque'] });
      // Invalida o extrato especificamente
      queryClient.invalidateQueries({ queryKey: ['extrato-estoque'] });
      onClose();
    },
    onError: (err: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (err as any)?.response?.data?.message || 'Erro ao movimentar estoque';
      toast(msg, 'error');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numQtd <= 0) {
      return toast('A quantidade deve ser maior que zero', 'error');
    }
    m.mutate();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="cf-modal-title">
              <PackageOpen size={20} className="text-primary" /> 
              Ajuste de Estoque
            </h2>
            <p className="cf-modal-desc">{'>>'} {produtoNome}</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="cliente-form modal-body" style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          
          <div className="cf-row cf-row-1 mb-2">
            <div className="cf-field">
              <div className="estoque-saldo-atual">
                Saldo atual: <strong>{estoqueAtual} {unidadeMedida}</strong>
              </div>
            </div>
          </div>

          <fieldset className="cf-fieldset">
            <legend className="cf-legend">Tipo de Operação</legend>
            <div className="cf-tipo-group" style={{ marginBottom: 0, display: 'flex', justifyContent: 'center' }}>
              <div className="cf-tipo-options" style={{ width: '100%', display: 'flex' }}>
                <button type="button" style={{flex: 1}} className={`cf-tipo-btn ${tipo === 'ENTRADA' ? 'active in' : ''}`} onClick={() => setTipo('ENTRADA')}>Entrada</button>
                <button type="button" style={{flex: 1}} className={`cf-tipo-btn ${tipo === 'SAIDA' ? 'active out' : ''}`} onClick={() => setTipo('SAIDA')}>Saída</button>
                <button type="button" style={{flex: 1}} className={`cf-tipo-btn ${tipo === 'AJUSTE' ? 'active' : ''}`} onClick={() => setTipo('AJUSTE')}>Ajuste</button>
                <button type="button" style={{flex: 1}} className={`cf-tipo-btn ${tipo === 'DEVOLUCAO' ? 'active' : ''}`} onClick={() => setTipo('DEVOLUCAO')}>Devolução</button>
              </div>
            </div>
          </fieldset>

          <fieldset className="cf-fieldset">
             <legend className="cf-legend">Detalhes do Ajuste</legend>

             <div className="cf-row cf-row-1">
                <div className="cf-field">
                  <label htmlFor="quantidade" className="cf-label">Quantidade ({unidadeMedida}) <span className="cf-required">*</span></label>
                  <input
                    id="quantidade"
                    type="number"
                    step="any"
                    min="0"
                    className="cf-input"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="Ex: 10"
                    required
                    autoFocus
                  />
                </div>
             </div>

             <div className="cf-row cf-row-1">
                <div className="cf-field">
                  <label htmlFor="motivo" className="cf-label">Motivo (Opcional)</label>
                  <textarea
                    id="motivo"
                    className="cf-input cf-textarea"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Razão do ajuste, avaria..."
                  />
                </div>
             </div>
          </fieldset>

          <div className="estoque-preview-box">
             <span className="epb-label">Preview do novo saldo:</span>
             <strong className="epb-number">{estoqueAtual}</strong> 
             <ArrowRight size={16} className="epb-arrow"/> 
             <strong className={`epb-number ${saldoFinal < 0 ? 'epb-neg' : 'epb-pos'}`}>
               {saldoFinal} {unidadeMedida}
             </strong>
          </div>

        </form>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1rem 1.5rem', borderTop: '1px solid #f1f3f5' }}>
          <button type="button" className="cf-btn-secondary" style={{ padding: '0.6rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer' }} onClick={onClose} disabled={m.isPending}>
            Cancelar
          </button>
          <button type="button" className="cf-btn-primary" style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px', background: '#6366f1', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleSubmit} disabled={m.isPending || numQtd <= 0}>
            {m.isPending && <Loader2 size={16} className="spin" style={{marginRight: '6px', display: 'inline-block'}} />}
            Confirmar Operação
          </button>
        </div>
      </div>
    </div>
  );
};
