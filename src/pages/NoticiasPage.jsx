import { motion } from 'framer-motion';
import Noticias from '../components/Noticias';

const NoticiasPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Seção de Notícias */}
      <section className="py-6 sm:py-8 md:py-12 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Noticias />
        </motion.div>
      </section>
    </div>
  );
};

export default NoticiasPage;
