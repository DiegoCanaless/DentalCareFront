'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, hover = true, onClick, padding = 'md' }: CardProps) {
  const cardContent = (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-100 shadow-sm',
        'transition-all duration-300 relative',
        'before:absolute before:inset-0 before:rounded-2xl before:border before:border-slate-200/50 before:opacity-0 before:transition-opacity',
        'hover:before:opacity-100',
        hover && 'hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-primary/10',
        padding === 'sm' && 'p-5',
        padding === 'md' && 'p-6 sm:p-7',
        padding === 'lg' && 'p-7 sm:p-9',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={cn(
          'w-full text-left cursor-pointer active:scale-[0.99] transition-transform duration-200'
        )}
        onClick={onClick}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
}
