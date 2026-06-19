// Constantes e helpers compartilhados da Programação (TV Metrópole)

// Dias da semana no formato armazenado na coluna "dias_semana" (array).
// A ordem aqui define a ordenação canônica usada na tabela e na grade.
export const DIAS_SEMANA = [
  { value: 'domingo', label: 'Domingo', curto: 'Dom' },
  { value: 'segunda', label: 'Segunda', curto: 'Seg' },
  { value: 'terça', label: 'Terça', curto: 'Ter' },
  { value: 'quarta', label: 'Quarta', curto: 'Qua' },
  { value: 'quinta', label: 'Quinta', curto: 'Qui' },
  { value: 'sexta', label: 'Sexta', curto: 'Sex' },
  { value: 'sábado', label: 'Sábado', curto: 'Sáb' },
];

export const DIA_ORDEM = DIAS_SEMANA.reduce((acc, d, i) => {
  acc[d.value] = i;
  return acc;
}, {});

export const TIPOS_PROGRAMA = [
  { value: 'AO VIVO', label: 'Ao Vivo', cor: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'REPRISE', label: 'Reprise', cor: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'STREAM', label: 'Stream', cor: 'bg-blue-100 text-blue-700 border-blue-200' },
];

// Normaliza variações de nome de dia (acentos / abreviações) para o valor canônico.
const MAPA_DIAS = {
  domingo: 'domingo', dom: 'domingo',
  segunda: 'segunda', seg: 'segunda', 'segunda-feira': 'segunda',
  terca: 'terça', 'terça': 'terça', ter: 'terça', 'terca-feira': 'terça', 'terça-feira': 'terça',
  quarta: 'quarta', qua: 'quarta', 'quarta-feira': 'quarta',
  quinta: 'quinta', qui: 'quinta', 'quinta-feira': 'quinta',
  sexta: 'sexta', sex: 'sexta', 'sexta-feira': 'sexta',
  sabado: 'sábado', 'sábado': 'sábado', sab: 'sábado', sáb: 'sábado',
};

export const normalizarDia = (dia) => {
  if (!dia) return null;
  const chave = String(dia).trim().toLowerCase();
  return MAPA_DIAS[chave] || null;
};

// Remove os segundos de um horário "HH:MM:SS" -> "HH:MM"
export const formatarHora = (hora) => {
  if (!hora) return '--:--';
  return String(hora).slice(0, 5);
};

// Garante "HH:MM:SS" para salvar no banco (coluna time)
export const horaParaBanco = (hora) => {
  if (!hora) return null;
  const partes = String(hora).split(':');
  const hh = (partes[0] || '00').padStart(2, '0');
  const mm = (partes[1] || '00').padStart(2, '0');
  const ss = (partes[2] || '00').padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

export const labelDias = (dias) => {
  if (!Array.isArray(dias) || dias.length === 0) return '—';
  if (dias.length === 7) return 'Todos os dias';
  return dias
    .map((d) => DIAS_SEMANA.find((x) => x.value === normalizarDia(d))?.curto || d)
    .join(', ');
};
