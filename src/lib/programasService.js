import { supabase } from './supabase';
import { horaParaBanco } from '../utils/programacao';

const TABELA = 'Programação';

// Campos persistidos na tabela (evita enviar chaves extras como id/created_at)
const montarPayload = (dados) => ({
  titulo: dados.titulo?.trim() || '',
  descricao: dados.descricao?.trim() || null,
  horario_inicio: horaParaBanco(dados.horario_inicio),
  horario_fim: horaParaBanco(dados.horario_fim),
  dias_semana: Array.isArray(dados.dias_semana) ? dados.dias_semana : [],
  tipo: dados.tipo || 'AO VIVO',
  ativo: dados.ativo ?? true,
  imagem_url: dados.imagem_url?.trim() || null,
});

export const listarProgramas = async () => {
  const { data, error } = await supabase
    .from(TABELA)
    .select('*')
    .order('horario_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const criarPrograma = async (dados) => {
  const { data, error } = await supabase
    .from(TABELA)
    .insert(montarPayload(dados))
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const atualizarPrograma = async (id, dados) => {
  const { data, error } = await supabase
    .from(TABELA)
    .update(montarPayload(dados))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const excluirPrograma = async (id) => {
  const { error } = await supabase.from(TABELA).delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const duplicarPrograma = async (programa) => {
  const copia = montarPayload(programa);
  copia.titulo = `${copia.titulo} (cópia)`;
  const { data, error } = await supabase
    .from(TABELA)
    .insert(copia)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const alternarAtivo = async (id, ativo) => {
  const { data, error } = await supabase
    .from(TABELA)
    .update({ ativo })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Aplica em lote as diferenças selecionadas na importação de grade.
// changes = { novos: [...], alterados: [{ id, dados }], removidos: [ids] }
export const aplicarImportacao = async ({ novos = [], alterados = [], removidos = [] }) => {
  const resultado = { inseridos: 0, atualizados: 0, excluidos: 0 };

  if (novos.length) {
    const { error } = await supabase.from(TABELA).insert(novos.map(montarPayload));
    if (error) throw error;
    resultado.inseridos = novos.length;
  }

  for (const item of alterados) {
    const { error } = await supabase
      .from(TABELA)
      .update(montarPayload(item.dados))
      .eq('id', item.id);
    if (error) throw error;
    resultado.atualizados += 1;
  }

  if (removidos.length) {
    const { error } = await supabase.from(TABELA).delete().in('id', removidos);
    if (error) throw error;
    resultado.excluidos = removidos.length;
  }

  return resultado;
};
