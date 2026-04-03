import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Store, Loader2, DollarSign } from 'lucide-react';
import { vendasService } from '../../../../services/vendas.service';
import { useToast } from '../../../../contexts/ToastContext';

interface Props {
  onSuccess: (caixa: unknown) => void;
}

export const AbrirCaixaModal = ({ onSuccess }: Props) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [saldo, setSaldo] = useState<string>('0');

  const { mutate, isPending } = useMutation({
    mutationFn: () => vendasService.abrirCaixa(parseFloat(saldo) || 0),
    onSuccess: (data) => {
      toast('Caixa aberto com sucesso!', 'success');
      queryClient.invalidateQueries({ queryKey: ['caixa-ativo'] });
      onSuccess(data);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erro ao abrir caixa';
      toast(msg, 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-sm">
        <div className="modal-header">
          <div>
            <h2 className="cf-modal-title">
              <Store size={22} className="text-primary" />
              Abertura de Caixa
            </h2>
            <p className="cf-modal-desc">Informe o saldo inicial para começar o dia.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cliente-form" style={{ padding: '1.5rem' }}>
          <div className="cf-field">
            <label className="cf-label">Saldo Inicial em Dinheiro (R$)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="number"
                step="0.01"
                min="0"
                className="cf-input"
                style={{ paddingLeft: '40px' }}
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                placeholder="0.00"
                autoFocus
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="cf-btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '1rem' }}
              disabled={isPending}
            >
              {isPending ? <Loader2 size={20} className="spin" /> : 'Abrir Frente de Caixa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
