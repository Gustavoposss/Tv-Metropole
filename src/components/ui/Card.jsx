import { createElement } from 'react';
import { cx } from './cx';

const VARIANTES = {
  elevated: 'border border-outline bg-surface-container shadow-sm',
  outline: 'border border-outline bg-surface-container',
  interactive:
    'border border-outline bg-surface-container shadow-sm transition duration-state-change ease-state-change hover:border-primary hover:shadow-lg',
};

export function Card({
  as = 'div',
  variant = 'elevated',
  className = '',
  children,
  ...props
}) {
  return createElement(
    as,
    {
      className: cx('overflow-hidden rounded-possi-xl', VARIANTES[variant], className),
      ...props,
    },
    children,
  );
}

export function CardBody({ className = '', children, ...props }) {
  return (
    <div className={cx('flex flex-col p-5', className)} {...props}>
      {children}
    </div>
  );
}
