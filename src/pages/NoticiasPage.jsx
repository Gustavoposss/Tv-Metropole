import Noticias from '../components/Noticias';
import { useMetadados } from '../hooks/useMetadados';

const NoticiasPage = () => {
  useMetadados({
    titulo: 'Notícias — TV Possi 16.1',
    descricao: 'Manchetes publicadas pelo G1. As reportagens não são produzidas pela TV Possi 16.1.',
    caminho: '/noticias',
  });

  return (
    <div className="bg-surface font-body text-on-surface">
      <section className="mx-auto flex min-w-0 max-w-portal flex-col gap-6 px-4 py-4 md:px-6 md:py-8">
        <header className="border-b border-outline pb-4">
          <p className="font-label text-label-sm font-bold uppercase tracking-wider text-secondary">
            Fonte: G1
          </p>
          <h1 className="mt-1 font-headline text-headline-md text-on-surface md:text-headline-lg">
            Notícias — TV Possi 16.1
          </h1>
          <p className="mt-1 max-w-3xl font-body text-body-md text-on-surface/70">
            Manchetes publicadas pelo G1. Cada card abre a matéria original, e estas reportagens não são produzidas pela TV Possi.
          </p>
        </header>
        <Noticias />
        <p className="font-body text-body-md text-on-surface/70">
          <a
            href="https://g1.globo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-possi font-label text-label-md text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Ver o site do G1
          </a>
        </p>
      </section>
    </div>
  );
};

export default NoticiasPage;
