import { Badge } from '../ui';
import { TIPOS_PROGRAMA, formatarHora } from '../../utils/programacao';
import { GradeCarregando, GradeErro, GradeVazia } from './EstadoGrade';

function faixa(programa) {
  return `${formatarHora(programa.horario_inicio)} – ${formatarHora(programa.horario_fim)}`;
}

export default function ProgramaAtual({ status, programa, onTentar }) {
  if (status === 'carregando') {
    return (
      <div className="border-t border-outline/70 p-4 md:p-6">
        <GradeCarregando linhas={2} />
      </div>
    );
  }

  if (status === 'erro') {
    return (
      <div className="border-t border-outline/70 p-4 md:p-6">
        <GradeErro onTentar={onTentar} />
      </div>
    );
  }

  if (!programa) {
    return (
      <div className="border-t border-outline/70 p-4 md:p-6">
        <p className="font-label text-label-sm uppercase text-primary">TV Possi 16.1</p>
        <h1 className="mt-1 font-headline text-headline-md-mobile text-on-surface md:text-headline-md">
          TV Possi 16.1
        </h1>
        <div className="mt-3">
          <GradeVazia>Nenhum programa no ar neste horário.</GradeVazia>
        </div>
      </div>
    );
  }

  const tipo = TIPOS_PROGRAMA.find((item) => item.value === programa.tipo);

  return (
    <div className="border-t border-outline/70 p-4 md:p-6">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <p className="font-label text-label-sm uppercase text-primary">TV Possi 16.1</p>
        {tipo ? <Badge variant="secondary-soft">{tipo.label}</Badge> : null}
        <span className="font-body text-body-md text-on-surface/60">{faixa(programa)}</span>
      </div>
      <h1 className="font-headline text-headline-md-mobile text-on-surface md:text-headline-md">
        {programa.titulo}
      </h1>
      {programa.descricao ? (
        <p className="mt-1 max-w-2xl font-body text-body-md text-on-surface/75">{programa.descricao}</p>
      ) : null}
    </div>
  );
}
