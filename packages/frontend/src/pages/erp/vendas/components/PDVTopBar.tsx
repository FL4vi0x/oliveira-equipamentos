import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, ArrowLeft, User } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

interface PDVTopBarProps {
  caixaId?: string;
}

export const PDVTopBar = ({ caixaId }: PDVTopBarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const terminal = caixaId ? `Terminal ${caixaId.slice(-2).toUpperCase()}` : 'Terminal 01';

  return (
    <div className="pdv-topbar">
      <div className="pdv-topbar-left">
        <button className="pdv-back-btn" onClick={() => navigate('/erp')}>
          <ArrowLeft size={16} />
          Voltar ao ERP
        </button>

        <div className="pdv-topbar-title">
          <Monitor size={20} className="pdv-topbar-icon" />
          <span>Frente de Caixa</span>
        </div>

        <div className="pdv-caixa-badge">
          <span className="pdv-caixa-dot" />
          Caixa Aberto ({terminal})
        </div>
      </div>

      <div className="pdv-topbar-right">
        <div className="pdv-clock">{timeStr}</div>

        <div className="pdv-user">
          <div className="pdv-user-avatar">
            <User size={16} />
          </div>
          <span>{user?.nome || 'Operador'}</span>
        </div>
      </div>
    </div>
  );
};
