import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config/supabase.config';

// Criar cliente Supabase
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false
  }
});

// Função para buscar programas do dia atual
export const getProgramas = async () => {
  try {
    console.log('🔍 Buscando programas do Supabase...');
    
    // Pegar data de hoje
    const hoje = new Date();
    const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase();
    
    console.log('📅 Dia da semana:', diaSemana);
    
    const { data, error } = await supabase
      .from('Programação')
      .select('*')
      .order('horario_inicio', { ascending: true });

    if (error) {
      console.error('❌ Erro ao buscar programas:', error);
      throw error;
    }

    // Filtrar programas que se aplicam ao dia de hoje
    const programasHoje = data.filter(programa => {
      if (!programa.dias_semana) return true; // Se não tem filtro de dias, mostra
      
      // Verificar se dias_semana é um array
      const diasArray = Array.isArray(programa.dias_semana) 
        ? programa.dias_semana.map(d => d.toLowerCase().trim())
        : [];
      
      // Verificar se hoje está no array de dias
      const contemHoje = diasArray.some(dia => 
        dia === diaSemana || 
        dia === 'todos os dias' ||
        dia === 'segunda' && diaSemana === 'segunda-feira' ||
        dia === 'terça' && diaSemana === 'terça-feira' ||
        dia === 'terca' && diaSemana === 'terça-feira' ||
        dia === 'quarta' && diaSemana === 'quarta-feira' ||
        dia === 'quinta' && diaSemana === 'quinta-feira' ||
        dia === 'sexta' && diaSemana === 'sexta-feira' ||
        dia === 'sábado' && diaSemana === 'sábado' ||
        dia === 'sabado' && diaSemana === 'sábado' ||
        dia === 'domingo' && diaSemana === 'domingo'
      );
      
      return contemHoje;
    });

    console.log('✅ Programas filtrados:', programasHoje?.length || 0, 'programas para', diaSemana);
    if (programasHoje.length > 0) {
      console.log('📋 Exemplo de programa:', programasHoje[0].titulo, '- Dias:', programasHoje[0].dias_semana);
    }
    
    return programasHoje || [];
  } catch (error) {
    console.error('❌ Erro na função getProgramas:', error);
    return [];
  }
};

// Função para buscar programas por dia
export const getProgramasPorDia = async (dia) => {
  try {
    const { data, error } = await supabase
      .from('Programação')
      .select('*')
      .eq('dia', dia)
      .order('hora_inicio', { ascending: true });

    if (error) {
      console.error('Erro ao buscar programas do dia:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro na função getProgramasPorDia:', error);
    return [];
  }
};

// Função para buscar programa ao vivo
export const getProgramaAoVivo = async () => {
  try {
    const now = new Date();
    const horaAtual = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const diaAtual = now.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('Programação')
      .select('*')
      .eq('dia', diaAtual)
      .lte('hora_inicio', horaAtual)
      .gte('hora_fim', horaAtual)
      .single();

    if (error) {
      console.error('Erro ao buscar programa ao vivo:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro na função getProgramaAoVivo:', error);
    return null;
  }
};
