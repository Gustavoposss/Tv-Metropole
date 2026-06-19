// Skeletons reutilizáveis para estados de carregamento

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-slate-200/70 ${className}`} />
);

export const TabelaSkeleton = ({ linhas = 6, colunas = 6 }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: linhas }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          {Array.from({ length: colunas }).map((_, j) => (
            <Skeleton key={j} className={`h-4 ${j === 0 ? 'w-1/4' : 'flex-1'}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-slate-200 bg-white p-5">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="mt-3 h-8 w-16" />
  </div>
);

export default Skeleton;
