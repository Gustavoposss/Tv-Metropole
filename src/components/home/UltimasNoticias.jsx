import { Link } from 'react-router-dom';
import CartaoNoticia from '../noticias/CartaoNoticia';
import { NoticiasCarregando, NoticiasErro, NoticiasVazias } from '../noticias/EstadoNoticias';
import { useNoticias } from '../../hooks/useNoticias';

export default function UltimasNoticias() {
  const { noticias, status, recarregar } = useNoticias();
  const manchetes = noticias.slice(0, 3);

  return (
    <section aria-label="Últimas notícias" className="mx-auto flex max-w-portal flex-col gap-4 px-4 py-4 md:px-6 md:py-8">
      <div className="flex items-end justify-between gap-3 border-b border-outline pb-3">
        <div>
          <p className="font-label text-label-sm font-bold uppercase tracking-wider text-secondary">Fonte: G1</p>
          <h2 className="mt-1 font-headline text-headline-md text-on-surface">Últimas notícias</h2>
        </div>
        <Link
          to="/noticias"
          className="shrink-0 rounded-possi font-label text-label-md text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Ver todas
        </Link>
      </div>

      {status === 'carregando' ? <NoticiasCarregando quantidade={3} /> : null}
      {status === 'erro' ? <NoticiasErro onTentar={recarregar} /> : null}
      {status === 'vazio' ? <NoticiasVazias /> : null}
      {status === 'pronto' && manchetes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {manchetes.map((noticia) => (
            <CartaoNoticia key={noticia.link} noticia={noticia} compacto />
          ))}
        </div>
      ) : null}
    </section>
  );
}
