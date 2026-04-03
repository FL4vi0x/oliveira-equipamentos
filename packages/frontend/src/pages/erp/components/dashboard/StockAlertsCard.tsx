import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './StockAlertsCard.css';

interface StockAlert {
  id: string;
  nome: string;
  sku: string;
  quantidade: number;
  minimo: number;
  criticidade: 'CRITICO' | 'ATENÇÃO';
}

interface StockAlertsCardProps {
  alerts: StockAlert[];
}

export const StockAlertsCard: React.FC<StockAlertsCardProps> = ({ alerts }) => {
  const navigate = useNavigate();

  return (
    <Card className="stock-alerts-card">
      <div className="card-header-flex">
        <div className="card-titles">
          <h3 className="card-title">Estoque Crítico & Alertas</h3>
          <p className="card-subtitle">Produtos que precisam de atenção imediata</p>
        </div>
        <button className="btn-view-all" onClick={() => navigate('/erp/estoque')}>
          Ver todos
        </button>
      </div>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum alerta de estoque no momento.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="alert-row">
              <div className="alert-icon">
                <AlertTriangle size={18} className={alert.criticidade === 'CRITICO' ? 'icon-critical' : 'icon-warning'} />
              </div>
              <div className="alert-main-info">
                <span className="product-name">{alert.nome}</span>
                <span className="product-sku">SKU: {alert.sku}</span>
              </div>
              <div className="alert-qty">
                <span className="qty-value">{alert.quantidade} unidades</span>
              </div>
              <div className="alert-status">
                <Badge variant={alert.criticidade === 'CRITICO' ? 'critical' : 'warning'}>
                  {alert.criticidade}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
