import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Spinner de carregamento enquanto a sessão é verificada
const VerificandoSessao = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
      <p className="text-slate-500 text-sm">Verificando acesso...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { autenticado, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return <VerificandoSessao />;

  if (!autenticado) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
