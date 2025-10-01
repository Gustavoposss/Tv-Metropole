import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgramCard from '../components/ProgramCard';
import { getProgramas } from '../lib/supabase';

const Programacao = () => {
  const [programas, setProgramas] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Buscar programas do banco de dados
    const fetchProgramas = async () => {
      try {
        setLoading(true);
        const data = await getProgramas();
        setProgramas(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar programas:', err);
        setError('Erro ao carregar a programação. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgramas();
    
    // Atualizar horário a cada minuto
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isProgramaLive = (programa) => {
    const now = currentTime;
    const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Usar os nomes corretos das colunas do banco
    const startTime = programa.horario_inicio ? programa.horario_inicio.slice(0, 5) : programa.hora_inicio;
    const endTime = programa.horario_fim ? programa.horario_fim.slice(0, 5) : programa.hora_fim;
    
    if (!startTime || !endTime) return false;
    
    // Se o programa termina no dia seguinte (00:00)
    if (endTime === '00:00') {
      return currentTimeStr >= startTime || currentTimeStr < '06:00';
    }
    
    return currentTimeStr >= startTime && currentTimeStr < endTime;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Cabeçalho da página */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-3 sm:mb-4 px-2">
            Programação da TV Metrópole
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-green-700 mb-4 sm:mb-6 px-4">
            Confira os horários dos seus programas favoritos.
          </p>
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl mx-auto border border-green-200">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800 mb-2">
              {formatDate(currentTime)}
            </h2>
            <p className="text-sm sm:text-base text-green-700">
              Horário atual: {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </motion.div>

        {/* Lista de Programas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 sm:space-y-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-green-700 text-base sm:text-lg">Carregando programação...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center mx-2 sm:mx-0">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚠️</div>
              <p className="text-red-700 text-base sm:text-lg mb-2">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-2 rounded-lg transition-colors mt-3 sm:mt-4 text-sm sm:text-base"
              >
                Recarregar
              </button>
            </div>
          ) : programas.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center mx-2 sm:mx-0">
              <div className="text-3xl sm:text-4xl mb-3">📺</div>
              <p className="text-yellow-700 text-base sm:text-lg">Nenhum programa encontrado para hoje.</p>
            </div>
          ) : (
            programas.map((programa, index) => (
              <motion.div
                key={programa.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProgramCard 
                  programa={programa} 
                  isLive={isProgramaLive(programa)}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Informações adicionais */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 sm:mt-12 bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Sobre a Programação
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
              Nossa programação é atualizada diariamente para trazer o melhor conteúdo 
              para você. Todos os programas são transmitidos ao vivo com qualidade adaptativa, 
              garantindo uma experiência única de entretenimento e informação.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Programacao;
