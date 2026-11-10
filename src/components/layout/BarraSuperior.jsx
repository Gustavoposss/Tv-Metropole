import { IconeLocal, IconeSinal } from './icones';

export default function BarraSuperior() {
  return (
    <aside className="hidden border-b border-outline/70 bg-surface-container-high text-on-surface/80 md:block">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-1.5">
        <p className="flex items-center gap-1.5 font-label text-label-sm text-primary">
          <IconeSinal />
          Sinal aberto digital: Canal 16.1 HD
        </p>
        <p className="flex items-center gap-1 font-body text-body-md text-on-surface/70">
          <IconeLocal className="h-4 w-4 text-secondary" />
          Caucaia e Região Metropolitana de Fortaleza
        </p>
      </div>
    </aside>
  );
}
