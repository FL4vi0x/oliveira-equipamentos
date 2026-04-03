interface SummaryPanelProps {
  subtotal: number;
  desconto?: number;
  acrescimo?: number;
}

export const SummaryPanel = ({ subtotal, desconto = 0, acrescimo = 0 }: SummaryPanelProps) => {
  const total = subtotal - desconto + acrescimo;
  const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="summary-panel">
      <div className="summary-rows">
        <div className="summary-row">
          <span className="summary-label">Subtotal</span>
          <span className="summary-value">R$ {fmt(subtotal)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Descontos</span>
          <span className="summary-value summary-value--discount">
            {desconto > 0 && <span className="summary-promo-badge">PROMOÇÃO</span>}
            {desconto > 0 ? `- R$ ${fmt(desconto)}` : 'R$ 0,00'}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Acréscimos</span>
          <span className="summary-value">R$ {fmt(acrescimo)}</span>
        </div>
      </div>

      <div className="summary-total-box">
        <span className="summary-total-label">TOTAL A PAGAR</span>
        <span className="summary-total-value">R$ {fmt(total)}</span>
      </div>
    </div>
  );
};
