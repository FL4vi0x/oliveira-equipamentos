import React from 'react';
import { Card } from '../../../../components/ui/Card';
import { ChevronDown } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import './SalesOverviewCard.css';

const data = [
  { name: 'Qua', value: 0 },
  { name: 'Qui', value: 2100 },
  { name: 'Sex', value: 3200 },
  { name: 'Sáb', value: 2400 },
  { name: 'Dom', value: 4100 },
  { name: 'Seg', value: 3800 },
  { name: 'Ter', value: 5200 },
  { name: 'Qua', value: 6500 },
];

export const SalesOverviewCard: React.FC = () => {
  return (
    <Card className="sales-overview-card">
      <div className="card-header-flex">
        <div className="card-titles">
          <h3 className="card-title">Visão Geral de Vendas</h3>
          <p className="card-subtitle">Faturamento dos últimos 7 dias</p>
        </div>
        <div className="period-selector">
          <span>Últimos 7 dias</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              tickFormatter={(value) => `R$ ${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: 'var(--radius-md)', 
                border: 'none', 
                boxShadow: 'var(--shadow-md)',
                fontSize: 'var(--font-size-sm)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary-500)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
