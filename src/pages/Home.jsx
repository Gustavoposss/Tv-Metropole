import { motion } from 'framer-motion';
import LivePlayer from '../components/LivePlayer';

const Home = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Seção do Player */}
      <section className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-3 sm:mb-4 px-2">
              Assista à TV Metrópole
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-green-700 max-w-2xl mx-auto px-4">
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
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4 sm:px-0"
          >
            <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:scale-105 transform">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🕒</div>
              <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">24h no ar</h3>
              <p className="text-sm sm:text-base text-green-700">Transmissão contínua</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:scale-105 transform">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📡</div>
              <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">Adaptativo</h3>
              <p className="text-sm sm:text-base text-green-700">HD, SD e mais</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-200 hover:scale-105 transform sm:col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📱</div>
              <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">Multiplataforma</h3>
              <p className="text-sm sm:text-base text-green-700">PC, Mobile e TV</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
