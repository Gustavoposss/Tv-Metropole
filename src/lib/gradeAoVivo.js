import { normalizarDia } from '../utils/programacao.js';

const FUSO = 'America/Fortaleza';

const DIAS_INTL = {
  Sun: 'domingo',
  Mon: 'segunda',
  Tue: 'terça',
  Wed: 'quarta',
  Thu: 'quinta',
  Fri: 'sexta',
  Sat: 'sábado',
};

export function minutosDoHorario(hora) {
  if (!hora) return null;
  const [brutoHora, brutoMinuto] = String(hora).slice(0, 5).split(':');
  const horaNum = Number(brutoHora);
  const minutoNum = Number(brutoMinuto);
  if (!Number.isInteger(horaNum) || !Number.isInteger(minutoNum)) return null;
  if (horaNum < 0 || horaNum > 23 || minutoNum < 0 || minutoNum > 59) return null;
  return horaNum * 60 + minutoNum;
}

export function partesFortaleza(data = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: FUSO,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(data).map((parte) => [parte.type, parte.value]),
  );
  const hora = partes.hour === '24' ? '00' : partes.hour;
  return {
    dia: DIAS_INTL[partes.weekday],
    minutos: Number(hora) * 60 + Number(partes.minute),
    hora: `${hora}:${partes.minute}`,
  };
}

export function programaValeNoDia(programa, dia) {
  if (!programa || programa.ativo === false) return false;
  const dias = programa.dias_semana;
  if (dias == null) return true;
  if (!Array.isArray(dias) || dias.length === 0) return false;
  return dias.some((item) => {
    const texto = String(item).trim().toLowerCase();
    return texto === 'todos os dias' || normalizarDia(item) === dia;
  });
}

function inicioEfetivo(programa, agoraMin) {
  const inicio = minutosDoHorario(programa.horario_inicio);
  const fim = minutosDoHorario(programa.horario_fim);
  if (inicio == null || fim == null) return -Infinity;
  if (fim > inicio) return inicio;
  return agoraMin >= inicio ? inicio : inicio - 1440;
}

export function estaNoAr(programa, data = new Date()) {
  const agora = partesFortaleza(data);
  const ontem = partesFortaleza(new Date(data.getTime() - 86400000));
  const inicio = minutosDoHorario(programa?.horario_inicio);
  const fim = minutosDoHorario(programa?.horario_fim);
  if (inicio == null || fim == null || inicio === fim) return false;
  if (fim > inicio) {
    return programaValeNoDia(programa, agora.dia) && agora.minutos >= inicio && agora.minutos < fim;
  }
  if (agora.minutos >= inicio && programaValeNoDia(programa, agora.dia)) return true;
  return agora.minutos < fim && programaValeNoDia(programa, ontem.dia);
}

const ORDEM_DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function diaAnterior(dia) {
  const indice = ORDEM_DIAS.indexOf(dia);
  if (indice < 0) return null;
  return ORDEM_DIAS[(indice + 6) % 7];
}

export function cruzaMeiaNoite(programa) {
  const inicio = minutosDoHorario(programa?.horario_inicio);
  const fim = minutosDoHorario(programa?.horario_fim);
  if (inicio == null || fim == null || inicio === fim) return false;
  return fim < inicio;
}

export function periodoDoHorario(hora) {
  const minutos = minutosDoHorario(hora);
  if (minutos == null) return '';
  if (minutos < 6 * 60) return 'Madrugada';
  if (minutos < 12 * 60) return 'Manhã';
  if (minutos < 18 * 60) return 'Tarde';
  return 'Noite';
}

function slotContemAgora(programa, agora) {
  const inicio = minutosDoHorario(programa?.horario_inicio);
  const fim = minutosDoHorario(programa?.horario_fim);
  if (inicio == null || fim == null || inicio === fim) return false;
  if (fim > inicio) return agora.minutos >= inicio && agora.minutos < fim;
  return agora.minutos >= inicio;
}

export function programasDoDia(programas, dia, data = new Date()) {
  const agora = partesFortaleza(data);
  const hoje = agora.dia === dia;
  const atual = hoje ? montarVisao(programas, data).atual : null;
  const ativos = (Array.isArray(programas) ? programas : []).filter((programa) => programa?.ativo !== false);
  const itens = ativos
    .filter((programa) => programaValeNoDia(programa, dia))
    .sort((a, b) => minutosDoHorario(a.horario_inicio) - minutosDoHorario(b.horario_inicio))
    .map((programa) => ({
      chave: String(programa.id),
      programa,
      continuacao: false,
      noAr: Boolean(hoje && atual && programa.id === atual.id && slotContemAgora(programa, agora)),
    }));

  const fim = atual ? minutosDoHorario(atual.horario_fim) : null;
  const inicio = atual ? minutosDoHorario(atual.horario_inicio) : null;
  const veioDoDiaAnterior = Boolean(
    hoje && atual && cruzaMeiaNoite(atual) && fim != null && inicio != null
    && agora.minutos < fim && agora.minutos < inicio
    && programaValeNoDia(atual, diaAnterior(dia)),
  );

  if (veioDoDiaAnterior) {
    itens.forEach((item) => {
      if (item.programa.id === atual.id) item.noAr = false;
    });
    itens.unshift({
      chave: `continuacao-${atual.id}`,
      programa: atual,
      continuacao: true,
      noAr: true,
    });
  }

  return { agora, atual, itens };
}

function comecaDepois(programa, data) {
  const agora = partesFortaleza(data);
  const inicio = minutosDoHorario(programa?.horario_inicio);
  if (inicio == null) return false;
  return programaValeNoDia(programa, agora.dia) && inicio > agora.minutos && !estaNoAr(programa, data);
}

export function montarVisao(programas, data = new Date()) {
  const agora = partesFortaleza(data);
  const ativos = (Array.isArray(programas) ? programas : []).filter((programa) => programa?.ativo !== false);
  const noAr = ativos
    .filter((programa) => estaNoAr(programa, data))
    .sort((a, b) => inicioEfetivo(b, agora.minutos) - inicioEfetivo(a, agora.minutos));
  const atual = noAr[0] || null;
  const proximos = ativos
    .filter((programa) => programa !== atual && comecaDepois(programa, data))
    .sort((a, b) => minutosDoHorario(a.horario_inicio) - minutosDoHorario(b.horario_inicio));

  return { agora, atual, proximos };
}
