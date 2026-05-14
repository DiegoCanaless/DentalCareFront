'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { AlertTriangle, RefreshCw, Home, User } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user } = useAuth();

  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SUPERADMIN': return '/admin';
      case 'DENTIST': return '/dentist';
      default: return '/user';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-error/10 to-error/5 flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-error" />
          </div>
          <motion.div
            initial={{ rotate: -10, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-error flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-text-primary font-['Outfit']">
            Algo salió mal
          </h1>
          <p className="text-text-secondary">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo en unos momentos.
          </p>
          {error.digest && (
            <p className="text-xs text-text-muted">
              ID del error: {error.digest}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </Button>
          {user ? (
            <Link href={getDashboardLink()}>
              <Button variant="secondary" className="gap-2">
                <User className="w-4 h-4" />
                Mi Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="secondary" className="gap-2">
                <Home className="w-4 h-4" />
                Ir al inicio
              </Button>
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="p-4 rounded-xl bg-white/60 border border-slate-200"
        >
          <p className="text-sm text-text-muted">
            Si el problema persiste, contacta al administrador del sistema.
          </p>
          <p className="text-xs text-text-muted mt-1">
            info@dentalcare.com
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}