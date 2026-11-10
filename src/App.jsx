import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Rodape from './components/layout/Rodape';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { MODO_MANUTENCAO } from './config/manutencao';

// Lazy loading das páginas públicas
const Home = lazy(() => import('./pages/Home'));
const Programacao = lazy(() => import('./pages/Programacao'));
const NoticiasPage = lazy(() => import('./pages/NoticiasPage'));
const Manutencao = lazy(() => import('./pages/Manutencao'));

// Lazy loading do painel administrativo
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProgramacaoAdmin = lazy(() => import('./pages/admin/ProgramacaoAdmin'));

// Componente de loading
const PageLoader = () =>
  MODO_MANUTENCAO ? (
    <div className="min-h-screen bg-black" role="status">
      <span className="sr-only">Carregando</span>
    </div>
  ) : (
    <div className="flex min-h-screen items-center justify-center bg-surface font-body text-on-surface" role="status">
      <p className="text-body-md">Carregando...</p>
    </div>
  );

// Com a página temporária ligada, as rotas públicas não montam o portal antigo.
// O painel /admin fica fora deste layout e continua acessível pelo endereço direto.
const PublicLayout = () => {
  if (MODO_MANUTENCAO) return <Manutencao />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-[calc(6.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
        <Rodape />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Rotas públicas */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/programacao" element={<Programacao />} />
                <Route path="/noticias" element={<NoticiasPage />} />
              </Route>

              {/* Login do admin (sem proteção) */}
              <Route path="/admin/login" element={<Login />} />

              {/* Painel administrativo protegido */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="programacao" element={<ProgramacaoAdmin />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
