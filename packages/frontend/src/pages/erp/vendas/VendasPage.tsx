import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { vendasService } from '../../../services/vendas.service';
import { Button } from '../../../components/ui/Button';
import VendasTable from './components/VendasTable';
import VendasFilters from './components/VendasFilters';
import VendasSummaryCards from './components/VendasSummaryCards';
import VendaDetailsModal from './components/VendaDetailsModal';
import VendaCancelModal from './components/VendaCancelModal';
import { GerarDocumentosModal } from './components/GerarDocumentosModal';
import type { Venda } from '../../../../../shared/types/venda.types';
import type { FilterVendaParams } from '../../../services/vendas.service';
import './VendasPage.css';

interface VendasResponse {
  data: Venda[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  summary: {
    totalVendido: number;
    vendasConcluidas: number;
    ticketMedio: number;
    cancelamentos: number;
  };
}

const VendasPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterVendaParams>({
    page: 1,
    limit: 10,
    search: '',
    status: undefined,
    dataInicio: '',
    dataFim: '',
  });

  const [selectedVendaId, setSelectedVendaId] = useState<string | null>(null);
  const [vendaToCancelId, setVendaToCancelId] = useState<string | null>(null);
  const [vendaToGenerateDocId, setVendaToGenerateDocId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery<VendasResponse>({
    queryKey: ['vendas', filters],
    queryFn: () => vendasService.getAll(filters) as Promise<VendasResponse>,
  });

  const handleFilterChange = (newFilters: Partial<FilterVendaParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  return (
    <div className="vendas-page">
      <header className="vendas-header">
        <div className="header-info">
          <h1>Gestão de Vendas</h1>
          <p>Consulte o histórico, filtre resultados e gerencie as vendas realizadas no ERP e no PDV.</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => window.location.hash = '/erp/pdv'}>
            Nova Venda (PDV)
          </Button>
        </div>
      </header>

      <VendasSummaryCards summary={data?.summary} isLoading={isLoading} />

      <section className="vendas-content">
        <div className="table-card">
          <VendasFilters onFilter={handleFilterChange} filters={filters} />
          
          <VendasTable 
            data={data?.data || []} 
            isLoading={isLoading} 
            meta={data?.meta}
            onPageChange={(page: number) => setFilters((prev) => ({ ...prev, page }))}
            onViewDetails={(id: string) => setSelectedVendaId(id)}
            onCancel={(id: string) => setVendaToCancelId(id)}
            onGerarDocumentos={(id: string) => setVendaToGenerateDocId(id)}
          />
        </div>
      </section>

      {selectedVendaId && (
        <VendaDetailsModal 
          vendaId={selectedVendaId} 
          onClose={() => setSelectedVendaId(null)} 
        />
      )}

      {vendaToCancelId && (
        <VendaCancelModal 
          vendaId={vendaToCancelId} 
          onClose={() => setVendaToCancelId(null)}
          onSuccess={() => {
            setVendaToCancelId(null);
            refetch();
          }}
        />
      )}

      {vendaToGenerateDocId && (
        <GerarDocumentosModal 
          vendaId={vendaToGenerateDocId} 
          onClose={() => setVendaToGenerateDocId(null)} 
        />
      )}
    </div>
  );
};

export default VendasPage;
