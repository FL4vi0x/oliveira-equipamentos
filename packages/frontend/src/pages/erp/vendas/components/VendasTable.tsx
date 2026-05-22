import React from 'react';
import { Eye, Trash2, ChevronLeft, ChevronRight, Printer, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/format.ts';
import { Button } from '../../../../components/ui/Button.tsx';
import { type Venda, StatusVenda } from '../../../../../../shared/types/venda.types.ts';
import './VendasTable.css';

interface VendasTableProps {
  data: Venda[];
  isLoading: boolean;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onViewDetails: (id: string) => void;
  onCancel: (id: string) => void;
  onGerarDocumentos: (id: string) => void;
}

const VendasTable: React.FC<VendasTableProps> = ({ 
  data, 
  isLoading, 
  meta, 
  onPageChange,
  onViewDetails,
  onCancel,
  onGerarDocumentos
}) => {
  if (isLoading) {
    return <div className="table-loading">Carregando dados da venda...</div>;
  }

  if (data.length === 0) {
    return <div className="table-empty">Nenhuma venda encontrada com os filtros selecionados.</div>;
  }

  const getStatusBadge = (status: StatusVenda) => {
    const labels: Record<string, string> = {
       [StatusVenda.CONCLUIDA]: 'Concluída',
       [StatusVenda.PENDENTE]: 'Pendente',
       [StatusVenda.ORCAMENTO]: 'Orçamento',
       [StatusVenda.CANCELADA]: 'Cancelada',
    };
    return <span className={`badge badge-${status.toLowerCase()}`}>{labels[status]}</span>;
  };

  const getPagamentosResumo = (pagamentos: { formaPagamento: string }[]) => {
    if (!pagamentos || pagamentos.length === 0) return 'N/A';
    const uniqueTypes = Array.from(new Set(pagamentos.map(p => p.formaPagamento)));
    if (uniqueTypes.length > 1) return `Múltiplo (${uniqueTypes.length})`;
    return (uniqueTypes[0] as string).replace('_', ' ');
  };

  return (
    <div className="table-wrapper">
      <table className="vendas-table">
        <thead>
          <tr>
            <th>Nº Venda</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Operador</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((venda) => (
            <tr key={venda.id}>
              <td className="font-bold">#{venda.numero.toString().padStart(5, '0')}</td>
              <td>{formatDate(venda.createdAt)}</td>
              <td>
                <div className="cliente-info">
                  <span className="cliente-nome">{venda.cliente?.nome || 'Consumidor Final'}</span>
                  <span className="cliente-doc">{venda.cliente?.cpfCnpj || '--'}</span>
                </div>
              </td>
              <td>{venda.usuario?.nome}</td>
              <td className="font-bold">{formatCurrency(Number(venda.total))}</td>
              <td>{getPagamentosResumo(venda.pagamentos)}</td>
              <td>{getStatusBadge(venda.status)}</td>
              <td className="text-right actions-cell">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={<Eye size={16} />} 
                  onClick={() => onViewDetails(venda.id)}
                  title="Ver Detalhes"
                />
                <Button 
                  variant="secondary" 
                  size="sm" 
                  icon={<Printer size={16} />} 
                  onClick={() => {}}
                  title="Imprimir"
                />
                {venda.status !== StatusVenda.CANCELADA && (
                  <>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      icon={<FileText size={16} />} 
                      onClick={() => onGerarDocumentos(venda.id)}
                      title="Gerar Contratos e Promissórias"
                    />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      icon={<Trash2 size={16} />} 
                      onClick={() => onCancel(venda.id)}
                      title="Cancelar Venda"
                    />
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && meta.totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Mostrando <b>{data.length}</b> de <b>{meta.total}</b> vendas
          </span>
          <div className="pagination-controls">
            <button 
              disabled={meta.page === 1} 
              onClick={() => onPageChange(meta.page - 1)}
              className="pagination-btn"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-current">{meta.page}</span>
            <button 
              disabled={meta.page >= meta.totalPages} 
              onClick={() => onPageChange(meta.page + 1)}
              className="pagination-btn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendasTable;
