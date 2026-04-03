import { useRef, useEffect, memo } from 'react';
import { Barcode, Package } from 'lucide-react';

interface ProductSuggestion {
  id: string;
  nome: string;
  codigoInterno: string;
  estoqueAtual: number;
  unidadeMedida: string;
  precoVenda?: number | string;
}

interface ProductSearchProps {
  value: string;
  onChange: (v: string) => void;
  suggestions: ProductSuggestion[];
  selectedIndex: number;
  onSelectIndex: (i: number) => void;
  onConfirm: (product: ProductSuggestion) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

export const ProductSearch = memo(({
  value,
  onChange,
  suggestions,
  selectedIndex,
  onSelectIndex,
  onConfirm,
  onKeyDown,
  autoFocus,
}: ProductSearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Expor o foco para o pai via F2
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const showDropdown = value.length > 1 && suggestions.length > 0;

  const fmt = (n: number | string | undefined) =>
    Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <Barcode size={18} className="search-icon" />
        <input
          ref={inputRef}
          id="pdv-search"
          className="search-input"
          type="text"
          placeholder="Buscar produto por nome ou código..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
        <kbd className="search-kbd">F2</kbd>
      </div>

      {showDropdown && (
        <div className="search-dropdown" ref={listRef}>
          {suggestions.map((p, i) => (
            <div
              key={p.id}
              className={`search-result${i === selectedIndex ? ' search-result--active' : ''}`}
              onMouseEnter={() => onSelectIndex(i)}
              onClick={() => onConfirm(p)}
            >
              <div className="search-result-icon">
                <Package size={16} />
              </div>
              <div className="search-result-info">
                <div className="search-result-name">{p.nome}</div>
                <div className="search-result-meta">
                  SKU: {p.codigoInterno} &bull; Estoque: {p.estoqueAtual} {p.unidadeMedida}
                </div>
              </div>
              <div className="search-result-right">
                <span className="search-result-price">R$ {fmt(p.precoVenda)}</span>
                {i === selectedIndex && (
                  <kbd className="search-enter-kbd">↵ Enter</kbd>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length > 1 && suggestions.length === 0 && (
        <div className="search-dropdown">
          <div className="search-no-results">Nenhum produto encontrado para "{value}"</div>
        </div>
      )}
    </div>
  );
});

ProductSearch.displayName = 'ProductSearch';
