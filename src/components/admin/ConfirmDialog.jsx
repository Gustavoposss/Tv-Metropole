import { useState } from 'react';
import Modal from './Modal';

const ConfirmDialog = ({
  aberto,
  onClose,
  onConfirmar,
  titulo = 'Confirmar ação',
  mensagem = 'Tem certeza que deseja continuar?',
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  perigo = true,
}) => {
  const [processando, setProcessando] = useState(false);

  const confirmar = async () => {
    setProcessando(true);
    try {
      await onConfirmar?.();
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Modal
      aberto={aberto}
      onClose={processando ? undefined : onClose}
      tamanho="sm"
      rodape={
        <>
          <button
            onClick={onClose}
            disabled={processando}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            {textoCancelar}
          </button>
          <button
            onClick={confirmar}
            disabled={processando}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
              perigo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {processando ? 'Processando...' : textoConfirmar}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${
            perigo ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>
        <div className="pt-0.5">
          <h3 className="text-base font-semibold text-slate-800">{titulo}</h3>
          <p className="mt-1 text-sm text-slate-500">{mensagem}</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
