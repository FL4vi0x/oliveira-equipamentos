import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  CircleDollarSign, 
  Users, 
  ClipboardList, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Bell,
  ChevronDown
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
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
        <div className="logo-container">
          <div className="logo-icon">
            <LayoutDashboard size={24} color="#3b82f6" />
          </div>
          <div className="logo-text">
            <span className="logo-suite">ERP SUITE</span>
            <span className="logo-name">Oliveira Equipamentos</span>
          </div>
        </div>

        <nav className="menu">
          <div className="menu-group">
            <div className="menu-section">PRINCIPAL</div>
            <Link
              to="/erp/dashboard"
              className={`menu-item ${isActive('/erp/dashboard') ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          </div>

          <div className="menu-group">
            <div className="menu-section">ERP</div>
            <Link
              to="/erp/produtos"
              className={`menu-item ${isActive('/erp/produtos') ? 'active' : ''}`}
            >
              <Package size={18} />
              <span>Produtos</span>
            </Link>
            <Link
              to="/erp/categorias"
              className={`menu-item ${isActive('/erp/categorias') ? 'active' : ''}`}
            >
              <Tags size={18} />
              <span>Categorias</span>
            </Link>
            <Link
              to="/erp/vendas"
              className={`menu-item ${isActive('/erp/vendas') ? 'active' : ''}`}
            >
              <CircleDollarSign size={18} />
              <span>Vendas</span>
            </Link>
            <Link
              to="/erp/clientes"
              className={`menu-item ${isActive('/erp/clientes') ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Clientes</span>
            </Link>
            <Link
              to="/erp/estoque"
              className={`menu-item ${isActive('/erp/estoque') ? 'active' : ''}`}
            >
              <ClipboardList size={18} />
              <span>Estoque</span>
            </Link>
          </div>

          <div className="menu-group">
            <div className="menu-section">PDV</div>
            <Link
              to="/erp/pdv"
              className={`menu-item ${isActive('/erp/pdv') ? 'active' : ''}`}
            >
              <ShoppingCart size={18} />
              <span>Frente de Caixa</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link to="/erp/configuracoes" className="footer-link">
            <Settings size={18} />
            <span>Configurações</span>
          </Link>
          <button onClick={handleLogout} className="footer-link logout">
            <LogOut size={18} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>{getPageTitle(location.pathname)}</h1>
          </div>
          <div className="header-right">
            <div className="header-date">
              <ClipboardList size={16} />
              <span>{new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' }).format(new Date())}</span>
            </div>
            
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>

            <div className="user-profile-dropdown">
              <Avatar size="sm" initials={user?.nome?.substring(0, 2).toUpperCase() || 'U'} />
              <div className="user-info-text">
                <span className="user-name">{user?.nome || 'Administrador'}</span>
                <span className="user-role">{user?.perfil || 'ADMIN'}</span>
              </div>
              <ChevronDown size={14} className="dropdown-icon" />
            </div>
          </div>
        </header>

        <div className={`content${location.pathname === '/erp/pdv' ? ' content--pdv' : ''}`}>
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
    '/erp/categorias': 'Categorias de Produtos',
    '/erp/vendas': 'Gestão de Vendas',
    '/erp/clientes': 'Clientes',
    '/erp/estoque': 'Controle de Estoque',
    '/erp/pdv': 'Ponto de Venda',
  };
  return titles[path] || 'Oliveira Equipamentos';
}

export default Layout;