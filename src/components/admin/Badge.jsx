import { TIPOS_PROGRAMA } from '../../utils/programacao';

export const TipoBadge = ({ tipo }) => {
  const def = TIPOS_PROGRAMA.find((t) => t.value === tipo) || TIPOS_PROGRAMA[0];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${def.cor}`}>
      {def.label}
    </span>
  );
};

export const StatusBadge = ({ ativo }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
      ativo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${ativo ? 'bg-green-500' : 'bg-slate-400'}`} />
    {ativo ? 'Ativo' : 'Inativo'}
  </span>
);
