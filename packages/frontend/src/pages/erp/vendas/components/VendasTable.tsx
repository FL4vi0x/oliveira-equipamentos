import React from 'react';
import { Eye, Trash2, ChevronLeft, ChevronRight, Printer, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../../utils/format.ts';
import { IconButton } from '../../../../components/ui/IconButton.tsx';
import { ActionGroup } from '../../../../components/ui/ActionGroup.tsx';
import { StatusBadge } from '../../../../components/ui/StatusBadge.tsx';
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

const statusConfig: Record<StatusVenda, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }> = {
  [StatusVenda.CONCLUIDA]: { label: 'Concluída', variant: 'success' },
  [StatusVenda.PENDENTE]: { label: 'Pendente', variant: 'warning' },
  [StatusVenda.ORCAMENTO]: { label: 'Orçamento', variant: 'info' },
  [StatusVenda.CANCELADA]: { label: 'Cancelada', variant: 'danger' },
};

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
    const config = statusConfig[status];
    return <StatusBadge variant={config.variant}>{config.label}</StatusBadge>;
  };

  const getPagamentosResumo = (pagamentos: { formaPagamento: string }[]) => {
    if (!pagamentos || pagamentos.length === 0) return 'N/A';
    const uniqueTypes = Array.from(new Set(pagamentos.map(p => p.formaPagamento)));
    if (uniqueTypes.length > 1) return `Múltiplo (${uniqueTypes.length})`;
    return (uniqueTypes[0] as string).replace('_', ' ');
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>Nº Venda</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Operador</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((venda) => (
            <tr key={venda.id}>
              <td className="cell-bold">#{venda.numero.toString().padStart(5, '0')}</td>
              <td>{formatDate(venda.createdAt)}</td>
              <td>
                <div className="cell-stacked">
                  <span className="cell-primary">{venda.cliente?.nome || 'Consumidor Final'}</span>
                  <span className="cell-secondary">{venda.cliente?.cpfCnpj || '--'}</span>
                </div>
              </td>
              <td>{venda.usuario?.nome}</td>
              <td className="cell-bold">{formatCurrency(Number(venda.total))}</td>
              <td>{getPagamentosResumo(venda.pagamentos)}</td>
              <td>{getStatusBadge(venda.status)}</td>
              <td className="col-actions">
                <ActionGroup>
                  <IconButton 
                    variant="default" 
                    size="sm" 
                    icon={<Eye size={16} />} 
                    onClick={() => onViewDetails(venda.id)}
                    title="Ver Detalhes"
                    aria-label="Ver detalhes da venda"
                  />
                  <IconButton 
                    variant="default" 
                    size="sm" 
                    icon={<Printer size={16} />} 
                    onClick={() => {}}
                    title="Imprimir"
                    aria-label="Imprimir venda"
                  />
                  {venda.status !== StatusVenda.CANCELADA && (
                    <>
                      <IconButton 
                        variant="default" 
                        size="sm" 
                        icon={<FileText size={16} />} 
                        onClick={() => onGerarDocumentos(venda.id)}
                        title="Gerar Contratos e Promissórias"
                        aria-label="Gerar documentos"
                      />
                      <IconButton 
                        variant="danger" 
                        size="sm" 
                        icon={<Trash2 size={16} />} 
                        onClick={() => onCancel(venda.id)}
                        title="Cancelar Venda"
                        aria-label="Cancelar venda"
                      />
                    </>
                  )}
                </ActionGroup>
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
              aria-label="Página anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="page-current">{meta.page}</span>
            <button 
              disabled={meta.page >= meta.totalPages} 
              onClick={() => onPageChange(meta.page + 1)}
              className="pagination-btn"
              aria-label="Próxima página"
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
