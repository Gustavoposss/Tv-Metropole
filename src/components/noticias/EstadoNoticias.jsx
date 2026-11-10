import { Button } from '../ui';

export function NoticiasCarregando({ quantidade = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">Carregando notícias</span>
      {Array.from({ length: quantidade }).map((_, indice) => (
        <div key={indice} className="h-64 animate-pulse rounded-possi-xl bg-surface-container-high" />
      ))}
    </div>
  );
}

export function NoticiasErro({ onTentar }) {
  return (
    <div className="rounded-possi-xl border border-live/30 bg-live/5 p-5" role="alert">
      <p className="font-title text-title-md text-on-surface">Não foi possível carregar as notícias.</p>
      <p className="mt-1 font-body text-body-md text-on-surface/70">
        O feed do G1 não respondeu. Tente de novo em instantes.
      </p>
      {onTentar ? (
        <Button className="mt-4" onClick={onTentar}>Tentar de novo</Button>
      ) : null}
    </div>
  );
}

export function NoticiasVazias() {
  return (
    <p className="rounded-possi-xl bg-surface-container-high px-4 py-3 font-body text-body-md text-on-surface/70">
      Nenhuma notícia disponível no feed do G1 neste momento.
    </p>
  );
}
