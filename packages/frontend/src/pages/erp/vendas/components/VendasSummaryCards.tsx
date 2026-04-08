import React from 'react';
import { TrendingUp, ShoppingBag, DollarSign, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/format.ts';
import './VendasSummaryCards.css';

interface VendasSummaryCardsProps {
  summary?: {
    totalVendido: number;
    vendasConcluidas: number;
    ticketMedio: number;
    cancelamentos: number;
  };
  isLoading: boolean;
}

const VendasSummaryCards: React.FC<VendasSummaryCardsProps> = ({ summary, isLoading }) => {
  const cards = [
    {
      title: 'Total Vendido',
      value: summary ? formatCurrency(summary.totalVendido) : 'R$ 0,00',
      description: 'Faturamento bruto no período',
      icon: <DollarSign size={24} />,
      color: 'blue'
    },
    {
      title: 'Vendas Concluídas',
      value: summary ? summary.vendasConcluidas : '0',
      description: 'Transações finalizadas',
      icon: <ShoppingBag size={24} />,
      color: 'emerald'
    },
    {
      title: 'Ticket Médio',
      value: summary ? formatCurrency(summary.ticketMedio) : 'R$ 0,00',
      description: 'Valor médio por venda',
      icon: <TrendingUp size={24} />,
      color: 'indigo'
    },
    {
      title: 'Cancelamentos',
      value: summary ? summary.cancelamentos : '0',
      description: 'Vendas estornadas',
      icon: <XCircle size={24} />,
      color: 'red'
    }
  ];

  return (
    <div className="vendas-summary-grid">
      {cards.map((card, index) => (
        <div key={index} className={`summary-card ${isLoading ? 'loading' : ''}`}>
          <div className={`card-icon bg-${card.color}`}>
            {card.icon}
          </div>
          <div className="card-content">
            <span className="card-title">{card.title}</span>
            <div className="card-value-container">
               <span className="card-value">{card.value}</span>
            </div>
            <span className="card-desc">{card.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendasSummaryCards;
