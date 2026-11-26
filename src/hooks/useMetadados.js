import { useEffect } from 'react';
import { SITE } from '../config/site';
import { dadosEstruturados, LOGO_URL } from '../config/seo';

function definirMeta(atributo, chave, conteudo) {
  const seletor = `meta[${atributo}="${chave}"]`;
  let elemento = document.head.querySelector(seletor);
  const criou = !elemento;
  const anterior = elemento?.getAttribute('content') ?? null;

  if (!elemento) {
    elemento = document.createElement('meta');
    elemento.setAttribute(atributo, chave);
    document.head.appendChild(elemento);
  }

  elemento.setAttribute('content', conteudo);

  return () => {
    if (criou) {
      elemento.remove();
      return;
    }
    if (anterior !== null) elemento.setAttribute('content', anterior);
  };
}

function definirCanonical(href) {
  let elemento = document.head.querySelector('link[rel="canonical"]');
  const criou = !elemento;
  const anterior = elemento?.getAttribute('href') ?? null;

  if (!elemento) {
    elemento = document.createElement('link');
    elemento.setAttribute('rel', 'canonical');
    document.head.appendChild(elemento);
  }

  elemento.setAttribute('href', href);

  return () => {
    if (criou) {
      elemento.remove();
      return;
    }
    if (anterior !== null) elemento.setAttribute('href', anterior);
  };
}

function definirJsonLd(dados) {
  let elemento = document.getElementById('tvpossi-dados-estruturados');
  const criou = !elemento;
  const anterior = elemento?.textContent ?? null;

  if (!elemento) {
    elemento = document.createElement('script');
    elemento.type = 'application/ld+json';
    elemento.id = 'tvpossi-dados-estruturados';
    document.head.appendChild(elemento);
  }

  elemento.textContent = JSON.stringify(dados).replaceAll('<', '\\u003c');

  return () => {
    if (criou) {
      elemento.remove();
      return;
    }
    if (anterior !== null) elemento.textContent = anterior;
  };
}

export function useMetadados({ titulo, descricao, caminho }) {
  useEffect(() => {
    const tituloAnterior = document.title;
    const url = new URL(caminho, SITE.origem).href;
    document.title = titulo;

    const restaurar = [
      definirMeta('name', 'description', descricao),
      definirMeta('name', 'robots', 'index, follow'),
      definirMeta('property', 'og:title', titulo),
      definirMeta('property', 'og:description', descricao),
      definirMeta('property', 'og:type', 'website'),
      definirMeta('property', 'og:url', url),
      definirMeta('property', 'og:image', LOGO_URL),
      definirMeta('property', 'og:locale', 'pt_BR'),
      definirMeta('name', 'twitter:card', 'summary'),
      definirMeta('name', 'twitter:title', titulo),
      definirMeta('name', 'twitter:description', descricao),
      definirCanonical(url),
      definirJsonLd(dadosEstruturados({ titulo, descricao, caminho })),
    ];

    return () => {
      document.title = tituloAnterior;
      restaurar.forEach((fn) => fn());
    };
  }, [titulo, descricao, caminho]);
}
