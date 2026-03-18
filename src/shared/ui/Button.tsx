import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>;

const variantClassMap: Record<ButtonVariant, string> = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-500',
};

export function Button({
  children,
  className = '',
  fullWidth = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClassMap[variant]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
