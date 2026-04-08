import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Banknote, CreditCard, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { estoqueService } from '../../../services/estoque.service';
import { vendasService } from '../../../services/vendas.service';
import { useToast } from '../../../contexts/ToastContext';
import { AbrirCaixaModal } from './components/AbrirCaixaModal';
import { PDVTopBar } from './components/PDVTopBar';
import { CartList } from './components/CartList';
import type { CartItemData } from './components/CartList';
import { ProductSearch } from './components/ProductSearch';
import { SummaryPanel } from './components/SummaryPanel';
import { ActionButtons } from './components/ActionButtons';
import { type FormaPagamento, FormaPagamento as FPValue } from '../../../../../shared/types/venda.types';
import './PDVPage.css';

interface CaixaInfo {
  id: string;
  [key: string]: unknown;
}

export const PDVPage = () => {
  const { toast } = useToast();

  // ── Estado de Caixa ──────────────────────────────────────────
  const [localCaixa, setLocalCaixa] = useState<CaixaInfo | null>(null);

  const { data: caixa, isLoading: loadingCaixa } = useQuery({
    queryKey: ['caixa-ativo'],
    queryFn: vendasService.getCaixaAtivo,
  });

  const activeCaixa = localCaixa || (caixa as CaixaInfo | null);

  // ── Estado do Carrinho ───────────────────────────────────────
  const [cart, setCart] = useState<CartItemData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ── Estado de Busca ──────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [dropdownIndex, setDropdownIndex] = useState(0);

  // ── Modais ───────────────────────────────────────────────────
  const [showPayModal, setShowPayModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // ── Query de Produtos ────────────────────────────────────────
  const { data: allProducts = [] } = useQuery({
    queryKey: ['produtos-estoque'],
    queryFn: () => estoqueService.getAllProdutos(),
    staleTime: 30_000,
  });

  const suggestions = search.length > 1
    ? allProducts
        .filter(p =>
          p.nome.toLowerCase().includes(search.toLowerCase()) ||
          p.codigoInterno.toLowerCase().includes(search.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // ── Lógica do Carrinho ───────────────────────────────────────
  const addToCart = useCallback((p: { id: string; nome: string; codigoInterno: string; precoVenda?: number | string; unidadeMedida: string }) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.map(item =>
          item.id === p.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, {
        id: p.id,
        nome: p.nome,
        codigoInterno: p.codigoInterno,
        precoVenda: Number(p.precoVenda) || 0,
        quantidade: 1,
        unidadeMedida: p.unidadeMedida,
      }];
    });
    setSearch('');
    setDropdownIndex(0);
    setSelectedId(p.id);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantidade + delta);
        return { ...item, quantidade: newQty };
      }
      return item;
    }));
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + item.precoVenda * item.quantidade, 0);

  // ── Mutação: Finalizar Venda ─────────────────────────────────
  const { mutate: finalize, isPending } = useMutation({
    mutationFn: (forma: FormaPagamento) => vendasService.finalizarVenda({
      pagamentos: [{
        formaPagamento: forma,
        valor: subtotal,
      }],
      itens: cart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoUnitario: item.precoVenda,
      })),
    }),
    onSuccess: () => {
      setShowPayModal(false);
      setShowSuccess(true);
      setCart([]);
      setSelectedId(null);
      toast('Venda concluída com sucesso!', 'success');
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast(error?.response?.data?.message || 'Erro ao finalizar venda', 'error');
    },
  });

  // ── Navegação por Teclado no Dropdown ───────────────────────
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setDropdownIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setDropdownIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      addToCart(suggestions[dropdownIndex]);
    } else if (e.key === 'Escape') {
      setSearch('');
    }
  };

  // ── Atalhos Globais ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        if (cart.length > 0) setShowPayModal(true);
      }
      if (e.key === 'Escape' && showPayModal) {
        setShowPayModal(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cart.length, showPayModal]);

  // ── Loading ──────────────────────────────────────────────────
  if (loadingCaixa) {
    return (
      <div className="pdv-loading">
        <Loader2 className="pdv-loading-icon spin" size={40} />
        <span>Verificando status do caixa...</span>
      </div>
    );
  }

  // ── Sem Caixa Aberto ────────────────────────────────────────
  if (!activeCaixa) {
    return <AbrirCaixaModal onSuccess={(c) => setLocalCaixa(c as CaixaInfo)} />;
  }

  // ── Tela Principal ───────────────────────────────────────────
  return (
    <div className="pdv-root">
      <PDVTopBar caixaId={activeCaixa?.id} />

      <div className="pdv-body">
        {/* ESQUERDA: Carrinho */}
        <div className="pdv-left">
          <CartList
            items={cart}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
          />
        </div>

        {/* DIREITA: Busca (topo) + Resumo + Ações (base) */}
        <div className="pdv-right">
          <ProductSearch
            value={search}
            onChange={(val) => { setSearch(val); setDropdownIndex(0); }}
            suggestions={suggestions}
            selectedIndex={dropdownIndex}
            onSelectIndex={setDropdownIndex}
            onConfirm={addToCart}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />

          {/* Empurra o bloco abaixo para a base da coluna */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <SummaryPanel subtotal={subtotal} />
            <ActionButtons
              onFinalize={() => setShowPayModal(true)}
              onCancel={() => { setCart([]); setSelectedId(null); }}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      </div>

      {/* MODAL DE PAGAMENTO */}
      {showPayModal && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-content modal-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="cf-modal-title">Forma de Pagamento</h2>
              <p className="cf-modal-desc">
                Total: R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="pay-modal-grid">
              <button className="pay-modal-btn" onClick={() => finalize(FPValue.DINHEIRO)} disabled={isPending}>
                <Banknote size={36} className="pay-modal-icon pay-modal-icon--green" />
                <span>Dinheiro</span>
              </button>
              <button className="pay-modal-btn" onClick={() => finalize(FPValue.CARTAO_CREDITO)} disabled={isPending}>
                <CreditCard size={36} className="pay-modal-icon pay-modal-icon--blue" />
                <span>Cartão</span>
              </button>
              <button className="pay-modal-btn" onClick={() => finalize(FPValue.PIX)} disabled={isPending}>
                <QrCode size={36} className="pay-modal-icon pay-modal-icon--teal" />
                <span>PIX</span>
              </button>
              <button className="pay-modal-btn" disabled>
                <span style={{ fontSize: '2rem' }}>···</span>
                <span>Outros</span>
              </button>
            </div>
            {isPending && (
              <div className="pay-modal-loading">
                <Loader2 size={20} className="spin" /> Processando...
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE SUCESSO */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content modal-sm success-modal">
            <CheckCircle2 size={72} className="success-icon" />
            <h2 className="success-title">Venda Realizada!</h2>
            <p className="success-desc">Deseja imprimir o comprovante?</p>
            <div className="success-actions">
              <button
                className="cf-btn-primary"
                onClick={() => setShowSuccess(false)}
              >
                Nova Venda
              </button>
              <button
                className="cf-btn-secondary"
                onClick={() => { window.print(); setShowSuccess(false); }}
              >
                Imprimir Recibo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
