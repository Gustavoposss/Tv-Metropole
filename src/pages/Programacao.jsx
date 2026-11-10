import { useMemo, useState } from 'react';
import { useMetadados } from '../hooks/useMetadados';
import { Tab, Tabs } from '../components/ui';
import { GradeCarregando, GradeErro, GradeVazia } from '../components/home/EstadoGrade';
import CartaoGrade from '../components/programacao/CartaoGrade';
import { useGradeAoVivo } from '../hooks/useGradeAoVivo';
import { partesFortaleza, programasDoDia } from '../lib/gradeAoVivo.js';
import { DIAS_SEMANA } from '../utils/programacao';

const Programacao = () => {
  const grade = useGradeAoVivo();
  const [dia, setDia] = useState(() => partesFortaleza().dia);
  const hoje = grade.agora?.dia;
  useMetadados({
    titulo: 'Programação — TV Possi 16.1',
    descricao: 'Grade de programação da TV Possi 16.1 no horário de Fortaleza.',
    caminho: '/programacao',
  });

  const lista = useMemo(
    () => programasDoDia(grade.programas, dia, grade.instante),
    [grade.programas, dia, grade.instante],
  );

  return (
    <div className="bg-surface font-body text-on-surface">
      <section className="mx-auto flex min-w-0 max-w-portal flex-col gap-6 px-4 py-4 md:px-6 md:py-8">
        <div className="flex flex-col gap-4 border-b border-outline pb-6">
          <div>
            <p className="font-label text-label-sm font-bold uppercase tracking-wider text-primary">
              Canal 16.1 HD
            </p>
            <h1 className="mt-1 font-headline text-headline-md text-on-surface md:text-headline-lg">
              Programação TV Possi 16.1
            </h1>
            <p className="mt-1 font-body text-body-md text-on-surface/70">
              Horário de Fortaleza: {grade.agora?.hora || '--:--'}
            </p>
          </div>

          <Tabs
            label="Dias da semana"
            value={dia}
            onChange={setDia}
            className="w-full max-w-full flex-nowrap overflow-x-auto overscroll-x-contain"
          >
            {DIAS_SEMANA.map((item) => {
              const rotulo = item.value === hoje ? `Hoje, ${item.label}` : item.label;
              return (
                <Tab key={item.value} value={item.value} rotulo={rotulo} className="shrink-0">
                  <span aria-hidden="true" className="md:hidden">
                    {item.value === hoje ? 'Hoje' : item.curto}
                  </span>
                  <span aria-hidden="true" className="hidden md:inline">
                    {item.value === hoje ? `Hoje (${item.label})` : item.label}
                  </span>
                </Tab>
              );
            })}
          </Tabs>
        </div>

        <div
          role="tabpanel"
          id={`painel-${dia}`}
          aria-labelledby={`aba-${dia}`}
          tabIndex={0}
          className="rounded-possi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {grade.status === 'carregando' ? <GradeCarregando linhas={6} /> : null}
          {grade.status === 'erro' ? <GradeErro onTentar={grade.recarregar} /> : null}
          {grade.status === 'pronto' && lista.itens.length === 0 ? (
            <GradeVazia>Nenhum programa cadastrado para este dia.</GradeVazia>
          ) : null}
          {grade.status === 'pronto' && lista.itens.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lista.itens.map((item) => (
                <CartaoGrade key={item.chave} item={item} />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Programacao;
