import { useState } from 'react';
import { Badge } from '../ui';
import { TIPOS_PROGRAMA, formatarHora } from '../../utils/programacao';
import { periodoDoHorario } from '../../lib/gradeAoVivo.js';

export default function CartaoGrade({ item }) {
  const { programa, continuacao, noAr } = item;
  const [imagemVisivel, setImagemVisivel] = useState(Boolean(programa.imagem_url));
  const tipo = TIPOS_PROGRAMA.find((opcao) => opcao.value === programa.tipo);
  const varianteTipo = { 'AO VIVO': 'primary-soft', REPRISE: 'accent', STREAM: 'secondary-soft' };
  const periodo = periodoDoHorario(programa.horario_inicio);

  return (
    <article
      className={
        noAr
          ? 'relative flex items-start gap-3 overflow-hidden rounded-possi-xl border-2 border-live bg-live/5 p-4 shadow-sm'
          : 'relative flex items-start gap-3 rounded-possi-xl border border-outline bg-surface p-4'
      }
      aria-current={noAr ? 'true' : undefined}
    >
      {noAr ? (
        <span className="absolute right-0 top-0 rounded-bl-possi bg-live px-2 py-0.5 font-label text-[10px] font-extrabold uppercase text-on-live">
          No ar agora
        </span>
      ) : null}

      <div className="w-14 shrink-0 text-center">
        <span className={`block font-headline text-base font-bold ${noAr ? 'text-live' : 'text-on-surface'}`}>
          {formatarHora(programa.horario_inicio)}
        </span>
        <span className={`mt-0.5 block font-label text-[11px] ${noAr ? 'font-semibold text-live/80' : 'text-on-surface/60'}`}>
          {periodo}
        </span>
        <span className="mt-1 block font-body text-[11px] text-on-surface/60">
          até {formatarHora(programa.horario_fim)}
        </span>
      </div>

      {imagemVisivel ? (
        <img
          src={programa.imagem_url}
          alt=""
          className="h-16 w-16 shrink-0 rounded-possi object-cover"
          onError={() => setImagemVisivel(false)}
        />
      ) : null}

      <div className={`min-w-0 flex-1 border-l pl-4 ${noAr ? 'border-live/30' : 'border-outline'}`}>
        <div className="mb-1 flex flex-wrap items-center gap-1.5 pr-16">
          {tipo ? <Badge variant={varianteTipo[programa.tipo] || 'primary-soft'}>{tipo.label}</Badge> : null}
          {continuacao ? <Badge variant="secondary-soft">Dia anterior</Badge> : null}
        </div>
        <h2 className={`font-title text-title-md text-on-surface ${noAr ? 'pr-16' : ''}`}>{programa.titulo}</h2>
        {programa.descricao ? (
          <p className="mt-0.5 font-body text-body-md text-on-surface/70">{programa.descricao}</p>
        ) : null}
      </div>
    </article>
  );
}
