'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] }}
            className={cn(
              'relative bg-white rounded-3xl shadow-2xl w-full',
              'max-h-[90vh] overflow-y-auto',
              'border border-slate-100',
              size === 'sm' && 'max-w-sm',
              size === 'md' && 'max-w-lg',
              size === 'lg' && 'max-w-2xl'
            )}
          >
            <div className="p-6 sm:p-8">
              {title && (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-text-primary font-['Outfit'] tracking-tight">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 text-text-secondary hover:text-text-primary cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
