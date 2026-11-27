import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import middleware, {
  REDIRECIONAR_DOMINIO_ANTIGO,
  ehDominioAntigo,
} from '../middleware.js';
import { APRESENTACAO, H1_HOME, ROTAS_SEO, urlCanonica } from '../src/config/seo.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(raiz, 'dist');
const falhas = [];

function requisicao(url) {
  const endereco = new URL(url);
  return new Request(url, { headers: { host: endereco.host } });
}

function afirmar(condicao, mensagem) {
  if (!condicao) falhas.push(mensagem);
}

function ler(relativo) {
  return fs.readFileSync(path.join(dist, relativo), 'utf8');
}

function conteudoMeta(html, atributo, chave) {
  const regex = new RegExp(`<meta ${atributo}="${chave}" content="([^"]*)"\\s*/?>`);
  const encontrado = html.match(regex);
  return encontrado ? encontrado[1] : null;
}

function jsonLd(html) {
  const encontrado = html.match(/<script\b[^>]*\bid="tvpossi-dados-estruturados"[^>]*>([\s\S]*?)<\/script>/);
  if (!encontrado) return null;
  return JSON.parse(encontrado[1]);
}

function chaves(valor, encontradas = new Set()) {
  if (!valor || typeof valor !== 'object') return encontradas;
  if (Array.isArray(valor)) {
    valor.forEach((item) => chaves(item, encontradas));
    return encontradas;
  }
  Object.keys(valor).forEach((chave) => {
    encontradas.add(chave);
    chaves(valor[chave], encontradas);
  });
  return encontradas;
}

function verificarHtml() {
  const apresentacao = 'A TV Possi 16.1 é uma emissora de televisão de Caucaia, no Ceará, com transmissão ao vivo pelo Canal 16.1 HD e programação para Caucaia e a Região Metropolitana de Fortaleza. Antes conhecida como TV Metrópole, a emissora agora apresenta sua nova identidade.';
  afirmar(APRESENTACAO === apresentacao, 'A apresentação institucional mudou em relação ao texto aprovado.');
  afirmar(H1_HOME === 'TV Possi 16.1 — Televisão de Caucaia ao vivo', 'O H1 da Home mudou em relação ao texto aprovado.');

  const scripts = new Set();
  for (const rota of ROTAS_SEO) {
    const html = ler(rota.arquivo);
    const canonico = urlCanonica(rota.caminho);
    const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const dados = jsonLd(html);
    const organizacao = dados?.['@graph']?.find((item) => item['@type'] === 'Organization');
    const pagina = dados?.['@graph']?.find((item) => item['@type'] === 'WebPage');
    const proibidas = ['address', 'telephone', 'email', 'sameAs', 'contactPoint', 'faxNumber', 'streetAddress', 'postalCode', 'geo', 'taxID', 'vatID'];

    afirmar(titulo === rota.titulo, `${rota.caminho}: title "${titulo}"`);
    afirmar(conteudoMeta(html, 'name', 'description') === rota.descricao, `${rota.caminho}: description`);
    afirmar(conteudoMeta(html, 'name', 'robots') === 'index, follow', `${rota.caminho}: robots`);
    afirmar((html.match(/rel="canonical"/g) || []).length === 1, `${rota.caminho}: canonical duplicado ou ausente`);
    afirmar(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] === canonico, `${rota.caminho}: canonical`);
    afirmar(conteudoMeta(html, 'property', 'og:title') === rota.titulo, `${rota.caminho}: og:title`);
    afirmar(conteudoMeta(html, 'property', 'og:description') === rota.descricao, `${rota.caminho}: og:description`);
    afirmar(conteudoMeta(html, 'property', 'og:type') === 'website', `${rota.caminho}: og:type`);
    afirmar(conteudoMeta(html, 'property', 'og:url') === canonico, `${rota.caminho}: og:url`);
    afirmar(conteudoMeta(html, 'property', 'og:image') === 'https://www.tvpossi16.com.br/logo-tv-possi.jpg', `${rota.caminho}: og:image`);
    afirmar(conteudoMeta(html, 'property', 'og:locale') === 'pt_BR', `${rota.caminho}: og:locale`);
    afirmar(conteudoMeta(html, 'name', 'twitter:card') === 'summary', `${rota.caminho}: twitter:card`);
    afirmar((html.match(/application\/ld\+json/g) || []).length === 1, `${rota.caminho}: JSON-LD duplicado ou ausente`);
    afirmar(dados?.['@context'] === 'https://schema.org', `${rota.caminho}: @context`);
    afirmar(organizacao?.name === 'TV Possi 16.1', `${rota.caminho}: nome estruturado`);
    afirmar(organizacao?.url === 'https://www.tvpossi16.com.br/', `${rota.caminho}: url estruturada`);
    afirmar(organizacao?.logo?.url === 'https://www.tvpossi16.com.br/logo-tv-possi.jpg', `${rota.caminho}: logo`);
    afirmar(organizacao?.description === apresentacao, `${rota.caminho}: descrição estruturada`);
    afirmar(JSON.stringify(organizacao?.areaServed) === JSON.stringify(['Caucaia', 'Ceará', 'Região Metropolitana de Fortaleza']), `${rota.caminho}: área de atuação`);
    afirmar(pagina?.url === canonico, `${rota.caminho}: WebPage`);
    afirmar(pagina?.name === rota.titulo, `${rota.caminho}: nome da WebPage`);
    afirmar(!proibidas.some((chave) => chaves(dados).has(chave)), `${rota.caminho}: dado institucional não verificado`);
    afirmar(html.includes('<div id="root">'), `${rota.caminho}: o HTML não é o shell do aplicativo`);
    scripts.add(html.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1] || '');
  }

  afirmar(scripts.size === 1 && !scripts.has(''), 'As três rotas não carregam o mesmo aplicativo.');

  const vercel = JSON.parse(fs.readFileSync(path.join(raiz, 'vercel.json'), 'utf8'));
  const fontes = vercel.rewrites.map((regra) => regra.source);
  const indiceProgramacao = fontes.indexOf('/programacao');
  const indiceNoticias = fontes.indexOf('/noticias');
  const indiceSpa = fontes.findIndex((fonte) => fonte.includes('index.html') || fonte.includes('(?!api/)'));
  afirmar(indiceProgramacao >= 0 && indiceProgramacao < indiceSpa, 'O rewrite de /programacao precisa vir antes do fallback da aplicação.');
  afirmar(indiceNoticias >= 0 && indiceNoticias < indiceSpa, 'O rewrite de /noticias precisa vir antes do fallback da aplicação.');
  afirmar(vercel.rewrites[indiceProgramacao].destination === '/programacao/index.html', 'Destino de /programacao');
  afirmar(vercel.rewrites[indiceNoticias].destination === '/noticias/index.html', 'Destino de /noticias');
}

async function verificarMiddleware() {
  afirmar(REDIRECIONAR_DOMINIO_ANTIGO === true, 'O redirecionamento 308 do domínio antigo está desligado.');
  afirmar(ehDominioAntigo('www.tvpossi16.com.br') === false, 'O domínio oficial entrou na lista de redirecionamento.');
  afirmar(ehDominioAntigo('tvpossi16.com.br') === false, 'O ápice oficial entrou na lista de redirecionamento.');

  const casos = [
    ['https://www.tvmetropolecanal16.com.br/', 'https://www.tvpossi16.com.br/'],
    ['https://www.tvmetropolecanal16.com.br/programacao', 'https://www.tvpossi16.com.br/programacao'],
    ['https://www.tvmetropolecanal16.com.br/noticias?origem=teste', 'https://www.tvpossi16.com.br/noticias?origem=teste'],
    ['https://www.tvmetropolecanal16.com.br/caminho-antigo?origem=teste', 'https://www.tvpossi16.com.br/'],
    ['https://tvmetropolecanal16.com.br/programacao?origem=teste', 'https://www.tvpossi16.com.br/programacao?origem=teste'],
  ];

  for (const [origem, destino] of casos) {
    const resposta = await middleware(requisicao(origem));
    const corpo = await resposta.text();
    const location = resposta.headers.get('location');
    afirmar(resposta.status === 308, `${origem} respondeu ${resposta.status}.`);
    afirmar(location === destino, `${origem} apontou para ${location}.`);
    afirmar(!corpo.includes('Estamos de cara nova!'), `${origem} ainda devolve o aviso.`);
    afirmar(location?.startsWith('https://www.tvpossi16.com.br'), `${origem} não usa o domínio oficial.`);
  }

  const transmissao = fs.readFileSync(path.join(raiz, 'src', 'components', 'LivePlayer.jsx'), 'utf8');
  afirmar(
    transmissao.includes('https://cdn-fundacao-2110.ciclano.io:1443/fundacao-2110/fundacao-2110/playlist.m3u8'),
    'O endereço da transmissão foi alterado.',
  );
}

function servir() {
  const tipos = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  const servidor = http.createServer((req, res) => {
    const pedido = decodeURIComponent((req.url || '/').split('?')[0]);
    let relativo = 'index.html';
    if (pedido === '/programacao' || pedido === '/programacao/') relativo = 'programacao/index.html';
    else if (pedido === '/noticias' || pedido === '/noticias/') relativo = 'noticias/index.html';
    else if (pedido !== '/') relativo = pedido.replace(/^\/+/, '');

    let arquivo = path.normalize(path.join(dist, relativo));
    const fora = path.relative(dist, arquivo).startsWith('..') || path.isAbsolute(path.relative(dist, arquivo));
    if (fora || !fs.existsSync(arquivo) || !fs.statSync(arquivo).isFile()) {
      arquivo = path.join(dist, 'index.html');
    }
    const extensao = path.extname(arquivo);
    res.writeHead(200, { 'Content-Type': tipos[extensao] || 'application/octet-stream' });
    fs.createReadStream(arquivo).pipe(res);
  });

  servidor.listen(4178, '127.0.0.1');
}

const verificacao = Promise.resolve()
  .then(verificarHtml)
  .then(verificarMiddleware)
  .then(() => {
    if (falhas.length) {
      falhas.forEach((falha) => console.error(falha));
      process.exitCode = 1;
      return;
    }
    console.log('SEO local conferido.');
    if (process.argv.includes('--servir')) servir();
  })
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  });

await verificacao;
