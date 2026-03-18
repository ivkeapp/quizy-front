import type { HTMLAttributes, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
