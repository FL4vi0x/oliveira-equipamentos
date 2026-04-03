import { memo } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface CartItemData {
  id: string;
  nome: string;
  codigoInterno: string;
  precoVenda: number;
  quantidade: number;
  unidadeMedida: string;
}

interface CartItemRowProps {
  item: CartItemData;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartItemRow = memo(({ item, index, isSelected, onSelect, onUpdateQty, onRemove }: CartItemRowProps) => {
  const subtotal = item.precoVenda * item.quantidade;
  const fmt = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <tr
      className={`cart-row${isSelected ? ' cart-row--selected' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      <td className="cart-cell cart-cell--index">
        <span className="cart-index-badge">{String(index + 1).padStart(2, '0')}</span>
      </td>
      <td className="cart-cell cart-cell--product">
        <div className="cart-product-name">{item.nome}</div>
        <div className="cart-product-sku">SKU: {item.codigoInterno}</div>
      </td>
      <td className="cart-cell cart-cell--qty">
        <div className="cart-qty-controls">
          <button
            className="cart-qty-btn"
            onClick={(e) => { e.stopPropagation(); onUpdateQty(item.id, -1); }}
            aria-label="Diminuir"
          >
            <Minus size={12} />
          </button>
          <span className="cart-qty-value">{item.quantidade}</span>
          <button
            className="cart-qty-btn"
            onClick={(e) => { e.stopPropagation(); onUpdateQty(item.id, 1); }}
            aria-label="Aumentar"
          >
            <Plus size={12} />
          </button>
        </div>
      </td>
      <td className="cart-cell cart-cell--price">R$ {fmt(item.precoVenda)}</td>
      <td className="cart-cell cart-cell--subtotal">R$ {fmt(subtotal)}</td>
      <td className="cart-cell cart-cell--action">
        <button
          className="cart-remove-btn"
          onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
          aria-label="Remover item"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
});

CartItemRow.displayName = 'CartItemRow';

interface CartListProps {
  items: CartItemData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartList = ({ items, selectedId, onSelect, onUpdateQty, onRemove }: CartListProps) => (
  <div className="cart-container">
    <div className="cart-header">
      <h2 className="cart-title">Carrinho de Vendas</h2>
      {items.length > 0 && (
        <span className="cart-count-badge">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
      )}
    </div>

    {items.length === 0 ? (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <p>Carrinho vazio</p>
        <small>Busque um produto pelo campo ao lado</small>
      </div>
    ) : (
      <div className="cart-table-wrapper">
        <table className="cart-table">
          <thead>
            <tr className="cart-head-row">
              <th className="cart-th cart-th--index"></th>
              <th className="cart-th cart-th--product">ITEM / PRODUTO</th>
              <th className="cart-th cart-th--qty">QUANTIDADE</th>
              <th className="cart-th cart-th--price">V. UNITÁRIO</th>
              <th className="cart-th cart-th--subtotal">SUBTOTAL</th>
              <th className="cart-th cart-th--action"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <CartItemRow
                key={item.id}
                item={item}
                index={index}
                isSelected={selectedId === item.id}
                onSelect={onSelect}
                onUpdateQty={onUpdateQty}
                onRemove={onRemove}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
