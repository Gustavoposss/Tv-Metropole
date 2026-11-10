import { NavLink } from 'react-router-dom';
import { cx } from '../ui/cx';
import { IconeAoVivo, IconeGrade, IconeNoticias } from './icones';
import { ROTAS_PUBLICAS } from './rotas';

const ICONES = {
  '/': IconeAoVivo,
  '/noticias': IconeNoticias,
  '/programacao': IconeGrade,
};

export default function NavegacaoInferior() {
  return (
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-outline bg-surface-container/95 shadow-lg backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around px-2">
        {ROTAS_PUBLICAS.map((rota) => {
          const Icone = ICONES[rota.to];
          return (
            <li key={rota.to} className="flex-1">
              <NavLink
                to={rota.to}
                end={rota.end}
                className={({ isActive }) => cx(
                  'flex min-h-16 flex-col items-center justify-center gap-0.5 px-2 py-2 font-label text-label-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40',
                  isActive ? 'font-bold text-live' : 'text-on-surface/80 hover:text-primary',
                )}
              >
                <Icone />
                {rota.labelMobile}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
