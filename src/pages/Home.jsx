import { lazy, Suspense, useMemo } from 'react';
import GradeHoje from '../components/home/GradeHoje';
import ListaASeguir from '../components/home/ListaASeguir';
import Transmissao from '../components/home/Transmissao';
import { useGradeAoVivo } from '../hooks/useGradeAoVivo';
import { useMetadados } from '../hooks/useMetadados';
import { programasDoDia } from '../lib/gradeAoVivo.js';

const UltimasNoticias = lazy(() => import('../components/home/UltimasNoticias'));

const Home = () => {
  useMetadados({
    titulo: 'TV Possi 16.1 — Ao vivo',
    descricao: 'Assista à TV Possi 16.1 ao vivo, veja a programação de Fortaleza e as manchetes do G1.',
    caminho: '/',
  });

  const grade = useGradeAoVivo();
  const hoje = useMemo(
    () => programasDoDia(grade.programas, grade.agora?.dia, grade.instante),
    [grade.programas, grade.agora, grade.instante],
  );

  return (
    <div className="bg-surface font-body text-on-surface">
      <section
        aria-label="Transmissão ao vivo"
        className="mx-auto grid max-w-portal grid-cols-1 gap-6 px-4 py-4 md:px-6 md:py-8 lg:grid-cols-12 lg:gap-8"
      >
        <div className="min-w-0 lg:col-span-8">
          <Transmissao
            status={grade.status}
            programa={grade.atual}
            onTentar={grade.recarregar}
          />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <ListaASeguir
            status={grade.status}
            programas={grade.proximos}
            onTentar={grade.recarregar}
          />
        </div>
      </section>
      <Suspense
        fallback={(
          <p className="mx-auto max-w-portal px-4 py-4 font-body text-body-md text-on-surface/80 md:px-6" role="status">
            Carregando notícias...
          </p>
        )}
      >
        <UltimasNoticias />
      </Suspense>
      <GradeHoje status={grade.status} itens={hoje.itens} onTentar={grade.recarregar} />
    </div>
  );
};

export default Home;
