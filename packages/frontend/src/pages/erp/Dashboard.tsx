import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { estoqueService } from '../../services/estoque.service';
import { AlertTriangle, PackageOpen, ShoppingCart, Users } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    // Queries de Estoque
    const { data: produtos } = useQuery({
        queryKey: ['produtos-estoque'],
        queryFn: () => estoqueService.getAllProdutos(),
    });

    const { data: alertas } = useQuery({
        queryKey: ['alertas-estoque'],
        queryFn: () => estoqueService.getAlertasMinimo(),
        refetchInterval: 5 * 60 * 1000, // 5 minutos auto-refresh
    });

    // Contadores
    const qtyProdutos = produtos?.length || 0;
    const qtyAlertas = alertas?.length || 0;

    const stats = [
        { title: 'Vendas Hoje', value: 'R$ 1.250,00', color: '#4CAF50', icon: <ShoppingCart size={24} color="#4CAF50"/> },
        { title: 'Produtos em Estoque', value: qtyProdutos.toString(), color: '#2196F3', icon: <PackageOpen size={24} color="#2196F3"/> },
        { title: 'Novos Clientes', value: '12', color: '#9C27B0', icon: <Users size={24} color="#9C27B0"/> },
        { title: 'Alertas de Estoque', value: qtyAlertas.toString(), color: '#F44336', icon: <AlertTriangle size={24} color="#F44336"/> },
    ];

    const top5Alertas = alertas?.slice(0, 5) || [];

    return (
        <div className="dashboard-container">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                        <div className="stat-icon-wrapper" style={{background: `${stat.color}15`, padding: '12px', borderRadius: '50%'}}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                <div className="recent-activity box">
                    <div className="box-header-flex">
                        <h2><AlertTriangle size={20} className="text-red mr-2" style={{display: 'inline', marginBottom:'-4px'}}/> Alertas Críticos de Estoque</h2>
                        <button className="btn-link" onClick={() => navigate('/erp/estoque')}>Ver Todos</button>
                    </div>
                    
                    {top5Alertas.length === 0 ? (
                        <div className="empty-alert">
                            <p className="text-muted">Nenhum produto com estoque crítico.</p>
                        </div>
                    ) : (
                        <ul className="alert-list">
                            {top5Alertas.map(a => (
                                <li key={a.id} className={`alert-item ${a.criticidade === 'CRITICO' ? 'is-critical' : 'is-warning'}`}>
                                    <div className="alert-details">
                                        <strong>{a.nome}</strong>
                                        <span className="text-muted text-sm">Cód: {a.codigoInterno}</span>
                                    </div>
                                    <div className="alert-amount">
                                        <span className="current-stock">{a.estoqueAtual}</span>
                                        <span className="min-stock">/ min: {a.estoqueMinimo}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="quick-actions box">
                    <h2>Ações Rápidas</h2>
                    <div className="actions-grid">
                        <button className="action-btn" onClick={() => navigate('/erp/vendas/nova')}>Nova Venda</button>
                        <button className="action-btn" onClick={() => navigate('/erp/produtos')}>Gerenciar Produtos</button>
                        <button className="action-btn" onClick={() => navigate('/erp/estoque')}>Ajustar Estoque</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
