import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>Oliveira Equipamentos</h2>
        </div>

        <nav className="menu">
          <Link
            to="/erp/dashboard"
            className={isActive('/erp/dashboard') ? 'active' : ''}
          >
            📊 Dashboard
          </Link>

          <div className="menu-section">ERP</div>
          <Link
            to="/erp/produtos"
            className={isActive('/erp/produtos') ? 'active' : ''}
          >
            📦 Produtos
          </Link>
          <Link
            to="/erp/vendas"
            className={isActive('/erp/vendas') ? 'active' : ''}
          >
            💰 Vendas
          </Link>
          <Link
            to="/erp/clientes"
            className={isActive('/erp/clientes') ? 'active' : ''}
          >
            👥 Clientes
          </Link>
          <Link
            to="/erp/estoque"
            className={isActive('/erp/estoque') ? 'active' : ''}
          >
            📋 Estoque
          </Link>

          <div className="menu-section">PDV</div>
          <Link
            to="/pdv"
            className={isActive('/pdv') ? 'active' : ''}
          >
            🛒 Frente de Caixa
          </Link>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">👤 {user?.nome || 'Usuário'}</span>
              <span className="user-profile">{user?.perfil}</span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/erp/dashboard': 'Dashboard',
    '/erp/produtos': 'Gestão de Produtos',
    '/erp/vendas': 'Vendas',
    '/erp/clientes': 'Clientes',
    '/erp/estoque': 'Controle de Estoque',
    '/pdv': 'Ponto de Venda',
  };
  return titles[path] || 'Oliveira Equipamentos';
}

export default Layout;