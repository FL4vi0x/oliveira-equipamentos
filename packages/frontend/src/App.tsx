import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/erp/Dashboard';
import ProdutosPage from './pages/erp/produtos/ProdutosPage';
import Login from './pages/Login';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/erp" element={<Layout />}>
                <Route index element={<Navigate to="/erp/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="produtos" element={<ProdutosPage />} />
                {/* Adicionar mais rotas ERP aqui */}
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/erp/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/erp/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;