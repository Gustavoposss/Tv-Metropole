import { NavLink } from 'react-router-dom';
import { cx } from '../ui/cx';
import { ROTAS_PUBLICAS } from './rotas';

export default function MenuPrincipal() {
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
      {ROTAS_PUBLICAS.map((rota) => (
        <NavLink
          key={rota.to}
          to={rota.to}
          end={rota.end}
          className={({ isActive }) => cx(
            'inline-flex items-center gap-1.5 rounded-possi px-3.5 py-2 font-label text-label-md',
            'transition duration-state-change ease-state-change',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
            isActive
              ? 'bg-primary/10 font-bold text-primary'
              : 'text-on-surface/80 hover:bg-surface-container-high hover:text-primary',
          )}
        >
          {rota.end ? (
            <span className="h-2 w-2 rounded-full bg-live animate-pulse" aria-hidden="true" />
          ) : null}
          {rota.label}
        </NavLink>
      ))}
    </nav>
  );
}
