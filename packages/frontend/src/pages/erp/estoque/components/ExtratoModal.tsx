import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ArrowUpRight, ArrowDownRight, RefreshCw, FileText, ShoppingCart, Undo2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { estoqueService } from '../../../../services/estoque.service';
import type { TipoMovimentacao } from '../../../../../../shared/types/estoque.types';
import './ExtratoModal.css';

interface Props {
  produtoId: string;
  produtoNome: string;
  onClose: () => void;
}

export const ExtratoModal = ({ produtoId, produtoNome, onClose }: Props) => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['extrato-estoque', produtoId, page],
    queryFn: () => estoqueService.getExtrato(produtoId, { page, limit }),
    staleTime: 60 * 1000 // 1 min cache
  });

  const mData = data?.data || [];
  const meta = data?.meta;

  const renderIcon = (tipo: TipoMovimentacao) => {
    switch (tipo) {
      case 'ENTRADA': return <ArrowUpRight size={18} className="icon-in" />;
      case 'SAIDA': return <ArrowDownRight size={18} className="icon-out" />;
      case 'AJUSTE': return <RefreshCw size={18} className="icon-adjust" />;
      case 'VENDA': return <ShoppingCart size={18} className="icon-sale" />;
      case 'DEVOLUCAO': return <Undo2 size={18} className="icon-dev" />;
      default: return <FileText size={18} />;
    }
  };

  const isPositivo = (tipo: TipoMovimentacao) => ['ENTRADA', 'AJUSTE', 'DEVOLUCAO'].includes(tipo);

  return (
    <div className="modal-overlay">
      <div className="modal-content extrato-modal">
        <div className="modal-header">
          <div>
            <h2>Extrato de Estoque</h2>
            <p className="subtitle">{produtoNome}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="extrato-body">
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={32} className="spin" />
              <p>Carregando histórico...</p>
            </div>
          ) : isError ? (
            <div className="error-state">
              <p>Erro ao carregar o extrato.</p>
            </div>
          ) : mData.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma movimentação registrada para este produto.</p>
            </div>
          ) : (
            <>
              <table className="extrato-table">
                <thead>
                  <tr>
                    <th>Data e Hora</th>
                    <th>Operação</th>
                    <th>Qtd</th>
                    <th>Motivo</th>
                    <th>Usuário</th>
                  </tr>
                </thead>
                <tbody>
                  {mData.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <div className="date-cell">
                          <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                          <span className="time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td>
                        <div className="type-cell">
                          {renderIcon(m.tipo)}
                          <span>{m.tipo}</span>
                        </div>
                      </td>
                      <td>
                        <strong className={isPositivo(m.tipo) ? 'val-pos' : 'val-neg'}>
                          {isPositivo(m.tipo) ? '+' : '-'}{m.quantidade}
                        </strong>
                      </td>
                      <td>{m.motivo || <span className="text-muted">Nenhum</span>}</td>
                      <td>{m.usuario?.nome || <span className="text-muted">Sistema</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {meta && meta.totalPages > 1 && (
                 <div className="pagination">
                   <button 
                     disabled={page === 1} 
                     onClick={() => setPage(p => p - 1)}
                   >
                     <ChevronLeft size={16} /> Anterior
                   </button>
                   <span>Página {meta.page} de {meta.totalPages}</span>
                   <button 
                     disabled={page === meta.totalPages} 
                     onClick={() => setPage(p => p + 1)}
                   >
                     Próximo <ChevronRight size={16} />
                   </button>
                 </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
