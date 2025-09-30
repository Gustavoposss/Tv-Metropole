import { motion } from 'framer-motion';
import LivePlayer from '../components/LivePlayer';

const Home = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Seção do Player */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Assista à TV Metrópole
            </h1>
            <p className="text-lg text-green-700 max-w-2xl mx-auto">
              Acompanhe nossa programação ao vivo diretamente do seu dispositivo. 
              Qualidade HD disponível 24 horas por dia.
            </p>
          </motion.div>

          {/* Player de Vídeo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <LivePlayer />
          </motion.div>

          {/* Características do Serviço */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">24h no ar</h3>
              <p className="text-green-700">Transmissão contínua</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200">
              <div className="text-4xl mb-4">📡</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Sinal em HD</h3>
              <p className="text-green-700">Transmissão</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200">
              <div className="text-4xl mb-4">⭐⭐⭐⭐</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Qualidade</h3>
              <p className="text-green-700">Excelente</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
