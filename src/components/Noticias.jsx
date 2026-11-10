import CartaoNoticia from './noticias/CartaoNoticia';
import { NoticiasCarregando, NoticiasErro, NoticiasVazias } from './noticias/EstadoNoticias';
import { useNoticias } from '../hooks/useNoticias';

const Noticias = () => {
  const { noticias, status, recarregar } = useNoticias();

  if (status === 'carregando') return <NoticiasCarregando />;
  if (status === 'erro') return <NoticiasErro onTentar={recarregar} />;
  if (status === 'vazio') return <NoticiasVazias />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {noticias.map((noticia, indice) => (
        <CartaoNoticia key={noticia.link} noticia={noticia} destaque={indice === 0} />
      ))}
    </div>
  );
};

export default Noticias;
