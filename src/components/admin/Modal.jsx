import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TAMANHOS = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

const Modal = ({ aberto, onClose, titulo, descricao, children, rodape, tamanho = 'md' }) => {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [aberto, onClose]);

  return (
    <AnimatePresence>
      {aberto && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${TAMANHOS[tamanho]} max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl`}
          >
            {(titulo || descricao) && (
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
                <div>
                  {titulo && <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>}
                  {descricao && <p className="mt-0.5 text-sm text-slate-500">{descricao}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Fechar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {rodape && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                {rodape}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
