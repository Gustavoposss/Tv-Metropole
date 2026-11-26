import { lazy, Suspense } from 'react';
import ListaASeguir from '../components/home/ListaASeguir';
import Transmissao from '../components/home/Transmissao';
import { useGradeAoVivo } from '../hooks/useGradeAoVivo';
import { APRESENTACAO, H1_HOME, rotaPorCaminho } from '../config/seo';
import { useMetadados } from '../hooks/useMetadados';

const UltimasNoticias = lazy(() => import('../components/home/UltimasNoticias'));

const Home = () => {
  useMetadados(rotaPorCaminho('/'));

  const grade = useGradeAoVivo();

  return (
    <div className="bg-surface font-body text-on-surface">
      <section
        aria-label="Transmissão ao vivo"
        className="mx-auto grid max-w-portal grid-cols-1 gap-6 px-4 py-4 md:px-6 md:py-8 lg:grid-cols-12 lg:gap-8"
      >
        <header className="lg:col-span-12">
          <h1 className="max-w-4xl font-headline text-headline-md text-on-surface md:text-headline-lg">
            {H1_HOME}
          </h1>
          <p className="mt-2 max-w-3xl font-body text-body-md text-on-surface/75">
            {APRESENTACAO}
          </p>
        </header>
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
    </div>
  );
};

export default Home;
