import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usuarioEhAdministrador } from '../../lib/administradores';

const VerificandoSessao = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50" role="status">
    <p className="text-sm text-slate-500">Verificando acesso...</p>
  </div>
);

const AcessoNegado = () => {
  const { logout } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Acesso restrito</h1>
        <p className="mt-2 text-sm text-slate-600">
          Esta conta entrou, mas não administra a programação da TV Possi 16.1.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40"
          >
            Sair
          </button>
          <Link
            to="/"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/40"
          >
            Voltar ao portal
          </Link>
        </div>
      </div>
    </main>
  );
};

const ProtectedRoute = ({ children }) => {
  const { autenticado, carregando, usuario } = useAuth();
  const location = useLocation();

  if (carregando) return <VerificandoSessao />;

  if (!autenticado) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!usuarioEhAdministrador(usuario)) return <AcessoNegado />;

  return children;
};

export default ProtectedRoute;
