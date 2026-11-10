import { Link } from 'react-router-dom';
import { formatarHora } from '../../utils/programacao';
import { Card, CardBody } from '../ui';
import { GradeCarregando, GradeErro, GradeVazia } from './EstadoGrade';

export default function ListaASeguir({ status, programas, onTentar }) {
  const itens = (programas || []).slice(0, 4);

  return (
    <Card>
      <CardBody className="gap-4">
        <div className="flex items-center justify-between gap-3 border-b border-outline/60 pb-3">
          <h2 className="font-headline text-title-md text-on-surface">A seguir</h2>
          <Link
            to="/programacao"
            className="rounded-possi font-label text-label-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Ver grade
          </Link>
        </div>

        {status === 'carregando' ? <GradeCarregando /> : null}
        {status === 'erro' ? <GradeErro onTentar={onTentar} /> : null}
        {status === 'pronto' && itens.length === 0 ? (
          <GradeVazia>Nenhum próximo programa cadastrado.</GradeVazia>
        ) : null}
        {status === 'pronto' && itens.length > 0 ? (
          <ol className="flex flex-col gap-2">
            {itens.map((programa, indice) => (
              <li
                key={programa.id}
                className={`items-start gap-3 rounded-possi p-3 hover:bg-surface-container-high ${indice >= 2 ? 'hidden lg:flex' : 'flex'}`}
              >
                <span className="shrink-0 font-headline text-label-lg text-on-surface/70">
                  {formatarHora(programa.horario_inicio)}
                </span>
                <span className="min-w-0">
                  <span className="block font-title text-title-md text-on-surface">{programa.titulo}</span>
                  {programa.descricao ? (
                    <span className="mt-0.5 block truncate font-body text-body-md text-on-surface/70">
                      {programa.descricao}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </CardBody>
    </Card>
  );
}
