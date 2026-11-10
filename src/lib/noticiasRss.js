const ATOM = 'http://www.w3.org/2005/Atom';
const MEDIA = 'http://search.yahoo.com/mrss/';
const LIMITE = 12;

export function enderecoRss() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return 'http://127.0.0.1:3001/api/rss';
  return '/api/rss';
}

export function limparTexto(texto) {
  return String(texto || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatarPublicacao(pubDate) {
  if (!pubDate) return '';
  const data = new Date(pubDate);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function linkSeguro(valor) {
  try {
    const url = new URL(String(valor || '').trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    return url.href;
  } catch {
    return '';
  }
}

function imagemDoItem(item, description) {
  const media = item.getElementsByTagNameNS(MEDIA, 'content')[0]?.getAttribute('url') || '';
  const marca = String(description).match(/<img[^>]+src=["']([^"']+)["']/i);
  return linkSeguro(media || marca?.[1] || '');
}

export function lerFeed(xmlText) {
  const xml = new DOMParser().parseFromString(String(xmlText || ''), 'text/xml');
  if (xml.querySelector('parsererror')) {
    throw new Error('RSS inválido');
  }

  return [...xml.getElementsByTagName('item')].slice(0, LIMITE).flatMap((item) => {
    const description = item.getElementsByTagName('description')[0]?.textContent || '';
    const subtitulo = item.getElementsByTagNameNS(ATOM, 'subtitle')[0]?.textContent || '';
    const noticia = {
      titulo: limparTexto(item.getElementsByTagName('title')[0]?.textContent),
      link: linkSeguro(item.getElementsByTagName('link')[0]?.textContent),
      publicadoEm: formatarPublicacao(item.getElementsByTagName('pubDate')[0]?.textContent),
      resumo: limparTexto(subtitulo) || limparTexto(description),
      imagem: imagemDoItem(item, description),
      fonte: 'G1',
    };
    return noticia.titulo && noticia.link ? [noticia] : [];
  });
}
