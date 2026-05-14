'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'pending' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50/80 text-amber-700 border border-amber-200/60',
    error: 'bg-red-50/80 text-red-700 border border-red-200/60',
    pending: 'bg-cyan-50/80 text-cyan-700 border border-cyan-200/60',
    info: 'bg-blue-50/80 text-blue-700 border border-blue-200/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full',
        size === 'sm' && 'px-2 py-0.5 text-[11px] tracking-wide',
        size === 'md' && 'px-2.5 py-1 text-xs',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
