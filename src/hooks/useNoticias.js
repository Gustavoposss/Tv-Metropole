import { useCallback, useEffect, useRef, useState } from 'react';
import { enderecoRss, lerFeed } from '../lib/noticiasRss.js';

async function buscarFeed() {
  const resposta = await fetch(enderecoRss(), {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  });
  if (!resposta.ok) throw new Error(`RSS ${resposta.status}`);
  return lerFeed(await resposta.text());
}

export function useNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [status, setStatus] = useState('carregando');
  const pedido = useRef(0);

  const carregar = useCallback(async () => {
    const id = ++pedido.current;
    setStatus('carregando');
    let falha = null;
    for (let tentativa = 0; tentativa < 2; tentativa += 1) {
      try {
        const itens = await buscarFeed();
        if (pedido.current !== id) return;
        setNoticias(itens);
        setStatus(itens.length ? 'pronto' : 'vazio');
        return;
      } catch (erro) {
        falha = erro;
        if (pedido.current !== id) return;
        if (tentativa === 0) await new Promise((resolver) => setTimeout(resolver, 1200));
      }
    }
    if (pedido.current !== id) return;
    console.error('Erro ao consultar o RSS:', falha);
    setNoticias([]);
    setStatus('erro');
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { noticias, status, recarregar: carregar };
}
