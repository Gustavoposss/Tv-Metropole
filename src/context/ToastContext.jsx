import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

const ESTILOS = {
  sucesso: { borda: 'border-green-500', icone: '✓', cor: 'text-green-600', fundo: 'bg-green-50' },
  erro: { borda: 'border-red-500', icone: '✕', cor: 'text-red-600', fundo: 'bg-red-50' },
  info: { borda: 'border-blue-500', icone: 'i', cor: 'text-blue-600', fundo: 'bg-blue-50' },
};

let idGlobal = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remover = useCallback((id) => {
    setToasts((atual) => atual.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (mensagem, tipo = 'info', duracao = 4000) => {
      const id = ++idGlobal;
      setToasts((atual) => [...atual, { id, mensagem, tipo }]);
      if (duracao > 0) setTimeout(() => remover(id), duracao);
      return id;
    },
    [remover]
  );

  const toast = {
    sucesso: (msg, d) => mostrar(msg, 'sucesso', d),
    erro: (msg, d) => mostrar(msg, 'erro', d),
    info: (msg, d) => mostrar(msg, 'info', d),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => {
            const estilo = ESTILOS[t.tipo] || ESTILOS.info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 rounded-xl border-l-4 ${estilo.borda} ${estilo.fundo} bg-white shadow-lg px-4 py-3`}
                role="alert"
              >
                <span
                  className={`flex-shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold ${estilo.cor} ${estilo.fundo}`}
                >
                  {estilo.icone}
                </span>
                <p className="flex-1 text-sm text-gray-700">{t.mensagem}</p>
                <button
                  onClick={() => remover(t.id)}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>');
  return ctx;
};
