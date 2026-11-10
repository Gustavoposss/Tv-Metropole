import { cx } from './cx';

export function LiveBadge({
  children = 'Ao Vivo',
  pulse = true,
  compact = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full bg-live font-label text-label-sm uppercase text-on-live shadow-md',
        compact ? 'px-1.5 py-0.5' : 'px-3 py-1',
        className,
      )}
      {...props}
    >
      {pulse ? (
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
      ) : null}
      {children}
    </span>
  );
}
