import { NavLink } from 'react-router-dom';
import { ROTAS_PUBLICAS } from './rotas';

function anoFortaleza() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
  }).format(new Date());
}

export default function Rodape() {
  return (
    <footer className="bg-primary-deep text-on-primary">
      <div className="mx-auto grid max-w-portal gap-8 px-4 py-8 md:grid-cols-3 md:px-6 md:py-10">
        <div className="flex items-center gap-3">
          <img
            src="/logo-tv-possi-header.png"
            alt=""
            width="819"
            height="720"
            className="h-14 w-auto shrink-0 object-contain md:h-16"
          />
          <div>
            <p className="font-headline text-title-md">TV Possi 16.1</p>
            <p className="mt-1 font-body text-body-md text-on-primary/80">Canal 16.1 HD</p>
          </div>
        </div>

        <nav aria-label="Rodapé">
          <p className="font-label text-label-sm uppercase tracking-wider text-on-primary/70">Páginas</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-2">
            {ROTAS_PUBLICAS.map((rota) => (
              <li key={rota.to}>
                <NavLink
                  to={rota.to}
                  end={rota.end}
                  className="rounded-possi font-label text-label-md text-on-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-on-primary/70"
                >
                  {rota.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-label text-label-sm uppercase tracking-wider text-on-primary/70">Sinal</p>
          <p className="mt-3 font-body text-body-md text-on-primary/90">Sinal aberto digital: Canal 16.1 HD</p>
          <p className="mt-1 font-body text-body-md text-on-primary/80">
            Caucaia e Região Metropolitana de Fortaleza
          </p>
          <p className="mt-4 font-label text-label-md text-on-primary/70">{anoFortaleza()}</p>
        </div>
      </div>
    </footer>
  );
}
