import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  icon, 
  iconBgColor = '#f1f5f9',
  iconColor = '#64748b'
}) => {
  return (
    <Card className="stat-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <div 
          className="stat-icon-container" 
          style={{ backgroundColor: iconBgColor, color: iconColor }}
        >
          {icon}
        </div>
      </div>
      <div className="stat-content">
        <h2 className="stat-value">{value}</h2>
        {trend && (
          <div className={`stat-trend ${trend.isUp ? 'trend-up' : 'trend-down'}`}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </Card>
  );
};
