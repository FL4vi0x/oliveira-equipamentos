import './Dashboard.css';

const Dashboard = () => {
    // Dados fictícios para demonstração
    const stats = [
        { title: 'Vendas Hoje', value: 'R$ 1.250,00', icon: '💰', color: '#4CAF50' },
        { title: 'Produtos em Estoque', value: '142', icon: '📦', color: '#2196F3' },
        { title: 'Novos Clientes', value: '12', icon: '👥', color: '#9C27B0' },
        { title: 'Alertas de Estoque', value: '3', icon: '⚠️', color: '#F44336' },
    ];

    return (
        <div className="dashboard-container">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.title}</h3>
                            <p className="stat-value">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                <div className="recent-activity box">
                    <h2>Atividade Recente</h2>
                    <ul>
                        <li>Venda #1254 realizada - R$ 150,00</li>
                        <li>Produto "Furadeira X" atingiu estoque mínimo</li>
                        <li>Novo cliente "Oliveira Construções" cadastrado</li>
                    </ul>
                </div>

                <div className="quick-actions box">
                    <h2>Ações Rápidas</h2>
                    <div className="actions-grid">
                        <button className="action-btn">Nova Venda</button>
                        <button className="action-btn">Cadastrar Produto</button>
                        <button className="action-btn">Abrir PDV</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
