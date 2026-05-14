'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function Input({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2.5">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && iconPosition === 'left' && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors pointer-events-none" />
        )}
        <input
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white text-text-primary',
            'px-4 py-3 text-sm',
            'placeholder:text-text-muted',
            'transition-all duration-200',
            'focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
            Icon && iconPosition === 'left' && 'pl-11',
            Icon && iconPosition === 'right' && 'pr-11',
            error && 'border-error focus:border-error focus:ring-error/10',
            className
          )}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <Icon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
        )}
      </div>
      {error && <p className="mt-2 text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
