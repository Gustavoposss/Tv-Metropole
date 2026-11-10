import { createContext, useContext, useRef } from 'react';
import { cx } from './cx';

const ContextoAbas = createContext(null);

export function Tabs({
  label,
  value,
  onChange,
  className = '',
  children,
}) {
  const listaRef = useRef(null);

  function aoTeclar(evento) {
    const teclas = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!teclas.includes(evento.key) || !listaRef.current) return;

    const abas = [...listaRef.current.querySelectorAll('[role="tab"]')];
    const atual = abas.indexOf(document.activeElement);
    if (atual < 0) return;

    evento.preventDefault();
    let proxima = atual;
    if (evento.key === 'ArrowRight') proxima = (atual + 1) % abas.length;
    if (evento.key === 'ArrowLeft') proxima = (atual - 1 + abas.length) % abas.length;
    if (evento.key === 'Home') proxima = 0;
    if (evento.key === 'End') proxima = abas.length - 1;

    abas[proxima].focus();
    abas[proxima].click();
  }

  return (
    <ContextoAbas.Provider value={{ value, onChange }}>
      <div
        ref={listaRef}
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={aoTeclar}
        className={cx(
          'flex items-center gap-gutter-sm rounded-possi-md border border-outline bg-surface-container-high p-1.5',
          className,
        )}
      >
        {children}
      </div>
    </ContextoAbas.Provider>
  );
}

export function Tab({ value, rotulo, className = '', children }) {
  const contexto = useContext(ContextoAbas);
  if (!contexto) {
    throw new Error('Tab precisa ficar dentro de Tabs.');
  }

  const selecionada = contexto.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`aba-${value}`}
      aria-controls={`painel-${value}`}
      aria-label={rotulo}
      aria-selected={selecionada}
      tabIndex={selecionada ? 0 : -1}
      onClick={() => contexto.onChange(value)}
      className={cx(
        'rounded-possi px-4 py-2 font-label text-label-md transition duration-state-change ease-state-change',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
        selecionada
          ? 'bg-primary font-bold text-on-primary shadow-sm'
          : 'text-on-surface/75 hover:bg-surface-container',
        className,
      )}
    >
      {children}
    </button>
  );
}
