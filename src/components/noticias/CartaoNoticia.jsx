import { useEffect, useState } from 'react';
import { Card, CardBody } from '../ui';
import { cx } from '../ui/cx';
import FonteNoticia from './FonteNoticia';

export default function CartaoNoticia({ noticia, destaque = false, compacto = false }) {
  const [mostrarImagem, setMostrarImagem] = useState(Boolean(noticia.imagem));

  useEffect(() => {
    setMostrarImagem(Boolean(noticia.imagem));
  }, [noticia.imagem]);

  return (
    <Card
      as="a"
      href={noticia.link}
      target="_blank"
      rel="noopener noreferrer"
      variant="interactive"
      className={cx(
        'flex h-full w-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        destaque && 'md:col-span-2 lg:col-span-3',
      )}
    >
      <div className={destaque && mostrarImagem ? 'md:grid md:grid-cols-2' : ''}>
        {mostrarImagem && noticia.imagem ? (
          <img
            src={noticia.imagem}
            alt=""
            className={cx(
              'w-full object-cover',
              destaque ? 'h-52 md:h-full md:min-h-64' : compacto ? 'h-36' : 'h-44',
            )}
            onError={() => setMostrarImagem(false)}
          />
        ) : null}
        <CardBody className="gap-2">
          <FonteNoticia publicadoEm={noticia.publicadoEm} />
          {compacto ? (
            <h3 className="font-title text-title-md text-on-surface">{noticia.titulo}</h3>
          ) : (
            <h2 className={cx(
              'text-on-surface',
              destaque ? 'font-headline text-headline-md' : 'font-title text-title-md',
            )}
            >
              {noticia.titulo}
            </h2>
          )}
          {noticia.resumo ? (
            <p className="font-body text-body-md text-on-surface/75">{noticia.resumo}</p>
          ) : null}
          <span className="mt-1 font-label text-label-md text-primary">Ler no G1</span>
        </CardBody>
      </div>
    </Card>
  );
}
