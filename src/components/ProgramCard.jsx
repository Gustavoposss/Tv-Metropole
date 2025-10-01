import { motion } from 'framer-motion';

const ProgramCard = ({ programa, isLive = false }) => {
  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.slice(0, 5); // Remove segundos se houver
  };
  
  // Adaptar nomes das colunas do banco
  const programaAdaptado = {
    ...programa,
    nome: programa.titulo || programa.nome,
    hora_inicio: programa.horario_inicio || programa.hora_inicio,
    hora_fim: programa.horario_fim || programa.hora_fim,
    icone: programa.icone || '📺'
  };

  return (
    <motion.div
      className={`relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 ${
        isLive
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-200'
          : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {isLive && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold z-10"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="hidden sm:inline">AO VIVO</span>
          <span className="sm:hidden">🔴 LIVE</span>
        </motion.div>
      )}
      
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-3 sm:space-y-0">
        {/* Ícone/Imagem do programa */}
        <div className="flex items-center space-x-3 sm:block w-full sm:w-auto">
          {programa.imagem_url ? (
            <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden ${
              isLive ? 'ring-2 ring-green-500 shadow-lg' : 'ring-1 ring-gray-200'
            }`}>
              <img 
                src={programaAdaptado.imagem_url} 
                alt={programaAdaptado.nome}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback para ícone se a imagem falhar
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className={`hidden w-full h-full items-center justify-center text-xl sm:text-2xl ${
                  isLive 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                    : 'bg-gray-100'
                }`}
              >
                {programaAdaptado.icone}
              </div>
            </div>
          ) : (
            <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl ${
              isLive 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg' 
                : 'bg-gray-100'
            }`}>
              {programaAdaptado.icone}
            </div>
          )}
          
          {/* Horário - Mobile (ao lado do ícone) */}
          <div className={`sm:hidden text-xs font-medium ${
            isLive ? 'text-green-600' : 'text-gray-500'
          }`}>
            {formatTime(programaAdaptado.hora_inicio)} - {formatTime(programaAdaptado.hora_fim)}
          </div>
        </div>
        
        {/* Conteúdo do programa */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-start justify-between mb-2">
            <h3 className={`text-base sm:text-lg font-bold pr-2 ${
              isLive ? 'text-green-800' : 'text-gray-900'
            }`}>
              {programaAdaptado.nome}
            </h3>
            {/* Horário - Desktop */}
            <div className={`hidden sm:block text-sm font-medium whitespace-nowrap ${
              isLive ? 'text-green-600' : 'text-gray-500'
            }`}>
              {formatTime(programaAdaptado.hora_inicio)} - {formatTime(programaAdaptado.hora_fim)}
            </div>
          </div>
          
          <p className={`text-xs sm:text-sm ${
            isLive ? 'text-green-700' : 'text-gray-600'
          }`}>
            {programaAdaptado.descricao || 'Sem descrição'}
          </p>
        </div>
      </div>
      
      {isLive && (
        <motion.div
          className="mt-4 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
          animate={{
            background: [
              'linear-gradient(90deg, #4ade80, #10b981)',
              'linear-gradient(90deg, #10b981, #4ade80)',
              'linear-gradient(90deg, #4ade80, #10b981)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default ProgramCard;
