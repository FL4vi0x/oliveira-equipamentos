import { CheckCircle2, XCircle } from 'lucide-react';

interface ActionButtonsProps {
  onFinalize: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const ActionButtons = ({ onFinalize, onCancel, disabled }: ActionButtonsProps) => (
  <div className="action-btns">
    <button
      id="btn-finalizar-venda"
      className="action-btn action-btn--primary"
      onClick={onFinalize}
      disabled={disabled}
    >
      <CheckCircle2 size={20} />
      <span>Finalizar Venda</span>
      <kbd className="action-kbd action-kbd--light">F12</kbd>
    </button>

    <button
      id="btn-cancelar-venda"
      className="action-btn action-btn--cancel"
      onClick={onCancel}
    >
      <XCircle size={16} />
      <span>Cancelar Tudo</span>
      <kbd className="action-kbd action-kbd--dark">ESC</kbd>
    </button>
  </div>
);
