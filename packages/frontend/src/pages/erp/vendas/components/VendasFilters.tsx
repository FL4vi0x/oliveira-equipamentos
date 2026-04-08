import React from 'react';
import { Search, X, Calendar } from 'lucide-react';
import { Input } from '../../../../components/ui/Input.tsx';
import { Button } from '../../../../components/ui/Button.tsx';
import './VendasFilters.css';
import { type FilterVendaParams } from '../../../../services/vendas.service';
import { StatusVenda } from '../../../../../../shared/types/venda.types';

interface VendasFiltersProps {
  onFilter: (filters: Partial<FilterVendaParams>) => void;
  filters: FilterVendaParams;
}

const VendasFilters: React.FC<VendasFiltersProps> = ({ onFilter, filters }) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    onFilter({
      search: '',
      status: undefined,
      dataInicio: '',
      dataFim: '',
    });
  };

  return (
    <div className="vendas-filters">
      <form className="search-form" onSubmit={handleSearch}>
        <Input
          placeholder="Buscar por cliente, CPF/CNPJ..."
          iconLeft={<Search size={18} />}
          value={filters.search}
          onChange={(e) => onFilter({ search: e.target.value })}
          className="search-input"
        />
        
        <div className="filter-group">
          <div className="filter-item">
            <Calendar size={16} className="filter-icon" />
            <input 
              type="date" 
              className="date-input" 
              value={filters.dataInicio}
              onChange={(e) => onFilter({ dataInicio: e.target.value })}
            />
          </div>
          <span className="separator">até</span>
          <div className="filter-item">
            <Calendar size={16} className="filter-icon" />
            <input 
              type="date" 
              className="date-input" 
              value={filters.dataFim}
              onChange={(e) => onFilter({ dataFim: e.target.value })}
            />
          </div>
        </div>

        <select 
          className="status-select"
          value={filters.status || ''}
          onChange={(e) => onFilter({ status: (e.target.value || undefined) as StatusVenda })}
        >
          <option value="">Todos os Status</option>
          <option value="CONCLUIDA">Concluídas</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="ORCAMENTO">Orçamentos</option>
          <option value="CANCELADA">Canceladas</option>
        </select>

        <Button variant="secondary" onClick={clearFilters} icon={<X size={16} />}>
          Limpar
        </Button>
      </form>
    </div>
  );
};

export default VendasFilters;
