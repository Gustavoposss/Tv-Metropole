import { normalizarDia, formatarHora, DIA_ORDEM } from '../utils/programacao.js';

// Ordem das colunas no PDF da grade (esquerda -> direita)
const DIAS_COLUNAS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'];

// Faixa de horário completa: "06:00 ÀS 07:00" (tolera ÀS/AS/ÁS, "-", "h", espaços e quebras)
const REGEX_FAIXA =
  /(\d{1,2})\s*[:hH]\s*(\d{2})\s*(?:ÀS|ÁS|AS|-|–|—|A|\/)\s*(\d{1,2})\s*[:hH]\s*(\d{2})/i;

// Início de faixa (mesmo que o fim esteja quebrado em outro fragmento)
const REGEX_FAIXA_INICIO = /^\s*\d{1,2}\s*[:hH]\s*\d{2}\s*(?:ÀS|ÁS|AS|-|–|—)/i;

// Linhas de ruído (cabeçalho/rodapé/data) que devem ser ignoradas no título
const REGEX_RUIDO =
  /(TV\s*METR[ÓO]POLE|ATUALIZADA\s*EM|^\s*--.*--\s*$|^\s*\d{2}\/\d{2}\/\d{4}\s*$)/i;

const dois = (n) => String(n).padStart(2, '0');

const detectarTipo = (texto) => {
  const t = texto.toUpperCase();
  if (t.includes('AO VIVO') || t.includes('AOVIVO')) return 'AO VIVO';
  if (t.includes('REPRISE')) return 'REPRISE';
  if (t.includes('STREAM')) return 'STREAM';
  return 'AO VIVO';
};

const limparTitulo = (texto) =>
  texto
    .replace(/\(?\s*(AO\s*VIVO|AOVIVO|REPRISE|STREAM)\s*\)?/gi, ' ')
    .replace(/\(\s*AO\b/gi, ' ')
    .replace(/\bVIVO\s*\)/gi, ' ')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// ---------------------------------------------------------------------
// Detecção das colunas de uma página a partir dos x das faixas de horário
// ---------------------------------------------------------------------
const detectarColunas = (itens) => {
  const xs = itens
    .filter((i) => REGEX_FAIXA_INICIO.test(i.str) || REGEX_FAIXA.test(i.str))
    .map((i) => i.x)
    .sort((a, b) => a - b);

  if (!xs.length) return [];

  const grupos = [];
  let atual = [xs[0]];
  for (let k = 1; k < xs.length; k++) {
    if (xs[k] - atual[atual.length - 1] > 40) {
      grupos.push(atual);
      atual = [];
    }
    atual.push(xs[k]);
  }
  grupos.push(atual);

  return grupos.map((g) => Math.min(...g)).sort((a, b) => a - b);
};

const colunaDoX = (x, colStarts) => {
  let idx = 0;
  for (let k = 0; k < colStarts.length; k++) {
    if (x >= colStarts[k] - 10) idx = k;
    else break;
  }
  return idx;
};

// Junta fragmentos de uma mesma linha respeitando o espaçamento real (gap em X)
const juntarLinha = (fragmentos) => {
  fragmentos.sort((a, b) => a.x - b.x);
  let texto = '';
  let fimAnterior = null;
  for (const f of fragmentos) {
    if (fimAnterior !== null) {
      const gap = f.x - fimAnterior;
      texto += gap > 1.5 ? ' ' : '';
    }
    texto += f.str;
    fimAnterior = f.x + (f.width || 0);
  }
  return texto.replace(/\s+/g, ' ').trim();
};

// Agrupa itens de uma coluna em linhas (mesmo y) ordenadas de cima para baixo,
// considerando a ordem das páginas (página 1 acima da página 2).
const construirLinhas = (itens) => {
  const ordenados = [...itens].sort((a, b) => a.page - b.page || b.y - a.y);
  const linhas = [];
  let buffer = [];
  let refY = null;
  let refPage = null;

  const flush = () => {
    if (buffer.length) linhas.push(juntarLinha(buffer));
    buffer = [];
  };

  for (const it of ordenados) {
    if (refY === null || (it.page === refPage && Math.abs(it.y - refY) <= 4)) {
      buffer.push(it);
      refY = refY === null ? it.y : refY;
      refPage = it.page;
    } else {
      flush();
      buffer = [it];
      refY = it.y;
      refPage = it.page;
    }
  }
  flush();
  return linhas;
};

// Converte as linhas de uma coluna (um dia) em blocos de programa
const blocosDaColuna = (linhas, dia) => {
  const blocos = [];
  let atual = null;

  for (const linha of linhas) {
    const m = linha.match(REGEX_FAIXA);
    const ehInicio = m && REGEX_FAIXA_INICIO.test(linha);

    if (ehInicio) {
      if (atual) blocos.push(atual);
      atual = {
        horario_inicio: `${dois(m[1])}:${dois(m[2])}:00`,
        horario_fim: `${dois(m[3])}:${dois(m[4])}:00`,
        tituloLinhas: [],
        dia,
      };
      // Caso haja texto após a faixa na mesma linha
      const resto = linha.replace(REGEX_FAIXA, '').trim();
      if (resto) atual.tituloLinhas.push(resto);
    } else if (atual) {
      if (!REGEX_RUIDO.test(linha)) atual.tituloLinhas.push(linha);
    }
    // linhas antes do primeiro bloco (preâmbulo) são descartadas
  }
  if (atual) blocos.push(atual);

  return blocos
    .map((b) => {
      const bruto = b.tituloLinhas.join(' ');
      return {
        titulo: limparTitulo(bruto),
        horario_inicio: b.horario_inicio,
        horario_fim: b.horario_fim,
        tipo: detectarTipo(bruto),
        dias_semana: [b.dia],
        ativo: true,
      };
    })
    .filter((p) => p.titulo);
};

// ---------------------------------------------------------------------
// Parser principal: itens [{ page, x, y, width, str }] -> programas
// ---------------------------------------------------------------------
export const parsearItens = (itens) => {
  // Ignora a faixa de título superior ("TV METRÓPOLE 16.1") que fica acima da grade
  const limpos = itens
    .filter((i) => i.str && i.str.trim() && i.y < 515)
    .map((i) => ({ ...i, str: i.str.trim() }));

  // Colunas detectadas por página (mesma ordem de dias em todas)
  const porPagina = new Map();
  for (const it of limpos) {
    if (!porPagina.has(it.page)) porPagina.set(it.page, []);
    porPagina.get(it.page).push(it);
  }

  const colunasPorDia = new Map(); // dia -> itens
  for (const [, itensPagina] of porPagina) {
    const colStarts = detectarColunas(itensPagina);
    if (!colStarts.length) continue;

    for (const it of itensPagina) {
      const idx = colunaDoX(it.x, colStarts);
      const dia = DIAS_COLUNAS[idx] || DIAS_COLUNAS[DIAS_COLUNAS.length - 1];
      if (!colunasPorDia.has(dia)) colunasPorDia.set(dia, []);
      colunasPorDia.get(dia).push(it);
    }
  }

  let programas = [];
  for (const [dia, itensColuna] of colunasPorDia) {
    const linhas = construirLinhas(itensColuna);
    programas = programas.concat(blocosDaColuna(linhas, dia));
  }

  return mesclarPorPrograma(programas);
};

// Mescla entradas idênticas (mesmo título/horário/tipo) somando os dias
const mesclarPorPrograma = (programas) => {
  const mapa = new Map();
  for (const p of programas) {
    const k = `${p.titulo.toLowerCase()}|${p.horario_inicio}|${p.horario_fim}|${p.tipo}`;
    if (mapa.has(k)) {
      const alvo = mapa.get(k);
      for (const d of p.dias_semana) if (!alvo.dias_semana.includes(d)) alvo.dias_semana.push(d);
    } else {
      mapa.set(k, { ...p, dias_semana: [...p.dias_semana] });
    }
  }
  return [...mapa.values()].map((p) => ({
    ...p,
    dias_semana: p.dias_semana
      .map(normalizarDia)
      .filter(Boolean)
      .sort((a, b) => (DIA_ORDEM[a] ?? 99) - (DIA_ORDEM[b] ?? 99)),
  }));
};

// =====================================================================
// Comparação entre grade importada e grade atual
// =====================================================================
const normTitulo = (t) =>
  (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const mesmosDias = (a = [], b = []) => {
  const sa = [...a].map(normalizarDia).filter(Boolean).sort().join(',');
  const sb = [...b].map(normalizarDia).filter(Boolean).sort().join(',');
  return sa === sb;
};

const diferencas = (atual, novo) => {
  const campos = [];
  if (formatarHora(atual.horario_inicio) !== formatarHora(novo.horario_inicio)) campos.push('hora inicial');
  if (formatarHora(atual.horario_fim) !== formatarHora(novo.horario_fim)) campos.push('hora final');
  if (!mesmosDias(atual.dias_semana, novo.dias_semana)) campos.push('dias');
  if ((atual.tipo || 'AO VIVO') !== (novo.tipo || 'AO VIVO')) campos.push('tipo');
  return campos;
};

export const compararGrade = (importados, atuais) => {
  const novos = [];
  const alterados = [];

  const atuaisRestantes = atuais.map((p) => ({ ref: p, consumido: false }));
  const importadosRestantes = importados.map((p) => ({ ref: p, consumido: false }));

  // Passo 1: casa por título + horário (mesmo slot) -> detecta dias/tipo alterados
  for (const imp of importadosRestantes) {
    const k3 = `${normTitulo(imp.ref.titulo)}|${imp.ref.horario_inicio}|${imp.ref.horario_fim}`;
    const alvo = atuaisRestantes.find(
      (a) =>
        !a.consumido &&
        `${normTitulo(a.ref.titulo)}|${a.ref.horario_inicio}|${a.ref.horario_fim}` === k3
    );
    if (alvo) {
      imp.consumido = true;
      alvo.consumido = true;
      const campos = diferencas(alvo.ref, imp.ref);
      if (campos.length) alterados.push({ id: alvo.ref.id, atual: alvo.ref, novo: imp.ref, campos });
    }
  }

  // Passo 2: casa pelo título (horário mudou) -> alteração de horário
  for (const imp of importadosRestantes) {
    if (imp.consumido) continue;
    const alvo = atuaisRestantes.find(
      (a) => !a.consumido && normTitulo(a.ref.titulo) === normTitulo(imp.ref.titulo)
    );
    if (alvo) {
      imp.consumido = true;
      alvo.consumido = true;
      const campos = diferencas(alvo.ref, imp.ref);
      if (campos.length) alterados.push({ id: alvo.ref.id, atual: alvo.ref, novo: imp.ref, campos });
    }
  }

  for (const imp of importadosRestantes) if (!imp.consumido) novos.push(imp.ref);
  const removidos = atuaisRestantes.filter((a) => !a.consumido).map((a) => a.ref);

  return { novos, alterados, removidos };
};
