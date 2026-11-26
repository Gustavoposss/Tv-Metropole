import fs from 'node:fs';
import path from 'node:path';
import { dadosEstruturados, LOGO_URL, ROTAS_SEO, rotaPorCaminho, urlCanonica } from '../src/config/seo.js';

function escaparAtributo(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function substituirUma(html, regex, valor, nome) {
  const encontradas = html.match(regex);
  if (!encontradas || encontradas.length !== 1) {
    throw new Error(`A tag ${nome} precisa aparecer uma única vez no HTML.`);
  }
  return html.replace(regex, valor);
}

function substituirMeta(html, atributo, chave, conteudo) {
  const regex = new RegExp(`<meta ${atributo}="${chave}" content="[^"]*"\\s*/?>`);
  const seguro = escaparAtributo(conteudo);
  return substituirUma(
    html,
    regex,
    `<meta ${atributo}="${chave}" content="${seguro}" />`,
    `${atributo}=${chave}`,
  );
}

export function aplicarSeo(html, rota) {
  const canonico = urlCanonica(rota.caminho);
  const json = JSON.stringify(dadosEstruturados(rota)).replaceAll('<', '\\u003c');
  let resultado = html;
  resultado = substituirUma(resultado, /<title>[^<]*<\/title>/, `<title>${escaparAtributo(rota.titulo)}</title>`, 'title');
  resultado = substituirMeta(resultado, 'name', 'description', rota.descricao);
  resultado = substituirMeta(resultado, 'name', 'robots', 'index, follow');
  resultado = substituirUma(
    resultado,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escaparAtributo(canonico)}" />`,
    'canonical',
  );
  resultado = substituirMeta(resultado, 'property', 'og:title', rota.titulo);
  resultado = substituirMeta(resultado, 'property', 'og:description', rota.descricao);
  resultado = substituirMeta(resultado, 'property', 'og:type', 'website');
  resultado = substituirMeta(resultado, 'property', 'og:url', canonico);
  resultado = substituirMeta(resultado, 'property', 'og:image', LOGO_URL);
  resultado = substituirMeta(resultado, 'property', 'og:locale', 'pt_BR');
  resultado = substituirMeta(resultado, 'name', 'twitter:card', 'summary');
  resultado = substituirMeta(resultado, 'name', 'twitter:title', rota.titulo);
  resultado = substituirMeta(resultado, 'name', 'twitter:description', rota.descricao);
  resultado = substituirUma(
    resultado,
    /<script\b[^>]*\bid="tvpossi-dados-estruturados"[^>]*>[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="tvpossi-dados-estruturados">${json}</script>`,
    'json-ld',
  );

  if ((resultado.match(/rel="canonical"/g) || []).length !== 1) {
    throw new Error(`Canonical duplicado em ${rota.caminho}.`);
  }
  if ((resultado.match(/application\/ld\+json/g) || []).length !== 1) {
    throw new Error(`JSON-LD duplicado em ${rota.caminho}.`);
  }
  return resultado;
}

export function htmlPorRota() {
  return {
    name: 'html-por-rota',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx?.server) return html;
        const rota = rotaPorCaminho(ctx.originalUrl || ctx.path || '/');
        if (!rota) return html;
        return aplicarSeo(html, rota);
      },
    },
    writeBundle(outputOptions) {
      const dir = outputOptions.dir;
      if (!dir) return;
      const base = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
      for (const rota of ROTAS_SEO) {
        const destino = path.join(dir, rota.arquivo);
        fs.mkdirSync(path.dirname(destino), { recursive: true });
        fs.writeFileSync(destino, aplicarSeo(base, rota));
      }
    },
  };
}
