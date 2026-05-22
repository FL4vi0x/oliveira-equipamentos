import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, QrCode, CheckCircle2, Loader2, ScrollText, User, Search } from 'lucide-react';
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
import { clientesService } from '../../../services/clientes.service';
import './PDVPage.css';

interface CaixaInfo {
  id: string;
  [key: string]: unknown;
}

export const PDVPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

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
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<{ id: string, nome: string, cpfCnpj: string } | null>(null);
  const [clientSearch, setClientSearch] = useState('');

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

  // ── Query de Clientes ───────────────────────────────────────
  const { data: clientResults } = useQuery({
    queryKey: ['clientes-pdv', clientSearch],
    queryFn: () => clientesService.getAll({ search: clientSearch, limit: 5 }),
    enabled: clientSearch.length > 2,
  });

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

  const queryClient = useQueryClient();
  const { mutate: finalize, isPending } = useMutation({
    mutationFn: (forma: FormaPagamento) => vendasService.finalizarVenda({
      clienteId: selectedCliente?.id,
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
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
      setShowPayModal(false);
      setShowSuccess(true);
      setCart([]);
      setSelectedId(null);
      setSelectedCliente(null);
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
      if (e.key === 'F1') {
        e.preventDefault();
        setShowClientModal(true);
      }
      if (e.key === 'Escape') {
        if (showPayModal) setShowPayModal(false);
        if (showClientModal) setShowClientModal(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cart.length, showPayModal, showClientModal]);

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
    return <AbrirCaixaModal 
             onSuccess={(c) => setLocalCaixa(c as CaixaInfo)} 
             onClose={() => navigate(-1)} 
           />;
  }

  // ── Tela Principal ───────────────────────────────────────────
  return (
    <div className="pdv-root">
      <PDVTopBar caixaId={activeCaixa?.id} />

      <div className="pdv-body">
        {/* ESQUERDA: Cliente + Carrinho */}
        <div className="pdv-left">
          <div className="cliente-selection-bar">
            {selectedCliente ? (
              <div className="selected-cliente-info">
                <div className="cliente-avatar">
                  <User size={20} />
                </div>
                <div className="cliente-details">
                  <span className="cliente-name">{selectedCliente.nome}</span>
                  <span className="cliente-doc">{selectedCliente.cpfCnpj}</span>
                </div>
                <button className="btn-remove-cliente" onClick={() => setSelectedCliente(null)}>&times;</button>
              </div>
            ) : (
              <button className="btn-identify-cliente" onClick={() => setShowClientModal(true)}>
                <User size={18} />
                <span>Identificar Cliente (F1)</span>
              </button>
            )}
          </div>

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
              <button className="pay-modal-btn" onClick={() => finalize(FPValue.PROMISSORIA)} disabled={isPending}>
                <ScrollText size={36} className="pay-modal-icon pay-modal-icon--blue" />
                <span>Promissória</span>
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

      {/* MODAL DE BUSCA DE CLIENTE */}
      {showClientModal && (
        <div className="modal-overlay" onClick={() => setShowClientModal(false)}>
          <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="cf-modal-title">Identificar Cliente</h2>
              <button onClick={() => setShowClientModal(false)} className="cf-btn-icon">&times;</button>
            </div>
            <div className="modal-body" style={{ padding: '1.5rem' }}>
              <div className="cf-field">
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    className="cf-input"
                    style={{ paddingLeft: '40px' }}
                    placeholder="Buscar por nome ou CPF..."
                    autoFocus
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="client-results" style={{ marginTop: '1rem' }}>
                {clientResults?.data && clientResults.data.length > 0 ? (
                  clientResults.data.map(c => (
                    <div 
                      key={c.id} 
                      className="client-result-item" 
                      onClick={() => {
                        setSelectedCliente({ id: c.id, nome: c.nome, cpfCnpj: c.cpfCnpj });
                        setShowClientModal(false);
                        setClientSearch('');
                      }}
                    >
                      <User size={16} />
                      <div className="result-info">
                        <span className="result-name">{c.nome}</span>
                        <span className="result-doc">{c.cpfCnpj}</span>
                      </div>
                    </div>
                  ))
                ) : clientSearch.length > 2 ? (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                    Nenhum cliente encontrado.
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
                    Digite pelo menos 3 caracteres...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
