import { Link } from 'react-router-dom';
import { cx } from './cx';

const VARIANTES = {
  primary: 'bg-primary text-on-primary shadow-sm hover:bg-primary/90',
  secondary: 'bg-secondary text-on-secondary shadow-sm hover:bg-secondary/90',
  accent: 'bg-accent text-on-accent shadow-sm hover:bg-accent/90',
  live: 'bg-live text-on-live shadow-sm hover:bg-live/90',
  outline: 'border border-outline bg-surface-container text-primary hover:border-primary',
  ghost: 'bg-transparent text-on-surface/80 hover:bg-surface-container-high hover:text-primary',
};

const TAMANHOS = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
  icon: 'h-10 w-10 p-0',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'start',
  className = '',
  children,
  href,
  to,
  type = 'button',
  ...props
}) {
  const classes = cx(
    'inline-flex items-center justify-center gap-gutter-sm rounded-possi font-label text-label-md',
    'transition duration-state-change ease-state-change',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    TAMANHOS[size],
    VARIANTES[variant],
    className,
  );

  const conteudo = (
    <>
      {icon && iconPosition !== 'end' ? (
        <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      {children ? <span>{children}</span> : null}
      {icon && iconPosition === 'end' ? (
        <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {conteudo}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {conteudo}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {conteudo}
    </button>
  );
}
