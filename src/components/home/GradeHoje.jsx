import { Link } from 'react-router-dom';
import { formatarHora } from '../../utils/programacao';
import { GradeCarregando, GradeErro, GradeVazia } from './EstadoGrade';

export default function GradeHoje({ status, itens, onTentar }) {
  return (
    <section aria-label="Programação de hoje" className="mx-auto flex max-w-portal flex-col gap-4 px-4 pb-8 md:px-6 md:pb-10">
      <div className="flex items-end justify-between gap-3 border-b border-outline pb-3">
        <h2 className="font-headline text-headline-md text-on-surface">Programação de hoje</h2>
        <Link
          to="/programacao"
          className="shrink-0 rounded-possi font-label text-label-md text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Ver programação
        </Link>
      </div>

      {status === 'carregando' ? <GradeCarregando linhas={4} /> : null}
      {status === 'erro' ? <GradeErro onTentar={onTentar} /> : null}
      {status === 'pronto' && (!itens || itens.length === 0) ? (
        <GradeVazia>Nenhum programa cadastrado para hoje.</GradeVazia>
      ) : null}
      {status === 'pronto' && itens?.length > 0 ? (
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {itens.map((item) => (
            <li
              key={item.chave}
              className={
                item.noAr
                  ? 'flex items-baseline gap-3 rounded-possi border border-live bg-live/5 px-3 py-2'
                  : 'flex items-baseline gap-3 rounded-possi border border-outline bg-surface-container px-3 py-2'
              }
            >
              <span className={`shrink-0 font-headline text-label-lg ${item.noAr ? 'text-live' : 'text-on-surface/70'}`}>
                {formatarHora(item.programa.horario_inicio)}
              </span>
              <span className="min-w-0">
                <span className="block font-title text-title-md text-on-surface">{item.programa.titulo}</span>
                {item.noAr ? (
                  <span className="font-label text-label-sm uppercase text-live">No ar</span>
                ) : null}
                {item.continuacao ? (
                  <span className="font-label text-label-sm text-on-surface/60">Dia anterior</span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
