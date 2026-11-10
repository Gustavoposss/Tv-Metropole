// Na Vercel, MAINTENANCE_MODE=true responde 503 nas rotas públicas.
// Fora isso, next() entrega a requisição ao portal normal.
// /admin, /api e arquivos com extensão (logo, JS, CSS) ficam de fora do matcher.
import { next } from '@vercel/functions';

const HTML = `<!DOCTYPE html>
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

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api/|admin|.*\\..*).*)', '/robots.txt', '/sitemap.xml'],
};

export default function middleware(request) {
  if (process.env.MAINTENANCE_MODE !== 'true') return next();

  const caminho = new URL(request.url).pathname;

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

  return new Response(HTML, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '86400',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store',
    },
  });
}
