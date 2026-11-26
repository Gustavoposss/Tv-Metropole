import { SITE } from './site.js';

export const H1_HOME = 'TV Possi 16.1 — Televisão de Caucaia ao vivo';

export const APRESENTACAO = 'A TV Possi 16.1 é uma emissora de televisão de Caucaia, no Ceará, com transmissão ao vivo pelo Canal 16.1 HD e programação para Caucaia e a Região Metropolitana de Fortaleza. Antes conhecida como TV Metrópole, a emissora agora apresenta sua nova identidade.';

export const LOGO_URL = `${SITE.origem}/logo-tv-possi.jpg`;

export const AREA_DE_ATUACAO = [
  'Caucaia',
  'Ceará',
  'Região Metropolitana de Fortaleza',
];

export const ROTAS_SEO = [
  {
    caminho: '/',
    arquivo: 'index.html',
    titulo: H1_HOME,
    descricao: APRESENTACAO,
  },
  {
    caminho: '/programacao',
    arquivo: 'programacao/index.html',
    titulo: 'Programação — TV Possi 16.1',
    descricao: 'Grade de programação da TV Possi 16.1 no Canal 16.1 HD, no horário de Fortaleza.',
  },
  {
    caminho: '/noticias',
    arquivo: 'noticias/index.html',
    titulo: 'Notícias — TV Possi 16.1',
    descricao: 'Manchetes publicadas pelo G1. As reportagens não são produzidas pela TV Possi 16.1.',
  },
];

export function normalizarCaminho(caminho = '/') {
  const semConsulta = String(caminho).split('?')[0].split('#')[0] || '/';
  if (semConsulta.length > 1 && semConsulta.endsWith('/')) return semConsulta.slice(0, -1);
  return semConsulta.startsWith('/') ? semConsulta : `/${semConsulta}`;
}

export function rotaPorCaminho(caminho) {
  const normalizado = normalizarCaminho(caminho);
  return ROTAS_SEO.find((rota) => rota.caminho === normalizado) || null;
}

export function urlCanonica(caminho) {
  return new URL(normalizarCaminho(caminho), `${SITE.origem}/`).href;
}

export function dadosEstruturados(rota) {
  const url = urlCanonica(rota.caminho);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE.origem}/#emissora`,
        name: SITE.nome,
        url: `${SITE.origem}/`,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
        description: APRESENTACAO,
        areaServed: AREA_DE_ATUACAO,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.origem}/#site`,
        name: SITE.nome,
        url: `${SITE.origem}/`,
        publisher: { '@id': `${SITE.origem}/#emissora` },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: rota.titulo,
        description: rota.descricao,
        isPartOf: { '@id': `${SITE.origem}/#site` },
        about: { '@id': `${SITE.origem}/#emissora` },
      },
    ],
  };
}
