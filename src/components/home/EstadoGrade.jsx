export function GradeCarregando({ linhas = 3 }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-live="polite">
      <span className="sr-only">Carregando a programação</span>
      {Array.from({ length: linhas }).map((_, indice) => (
        <div key={indice} className="h-14 animate-pulse rounded-possi bg-surface-container-high" />
      ))}
    </div>
  );
}

export function GradeErro({ onTentar }) {
  return (
    <div className="rounded-possi border border-live/30 bg-live/5 p-4" role="alert">
      <p className="font-title text-title-md text-on-surface">Não foi possível consultar a programação.</p>
      <p className="mt-1 font-body text-body-md text-on-surface/70">
        A consulta ao servidor falhou. Tente de novo em instantes.
      </p>
      {onTentar ? (
        <button
          type="button"
          onClick={onTentar}
          className="mt-3 rounded-possi bg-primary px-4 py-2 font-label text-label-md text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Tentar de novo
        </button>
      ) : null}
    </div>
  );
}

export function GradeVazia({ children }) {
  return (
    <p className="rounded-possi bg-surface-container-high px-4 py-3 font-body text-body-md text-on-surface/70">
      {children}
    </p>
  );
}
