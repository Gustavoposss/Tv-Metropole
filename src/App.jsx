import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Lazy loading das páginas públicas
const Home = lazy(() => import('./pages/Home'));
const Programacao = lazy(() => import('./pages/Programacao'));
const NoticiasPage = lazy(() => import('./pages/NoticiasPage'));

// Lazy loading do painel administrativo
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProgramacaoAdmin = lazy(() => import('./pages/admin/ProgramacaoAdmin'));

// Componente de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-green-800 text-lg font-medium">Carregando...</p>
    </div>
  </div>
);

// Layout público (com Header) — preserva as páginas públicas existentes
const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main>
      <Outlet />
    </main>
  </div>
);

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
