// O domínio antigo mostra o aviso de mudança de identidade.
// www.tvpossi16.com.br segue para o portal. A manutenção só vale fora do domínio antigo.
import { next } from '@vercel/functions';

const DOMINIOS_ANTIGOS = new Set([
  'tvmetropolecanal16.com.br',
  'www.tvmetropolecanal16.com.br',
]);

const ORIGEM_NOVA = 'https://www.tvpossi16.com.br';

const ROTAS_EQUIVALENTES = new Set([
  '/',
  '/noticias',
  '/programacao',
  '/admin',
  '/admin/login',
  '/admin/programacao',
  '/robots.txt',
  '/sitemap.xml',
]);

const HTML_MANUTENCAO = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="description" content="A TV Possi 16.1 está preparando um novo portal para você. Em breve, uma experiência ainda melhor." />
  <meta name="theme-color" content="#000000" />
  <title>TV Possi 16.1 — Em breve</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3.5rem 1.25rem;
      background: #000;
      color: #fff;
      text-align: center;
      font-family: "Segoe UI", system-ui, sans-serif;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        radial-gradient(circle at 0% 0%, rgba(20, 196, 200, 0.16), transparent 28%),
        radial-gradient(circle at 100% 36%, rgba(47, 120, 255, 0.12), transparent 30%),
        radial-gradient(circle at 24% 100%, rgba(255, 138, 30, 0.1), transparent 26%);
    }
    main { position: relative; width: min(100%, 42rem); }
    .canal {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 650;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: #d7dde8;
    }
    img { width: min(86vw, 420px); height: auto; margin-top: 1.5rem; }
    h1 {
      margin: 0.5rem 0 0;
      font-size: clamp(1.85rem, 5vw, 3rem);
      line-height: 1.15;
      font-weight: 650;
      letter-spacing: -0.03em;
    }
    .texto {
      margin: 1.25rem auto 0;
      max-width: 36rem;
      color: #d7dde8;
      font-size: clamp(1rem, 2.4vw, 1.125rem);
      line-height: 1.6;
    }
    .breve {
      margin: 2rem 0 0;
      color: #b7f3ee;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.04em;
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <main>
    <p class="canal">Canal 16.1</p>
    <img src="/logo-tv-possi.jpg" alt="TV Possi 16.1" width="1000" height="1073" />
    <h1>Estamos de cara nova!</h1>
    <p class="texto">A TV Possi 16.1 está preparando um novo portal para você. Em breve, uma experiência ainda melhor.</p>
    <p class="breve">Em breve, novidades!</p>
  </main>
</body>
</html>`;

export function hostnameDaRequisicao(request) {
  const bruto = request.headers.get('host') || '';
  return bruto.split(',')[0].trim().replace(/:\d+$/, '').replace(/\.$/, '').toLowerCase();
}

export function ehDominioAntigo(hostname) {
  return DOMINIOS_ANTIGOS.has(hostname);
}

function caminhoPublico(pathname) {
  if (!pathname || pathname === '/') return '/';
  const semBarra = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;
  return semBarra.startsWith('/') ? semBarra : `/${semBarra}`;
}

export function destinoDoAviso(requestUrl) {
  const origem = new URL(requestUrl);
  const caminho = caminhoPublico(origem.pathname);
  const equivalente = ROTAS_EQUIVALENTES.has(caminho);
  const destino = new URL(equivalente ? caminho : '/', ORIGEM_NOVA);
  if (equivalente) destino.search = origem.search;
  return destino.toString();
}

function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function htmlAviso(destino) {
  const seguro = escaparHtml(destino);
  const script = JSON.stringify(destino).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="theme-color" content="#0043a8" />
  <meta name="description" content="Uma nova identidade, com a mesma missão de informar e conectar você." />
  <meta http-equiv="refresh" content="5;url=${seguro}" />
  <link rel="canonical" href="${seguro}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&amp;family=Outfit:wght@600;700&amp;display=swap" rel="stylesheet" />
  <title>TV Possi 16.1 — Estamos de cara nova!</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));
      background:
        radial-gradient(circle at 0% 0%, rgba(0, 67, 168, 0.08), transparent 32%),
        radial-gradient(circle at 100% 100%, rgba(179, 98, 5, 0.08), transparent 28%),
        #f8fafc;
      color: #0f172a;
      font-family: Inter, "Segoe UI", system-ui, sans-serif;
    }
    main {
      width: min(100%, 36rem);
      padding: 2rem 1.25rem 1.5rem;
      border: 1px solid #cbd5e1;
      border-radius: 1.5rem;
      background: #fff;
      text-align: center;
    }
    img {
      width: min(46vw, 9.5rem);
      height: auto;
    }
    .canal {
      margin: 1rem 0 0;
      color: #0043a8;
      font-family: Outfit, Inter, sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    h1 {
      margin: 0.75rem 0 0;
      color: #002b6d;
      font-family: Outfit, Inter, sans-serif;
      font-size: clamp(1.85rem, 7vw, 2.75rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }
    h2 {
      margin: 0.85rem 0 0;
      color: #0043a8;
      font-family: Outfit, Inter, sans-serif;
      font-size: clamp(1.15rem, 4.5vw, 1.5rem);
      font-weight: 600;
      line-height: 1.3;
    }
    .texto {
      margin: 1rem auto 0;
      max-width: 32rem;
      color: #334155;
      font-size: 1rem;
      line-height: 1.6;
    }
    #contagem {
      margin: 1.25rem 0 0;
      color: #0f172a;
      font-size: 0.95rem;
      font-weight: 600;
    }
    .acao {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: 20rem;
      min-height: 2.75rem;
      margin-top: 1.25rem;
      padding: 0.75rem 1.25rem;
      border-radius: 0.85rem;
      background: #0043a8;
      color: #fff;
      font-family: Outfit, Inter, sans-serif;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
    }
    .acao:focus-visible {
      outline: 3px solid #002b6d;
      outline-offset: 3px;
    }
    @media (min-width: 640px) {
      main { padding: 2.5rem 2rem 2rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <main>
    <img src="/logo-tv-possi-header.png" alt="TV Possi 16.1" width="191" height="168" />
    <p class="canal">Canal 16.1 HD</p>
    <h1>Estamos de cara nova!</h1>
    <h2>A TV Metrópole agora é TV Possi 16.1!</h2>
    <p class="texto">Uma nova identidade, com a mesma missão de informar e conectar você.</p>
    <p id="contagem" role="timer" aria-live="polite" aria-atomic="true">Você será levado ao novo site em 5 segundos.</p>
    <a class="acao" href="${seguro}">Acessar novo site</a>
  </main>
  <script>
    (function () {
      var destino = ${script};
      var restante = 5;
      var aviso = document.getElementById('contagem');
      var relogio = window.setInterval(function () {
        restante -= 1;
        if (restante <= 0) {
          window.clearInterval(relogio);
          window.location.replace(destino);
          return;
        }
        var unidade = restante === 1 ? 'segundo' : 'segundos';
        if (aviso) aviso.textContent = 'Você será levado ao novo site em ' + restante + ' ' + unidade + '.';
      }, 1000);
    })();
  </script>
</body>
</html>`;
}

function respostaAviso(destino) {
  return new Response(htmlAviso(destino), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api/|.*\\..*).*)', '/robots.txt', '/sitemap.xml'],
};

export default function middleware(request) {
  const hostname = hostnameDaRequisicao(request);

  if (ehDominioAntigo(hostname)) {
    const destino = destinoDoAviso(request.url);
    const caminho = caminhoPublico(new URL(request.url).pathname);
    if (caminho === '/robots.txt' || caminho === '/sitemap.xml') {
      return Response.redirect(destino, 308);
    }
    return respostaAviso(destino);
  }

  if (process.env.MAINTENANCE_MODE !== 'true') return next();

  const caminho = new URL(request.url).pathname;
  if (caminho === '/admin' || caminho.startsWith('/admin/')) return next();

  if (caminho === '/robots.txt') {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (caminho === '/sitemap.xml') {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store',
      },
    });
  }

  return new Response(HTML_MANUTENCAO, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}
