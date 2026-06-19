const EmptyState = ({ icone = '📺', titulo, descricao, acao }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-14 text-center">
    <div className="mb-4 text-4xl">{icone}</div>
    <h3 className="text-base font-semibold text-slate-700">{titulo}</h3>
    {descricao && <p className="mt-1 max-w-sm text-sm text-slate-500">{descricao}</p>}
    {acao && <div className="mt-5">{acao}</div>}
  </div>
);

export default EmptyState;
