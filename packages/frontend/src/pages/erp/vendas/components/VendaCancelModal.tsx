import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { vendasService } from '../../../../services/vendas.service.ts';
import { Button } from '../../../../components/ui/Button.tsx';
import './VendaCancelModal.css';

interface VendaCancelModalProps {
  vendaId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const VendaCancelModal: React.FC<VendaCancelModalProps> = ({ vendaId, onClose, onSuccess }) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancelVenda = async () => {
    setIsCanceling(true);
    setError(null);
    try {
      await vendasService.cancelar(vendaId);
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro ao cancelar a venda. Tente novamente.';
      setError(errorMessage);
      setIsCanceling(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container cancel-modal">
        <header className="modal-header">
          <div className="header-title">
            <AlertTriangle className="text-red" size={24} />
            <h2>Confirmar Cancelamento</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="modal-body">
          <div className="warning-box">
             <p>Você está prestes a cancelar a venda <strong>#{vendaId.slice(0, 8)}</strong>.</p>
             <ul className="impact-list">
                <li>O status da venda será alterado para <strong>CANCELADA</strong>.</li>
                <li>O estoque dos produtos será <strong>recomposto automaticamente</strong>.</li>
                <li>O total da venda será <strong>removido do saldo do caixa</strong>.</li>
                <li>Esta ação <strong>não pode ser desfeita</strong>.</li>
             </ul>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        <footer className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isCanceling}>
            Manter Venda
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelVenda} 
            disabled={isCanceling}
            icon={isCanceling ? <Loader2 className="animate-spin" size={18} /> : undefined}
          >
            {isCanceling ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default VendaCancelModal;
