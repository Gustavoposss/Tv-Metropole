import { cx } from './cx';

const VARIANTES = {
  live: 'bg-live text-on-live',
  secondary: 'bg-secondary text-on-secondary',
  accent: 'bg-accent text-on-accent',
  primary: 'bg-primary text-on-primary',
  'secondary-soft': 'bg-secondary/15 text-secondary',
  'primary-soft': 'bg-primary/10 text-primary',
  overlay: 'border border-white/20 bg-black/75 text-white',
};

export function Badge({
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-gutter-xs rounded-possi-sm px-2.5 py-0.5 font-label text-label-sm uppercase',
        VARIANTES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
