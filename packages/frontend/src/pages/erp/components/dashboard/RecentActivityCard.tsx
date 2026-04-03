import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { ShoppingCart, Package } from 'lucide-react';
import './RecentActivityCard.css';

interface Activity {
  id: string;
  type: 'sale' | 'stock' | 'other';
  title: string;
  time: string;
  value?: string;
  icon?: React.ReactNode;
}

export const RecentActivityCard: React.FC = () => {
  // Dados mockados para atividade recente conforme imagem
  const activities: Activity[] = [
    {
      id: '1',
      type: 'sale',
      title: 'Venda PDV #1042',
      time: 'Há 5 min',
      value: 'R$ 150,00',
      icon: <ShoppingCart size={16} color="var(--color-primary-500)" />
    },
    {
      id: '2',
      type: 'stock',
      title: 'Entrada de Estoque',
      time: 'Há 32 min',
      value: '+50 itens',
      icon: <Package size={16} color="var(--color-primary-500)" />
    },
    {
      id: '3',
      type: 'sale',
      title: 'Venda PDV #1041',
      time: 'Há 1 hora',
      value: 'R$ 480,50',
      icon: <ShoppingCart size={16} color="var(--color-primary-500)" />
    }
  ];

  return (
    <Card className="recent-activity-card">
      <div className="card-header">
        <h3 className="card-title">Atividade Recente</h3>
        <p className="card-subtitle">Últimas movimentações</p>
      </div>

      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon-container">
              {activity.icon}
            </div>
            <div className="activity-info">
              <span className="activity-title">{activity.title}</span>
              <span className="activity-time">{activity.time}</span>
            </div>
            {activity.value && (
              <div className="activity-value">
                {activity.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
