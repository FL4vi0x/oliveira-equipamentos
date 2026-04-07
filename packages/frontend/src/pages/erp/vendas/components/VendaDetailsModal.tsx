import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Printer, Download, User, ShoppingBag, CreditCard, LayoutDashboard } from 'lucide-react';
import { vendasService } from '../../../../services/vendas.service.ts';
import { formatCurrency, formatDate } from '../../../../utils/format.ts';
import { Button } from '../../../../components/ui/Button.tsx';
import { type Venda, StatusVenda } from '../../../../../../shared/types/venda.types';
import './VendaDetailsModal.css';

interface VendaDetailsModalProps {
  vendaId: string;
  onClose: () => void;
}

const VendaDetailsModal: React.FC<VendaDetailsModalProps> = ({ vendaId, onClose }) => {
  const { data: venda, isLoading } = useQuery<Venda>({
    queryKey: ['venda', vendaId],
    queryFn: () => vendasService.getById(vendaId).then((res) => (res as { data: Venda }).data),
  });

  if (isLoading) return null;

  const getStatusBadge = (status: StatusVenda) => {
    const labels: Record<string, string> = {
       [StatusVenda.CONCLUIDA]: 'Concluída',
       [StatusVenda.PENDENTE]: 'Pendente',
       [StatusVenda.ORCAMENTO]: 'Orçamento',
       [StatusVenda.CANCELADA]: 'Cancelada',
    };
    return <span className={`badge badge-${status.toLowerCase()}`}>{labels[status]}</span>;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container detail-modal">
        <header className="modal-header">
          <div className="header-title">
            <h2>Detalhes da Venda #{venda?.numero.toString().padStart(5, '0')}</h2>
            {venda && getStatusBadge(venda.status as StatusVenda)}
          </div>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </header>

        <div className="modal-body">
          <div className="detail-grid">
            {/* Informações Gerais */}
            <section className="detail-section">
              <h3 className="section-title"><LayoutDashboard size={18} /> Informações Gerais</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Data e Hora</span>
                  <span className="info-value">{venda ? formatDate(venda.createdAt) : '--'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Operador</span>
                  <span className="info-value">{venda?.usuario?.nome}</span>
                </div>
              </div>
            </section>

            {/* Cliente */}
            <section className="detail-section">
              <h3 className="section-title"><User size={18} /> Cliente</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Nome / Razão Social</span>
                  <span className="info-value">{venda?.cliente?.nome || 'Consumidor Final'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">CPF / CNPJ</span>
                  <span className="info-value">{venda?.cliente?.cpfCnpj || '--'}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Itens da Venda */}
          <section className="detail-section full-width">
            <h3 className="section-title"><ShoppingBag size={18} /> Itens da Venda</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Cod.</th>
                  <th>Produto</th>
                  <th>Qtd.</th>
                  <th>Preço Unit.</th>
                  <th>Desconto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {venda?.itens.map((item) => (
                  <tr key={item.id}>
                    <td>{item.produto?.codigoInterno}</td>
                    <td>{item.produto?.nome}</td>
                    <td>{Number(item.quantidade)}</td>
                    <td>{formatCurrency(Number(item.precoUnitario))}</td>
                    <td>{formatCurrency(Number(item.desconto))}</td>
                    <td className="font-bold">{formatCurrency(Number(item.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Financeiro */}
          <section className="detail-section full-width">
             <h3 className="section-title"><CreditCard size={18} /> Financeiro</h3>
             <div className="financial-container">
               <div className="payments-list">
                  <span className="sub-title">Formas de Pagamento</span>
                  {venda?.pagamentos.map((p) => (
                    <div key={p.id} className="payment-row">
                      <span>{(p.formaPagamento as string).replace('_', ' ')}</span>
                      <span className="font-bold">{formatCurrency(Number(p.valor))}</span>
                    </div>
                  ))}
               </div>
               
               <div className="totals-pannel">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(Number(venda?.subtotal))}</span>
                  </div>
                  <div className="total-row">
                    <span>Desconto Geral</span>
                    <span className="text-red">-{formatCurrency(Number(venda?.desconto))}</span>
                  </div>
                  <div className="total-row total-highlight">
                    <span>Total da Venda</span>
                    <span>{formatCurrency(Number(venda?.total))}</span>
                  </div>
               </div>
             </div>
          </section>

          {venda?.observacoes && (
            <section className="detail-section full-width">
              <h3 className="section-title">Observações</h3>
              <p className="observations-text">{venda.observacoes}</p>
            </section>
          )}
        </div>

        <footer className="modal-footer">
          <Button variant="secondary" icon={<Printer size={18} />} onClick={() => window.print()}>
            Imprimir Recibo
          </Button>
          <Button variant="secondary" icon={<Download size={18} />}>
            Exportar PDF
          </Button>
          <Button variant="primary" onClick={onClose}>
            Fechar
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default VendaDetailsModal;
