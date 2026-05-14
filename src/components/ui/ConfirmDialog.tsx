'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'
              }`}>
                <AlertTriangle className={`w-6 h-6 ${
                  variant === 'danger' ? 'text-red-500' : 'text-amber-500'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
              </div>
            </div>
            <p className="text-text-secondary mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors cursor-pointer ${
                  variant === 'danger' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}