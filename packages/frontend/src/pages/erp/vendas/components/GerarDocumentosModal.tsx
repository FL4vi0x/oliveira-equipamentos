import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FileText, Loader2, Calendar, Hash, DollarSign } from 'lucide-react';
import { vendasService } from '../../../../services/vendas.service';
import { useToast } from '../../../../contexts/ToastContext';

interface Props {
  vendaId: string;
  onClose: () => void;
}

export const GerarDocumentosModal = ({ vendaId, onClose }: Props) => {
  const { toast } = useToast();
  const [numeroParcelas, setNumeroParcelas] = useState<number>(30);
  const [valorEntrada, setValorEntrada] = useState<string>('0');
  const [dataInicio, setDataInicio] = useState<string>('');

  const { mutate: gerar, isPending } = useMutation({
    mutationFn: () => 
      vendasService.gerarDocumentos(vendaId, {
        numeroParcelas,
        valorEntrada: parseFloat(valorEntrada) || 0,
        dataInicio: dataInicio || undefined,
      }),
    onSuccess: (response: { data: BlobPart }) => {
      // Criar link para download do Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `documentos-venda-${vendaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast('Documentos gerados com sucesso!', 'success');
      onClose();
    },
    onError: (err: unknown) => {
      console.error(err);
      const errorObj = err as { response?: { data?: { message?: string | string[] } } };
      const message = errorObj.response?.data?.message || 'Erro ao gerar documentos em PDF';
      toast(Array.isArray(message) ? message[0] : message, 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    gerar();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="cf-modal-title">
              <FileText size={22} className="text-primary" />
              Gerar Documentação
            </h2>
            <p className="cf-modal-desc">Configure os parâmetros de parcelamento para o PDF.</p>
          </div>
          <button onClick={onClose} className="cf-btn-icon">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="cliente-form" style={{ padding: '1.5rem' }}>
          <div className="cf-field">
            <label className="cf-label">Número de Parcelas (Semanas)</label>
            <div style={{ position: 'relative' }}>
              <Hash size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="number"
                min="1"
                max="104"
                className="cf-input"
                style={{ paddingLeft: '40px' }}
                value={numeroParcelas}
                onChange={(e) => setNumeroParcelas(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="cf-field" style={{ marginTop: '1rem' }}>
            <label className="cf-label">Valor de Entrada (R$)</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="number"
                step="0.01"
                min="0"
                className="cf-input"
                style={{ paddingLeft: '40px' }}
                value={valorEntrada}
                onChange={(e) => setValorEntrada(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="cf-field" style={{ marginTop: '1rem' }}>
            <label className="cf-label">Data da 1ª Parcela (Opcional)</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="date"
                className="cf-input"
                style={{ paddingLeft: '40px' }}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Deixe vazio para o próximo sábado.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button
              type="submit"
              className="cf-btn-primary"
              style={{ width: '100%', height: '48px' }}
              disabled={isPending}
            >
              {isPending ? <Loader2 size={20} className="spin" /> : 'Gerar PDF e Salvar Parcelas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
