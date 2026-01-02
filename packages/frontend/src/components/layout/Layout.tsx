import { Outlet, Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>Oliveira Equipamentos</h2>
        </div>
        
        <nav className="menu">
          <Link 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'active' : ''}
          >
            📊 Dashboard
          </Link>
          
          <div className="menu-section">ERP</div>
          <Link 
            to="/produtos" 
            className={isActive('/produtos') ? 'active' : ''}
          >
            📦 Produtos
          </Link>
          <Link 
            to="/vendas" 
            className={isActive('/vendas') ? 'active' : ''}
          >
            💰 Vendas
          </Link>
          <Link 
            to="/clientes" 
            className={isActive('/clientes') ? 'active' : ''}
          >
            👥 Clientes
          </Link>
          <Link 
            to="/estoque" 
            className={isActive('/estoque') ? 'active' : ''}
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
            <span>👤 Usuário</span>
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
    '/dashboard': 'Dashboard',
    '/produtos': 'Gestão de Produtos',
    '/vendas': 'Vendas',
    '/clientes': 'Clientes',
    '/estoque': 'Controle de Estoque',
    '/pdv': 'Ponto de Venda',
  };
  return titles[path] || 'Oliveira Equipamentos';
}

export default Layout;