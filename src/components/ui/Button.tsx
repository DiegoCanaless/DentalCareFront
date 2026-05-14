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
          'shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5',
          'before:absolute before:inset-0 before:bg-white/0 before:group-hover:bg-white/10 before:transition-colors',
        ],
        variant === 'secondary' && [
          'bg-secondary text-white',
          'hover:bg-slate-800',
          'focus-visible:ring-secondary',
          'shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:-translate-y-0.5',
        ],
        variant === 'ghost' && [
          'bg-transparent text-text-primary',
          'hover:bg-slate-100 hover:text-text-primary',
          'focus-visible:ring-slate-400',
        ],
        variant === 'danger' && [
          'bg-error text-white',
          'hover:bg-red-600',
          'focus-visible:ring-error',
          'shadow-lg shadow-error/20 hover:shadow-error/30 hover:-translate-y-0.5',
        ],

        size === 'sm' && 'px-4 py-2 text-sm gap-1.5',
        size === 'md' && 'px-5 py-2.5 text-sm gap-2',
        size === 'lg' && 'px-7 py-3.5 text-base gap-2.5',

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
