import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'glass' | 'bordered' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-surface shadow-card',
  glass: 'glass',
  bordered: 'bg-surface border border-border',
  elevated: 'bg-surface shadow-card',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        'rounded-card',
        variantClasses[variant],
        paddingClasses[padding],
        hover
          ? 'transition-all duration-300 ease-out hover:shadow-dropdown hover:-translate-y-1'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps, CardVariant, CardPadding };
