'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'relative overflow-hidden group',

        variant === 'primary' && [
          'bg-gradient-to-r from-primary to-primary-dark text-white',
          'hover:from-primary-dark hover:to-primary-dark',
          'focus-visible:ring-primary',
          'shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5',
          'border-2 border-transparent hover:border-white/20',
          'before:absolute before:inset-0 before:bg-white/0 before:group-hover:bg-white/10 before:transition-colors',
        ],
        variant === 'secondary' && [
          'bg-secondary text-white',
          'hover:bg-slate-800',
          'focus-visible:ring-secondary',
          'shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5',
          'border-2 border-transparent hover:border-white/20',
        ],
        variant === 'ghost' && [
          'bg-transparent text-text-primary border-2 border-slate-200 hover:border-primary',
          'hover:bg-slate-50 hover:text-text-primary',
          'focus-visible:ring-slate-400',
        ],
        variant === 'danger' && [
          'bg-error text-white',
          'hover:bg-red-600',
          'focus-visible:ring-error',
          'shadow-lg shadow-error/25 hover:shadow-error/40 hover:-translate-y-0.5',
          'border-2 border-transparent hover:border-white/20',
        ],

        size === 'sm' && 'px-5 py-2.5 text-sm gap-1.5',
        size === 'md' && 'px-6 py-3 text-base gap-2',
        size === 'lg' && 'px-8 py-4 text-lg gap-2.5',

        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
