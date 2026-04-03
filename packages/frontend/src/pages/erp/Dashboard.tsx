import { useQuery } from '@tanstack/react-query';
import { estoqueService } from '../../services/estoque.service';
import { vendasService } from '../../services/vendas.service';
import { TrendingUp, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { StatCard } from './components/dashboard/StatCard';
import { SalesOverviewCard } from './components/dashboard/SalesOverviewCard';
import { QuickActionsCard } from './components/dashboard/QuickActionsCard';
import { StockAlertsCard } from './components/dashboard/StockAlertsCard';
import { RecentActivityCard } from './components/dashboard/RecentActivityCard';
import './Dashboard.css';

interface VendaInfo {
    id: string;
    total: number | string;
    [key: string]: unknown;
}

const Dashboard = () => {
    const { data: produtos } = useQuery({
        queryKey: ['produtos-estoque'],
        queryFn: () => estoqueService.getAllProdutos(),
    });

    const { data: alertas } = useQuery({
        queryKey: ['alertas-estoque'],
        queryFn: () => estoqueService.getAlertasMinimo(),
        refetchInterval: 5 * 60 * 1000,
    });

    const { data: vendasHoje } = useQuery<VendaInfo[]>({
        queryKey: ['vendas-hoje'],
        queryFn: () => vendasService.getVendasHoje() as Promise<VendaInfo[]>,
        refetchInterval: 1 * 60 * 1000,
    });

    // Contadores e Cálculos
    const qtyProdutos = produtos?.length || 0;
    const qtyAlertas = alertas?.length || 0;
    const totalFaturamento = (vendasHoje || []).reduce((acc: number, v: VendaInfo) => acc + Number(v.total), 0);
    const qtyVendas = vendasHoje?.length || 0;

    const stockAlerts = (alertas || []).slice(0, 3).map(a => ({
        id: a.id,
        nome: a.nome,
        sku: a.codigoInterno || 'N/A',
        quantidade: a.estoqueAtual,
        minimo: a.estoqueMinimo,
        criticidade: (a.criticidade === 'CRITICO' ? 'CRITICO' : 'ATENÇÃO') as 'CRITICO' | 'ATENÇÃO'
    }));

    return (
        <div className="dashboard-wrapper">
            <div className="stats-header-grid">
                <StatCard 
                    title="Faturamento Hoje"
                    value={`R$ ${totalFaturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    trend={{ value: '+15.2% vs ontem', isUp: true }}
                    icon={<TrendingUp size={20} />}
                    iconBgColor="#eff6ff"
                    iconColor="#3b82f6"
                />
                <StatCard 
                    title="Vendas Realizadas"
                    value={qtyVendas.toString()}
                    trend={{ value: '+4 vs ontem', isUp: true }}
                    icon={<ShoppingCart size={20} />}
                    iconBgColor="#ecfdf5"
                    iconColor="#10b981"
                />
                <StatCard 
                    title="Produtos em Estoque"
                    value={qtyProdutos.toLocaleString('pt-BR')}
                    trend={{ value: 'Estável', isUp: true }}
                    icon={<Package size={20} />}
                    iconBgColor="#f5f3ff"
                    iconColor="#8b5cf6"
                />
                <StatCard 
                    title="Alertas de Estoque"
                    value={qtyAlertas.toString()}
                    trend={{ value: '-2 vs semana passada', isUp: false }}
                    icon={<AlertTriangle size={20} />}
                    iconBgColor="#fffbeb"
                    iconColor="#f59e0b"
                />
            </div>

            <div className="dashboard-main-grid">
                <div className="grid-left-column">
                    <SalesOverviewCard />
                    <StockAlertsCard alerts={stockAlerts} />
                </div>
                <div className="grid-right-column">
                    <QuickActionsCard />
                    <RecentActivityCard />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
