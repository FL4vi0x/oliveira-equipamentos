import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { Rocket, Box, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuickActionsCard.css';

export const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="quick-actions-card">
      <div className="card-header">
        <h3 className="card-title">Ações Rápidas</h3>
        <p className="card-subtitle">Atalhos principais do sistema</p>
      </div>

      <div className="actions-list">
        <button className="action-item primary" onClick={() => navigate('/erp/pdv')}>
          <div className="action-icon-main">
            <Rocket size={20} />
          </div>
          <div className="action-info">
            <span className="action-label">Abrir Frente de Caixa</span>
            <span className="action-desc">Iniciar operações do PDV</span>
          </div>
          <ArrowRight size={18} className="action-arrow" />
        </button>

        <button className="action-item secondary" onClick={() => navigate('/erp/produtos')}>
          <div className="action-icon-sec">
            <Box size={20} />
          </div>
          <div className="action-info">
            <span className="action-label">Gerenciar Produtos</span>
            <span className="action-desc">Cadastrar ou editar itens</span>
          </div>
          <ArrowRight size={18} className="action-arrow" />
        </button>

        <button className="action-item secondary" onClick={() => navigate('/erp/estoque')}>
          <div className="action-icon-sec">
            <Database size={20} />
          </div>
          <div className="action-info">
            <span className="action-label">Ajustar Estoque</span>
            <span className="action-desc">Lançar entradas e saídas</span>
          </div>
          <ArrowRight size={18} className="action-arrow" />
        </button>
      </div>
    </Card>
  );
};
