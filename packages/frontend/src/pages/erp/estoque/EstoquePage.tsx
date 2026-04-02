import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PackageOpen, AlertTriangle, ArrowRightLeft, FileClock, Loader2, Search } from 'lucide-react';
import { estoqueService } from '../../../services/estoque.service';
import { useAuth } from '../../../contexts/AuthContext';
import { AjusteEstoqueModal } from './components/AjusteEstoqueModal';
import { ExtratoModal } from './components/ExtratoModal';
import type { ProdutoEstoqueAlert } from '../../../../../shared/types/estoque.types';
import './EstoquePage.css';

export const EstoquePage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [apenasAlertas, setApenasAlertas] = useState(false);

  // Controle de Modais
  const [ajusteModal, setAjusteModal] = useState<ProdutoEstoqueAlert | null>(null);
  const [extratoModal, setExtratoModal] = useState<ProdutoEstoqueAlert | null>(null);

  const { data: produtos, isLoading, isError } = useQuery({
    queryKey: ['produtos-estoque'],
    queryFn: () => estoqueService.getAllProdutos(),
  });

  const canEdit = user && ['ADMIN', 'GERENTE', 'ESTOQUISTA'].includes(user.perfil);

  const filteredProdutos = produtos?.filter((p) => {
    const textMatch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      p.codigoInterno.toLowerCase().includes(searchTerm.toLowerCase());
    return apenasAlertas ? textMatch && p.criticidade !== 'NORMAL' : textMatch;
  });

  const renderCriticidadeBadge = (criticidade: string) => {
    switch (criticidade) {
      case 'CRITICO': return <span className="badge badge-error">Crítico</span>;
      case 'BAIXO': return <span className="badge badge-warning">Atenção</span>;
      default: return <span className="badge badge-success">Normal</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="estoque-page">
        <div className="ep-header">
          <h1><PackageOpen size={28} /> Gestão de Estoque</h1>
        </div>
        <div className="ep-loading">
          <Loader2 className="spin" size={48} />
          <p>Carregando inventário...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="estoque-page">
        <div className="ep-header">
          <h1><PackageOpen size={28} /> Gestão de Estoque</h1>
        </div>
        <div className="ep-error">
          <AlertTriangle size={48} />
          <p>Erro ao carregar dados do estoque. Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="estoque-page">
      <div className="ep-header">
        <h1><PackageOpen size={28} /> Gestão de Estoque</h1>
      </div>

      <div className="ep-toolbar">
        <div className="ep-search">
          <Search size={20} className="ep-search-icon" />
          <input
            type="text"
            placeholder="Buscar por código ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <label className="ep-filter-alertas">
          <input 
            type="checkbox" 
            checked={apenasAlertas} 
            onChange={(e) => setApenasAlertas(e.target.checked)} 
          />
          Mostrar apenas alertas ({produtos?.filter(p => p.criticidade !== 'NORMAL').length || 0})
        </label>
      </div>

      <div className="ep-table-container">
        <table className="ep-table">
          <thead>
            <tr>
              <th>Cód. Interno</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th className="texto-centro">Qtd Atual</th>
              <th className="texto-centro">Estoque Mín.</th>
              <th className="texto-centro">Status</th>
              <th className="texto-centro">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos?.map((p) => (
              <tr key={p.id}>
                <td className="font-mono text-muted">{p.codigoInterno}</td>
                <td><strong>{p.nome}</strong></td>
                <td>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(p as any).categoria?.nome || '-'}
                </td>
                <td className="texto-centro">
                  <span className={`estoque-bignumber ${p.criticidade === 'CRITICO' ? 'text-red' : ''}`}>
                    {p.estoqueAtual}
                  </span> <span className="text-muted">{p.unidadeMedida}</span>
                </td>
                <td className="texto-centro">{p.estoqueMinimo}</td>
                <td className="texto-centro">{renderCriticidadeBadge(p.criticidade)}</td>
                <td className="texto-centro">
                  <div className="ep-actions">
                    <button 
                      className="btn-icon" 
                      title="Extrato de Movimentações"
                      onClick={() => setExtratoModal(p)}
                    >
                      <FileClock size={18} />
                    </button>
                    {canEdit && (
                       <button 
                         className="btn-icon btn-action" 
                         title="Ajuste de Estoque"
                         onClick={() => setAjusteModal(p)}
                       >
                         <ArrowRightLeft size={18} />
                       </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredProdutos?.length === 0 && (
              <tr>
                <td colSpan={7} className="ep-empty">Nenhum produto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {ajusteModal && (
        <AjusteEstoqueModal
          produtoId={ajusteModal.id}
          produtoNome={ajusteModal.nome}
          estoqueAtual={ajusteModal.estoqueAtual}
          unidadeMedida={ajusteModal.unidadeMedida}
          onClose={() => setAjusteModal(null)}
        />
      )}

      {extratoModal && (
        <ExtratoModal
          produtoId={extratoModal.id}
          produtoNome={extratoModal.nome}
          onClose={() => setExtratoModal(null)}
        />
      )}
    </div>
  );
};
