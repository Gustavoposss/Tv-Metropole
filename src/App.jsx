import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Programacao = lazy(() => import('./pages/Programacao'));
const NoticiasPage = lazy(() => import('./pages/NoticiasPage'));

// Componente de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-green-800 text-lg font-medium">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programacao" element={<Programacao />} />
              <Route path="/noticias" element={<NoticiasPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
