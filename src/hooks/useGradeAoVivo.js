import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { montarVisao } from '../lib/gradeAoVivo';

async function buscarGrade() {
  const { data, error } = await supabase
    .from('Programação')
    .select('id, titulo, descricao, horario_inicio, horario_fim, dias_semana, tipo, ativo, imagem_url')
    .order('horario_inicio', { ascending: true });

  if (error) throw error;
  return data || [];
}

export function useGradeAoVivo() {
  const [programas, setProgramas] = useState([]);
  const [status, setStatus] = useState('carregando');
  const [agora, setAgora] = useState(() => new Date());

  const carregar = useCallback(async () => {
    setStatus('carregando');
    try {
      setProgramas(await buscarGrade());
      setStatus('pronto');
    } catch (erro) {
      console.error('Erro ao consultar a grade:', erro);
      setProgramas([]);
      setStatus('erro');
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    buscarGrade()
      .then((dados) => {
        if (!ativo) return;
        setProgramas(dados);
        setStatus('pronto');
      })
      .catch((erro) => {
        console.error('Erro ao consultar a grade:', erro);
        if (!ativo) return;
        setProgramas([]);
        setStatus('erro');
      });

    const relogio = setInterval(() => setAgora(new Date()), 30000);
    return () => {
      ativo = false;
      clearInterval(relogio);
    };
  }, []);

  const visao = useMemo(() => montarVisao(programas, agora), [programas, agora]);

  return { status, recarregar: carregar, programas, instante: agora, ...visao };
}
