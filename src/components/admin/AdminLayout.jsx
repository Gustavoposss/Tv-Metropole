import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from './ConfirmDialog';

const IconeDashboard = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const IconeProgramacao = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconeSair = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const itensMenu = [
  { to: '/admin', label: 'Dashboard', Icone: IconeDashboard, exato: true },
  { to: '/admin/programacao', label: 'Programação', Icone: IconeProgramacao },
];

const AdminLayout = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [menuAberto, setMenuAberto] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  const sair = async () => {
    try {
      await logout();
      toast.sucesso('Você saiu com sucesso.');
      navigate('/admin/login', { replace: true });
    } catch {
      toast.erro('Erro ao sair. Tente novamente.');
    }
  };

  const Navegacao = ({ aoNavegar }) => (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {itensMenu.map(({ to, label, Icone, exato }) => (
        <NavLink
          key={to}
          to={to}
          end={exato}
          onClick={aoNavegar}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-green-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Icone width="18" height="18" />
          {label}
        </NavLink>
      ))}
      <button
        onClick={() => {
          aoNavegar?.();
          setConfirmarSaida(true);
        }}
        className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
      >
        <IconeSair width="18" height="18" />
        Sair
      </button>
    </nav>
  );

  const ConteudoSidebar = ({ aoNavegar }) => (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white text-lg font-bold">
          TV
        </div>
        <div>
          <p className="text-sm font-semibold text-white leading-tight">TV Metrópole</p>
          <p className="text-xs text-slate-400">Painel Admin</p>
        </div>
      </div>
      <Navegacao aoNavegar={aoNavegar} />
      <div className="border-t border-slate-800 px-5 py-4">
        <p className="truncate text-xs text-slate-400" title={usuario?.email}>
          {usuario?.email}
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar fixa (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-900 lg:flex">
        <ConteudoSidebar />
      </aside>

      {/* Sidebar móvel (drawer) */}
      <AnimatePresence>
        {menuAberto && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuAberto(false)}
              className="absolute inset-0 bg-slate-900/50"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="absolute inset-y-0 left-0 flex w-64 flex-col bg-slate-900"
            >
              <ConteudoSidebar aoNavegar={() => setMenuAberto(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Conteúdo principal */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setMenuAberto(true)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-slate-700 lg:hidden">TV Metrópole</span>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>

      <ConfirmDialog
        aberto={confirmarSaida}
        onClose={() => setConfirmarSaida(false)}
        onConfirmar={sair}
        titulo="Sair do painel"
        mensagem="Deseja realmente encerrar a sessão?"
        textoConfirmar="Sair"
        perigo
      />
    </div>
  );
};

export default AdminLayout;
