'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Home, ArrowLeft, User, LogOut } from 'lucide-react';

export default function NotFound() {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SUPERADMIN': return '/admin';
      case 'DENTIST': return '/dentist';
      default: return '/user';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative inline-block"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary font-['Outfit']">404</span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-error flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-sm font-bold">?</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-text-primary font-['Outfit']">
            Página no encontrada
          </h1>
          <p className="text-text-secondary max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {user ? (
            <>
              <Link href={getDashboardLink()}>
                <Button className="gap-2">
                  <User className="w-4 h-4" />
                  Mi Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" className="gap-2">
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/">
                <Button className="gap-2">
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Iniciar sesión
                </Button>
              </Link>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-6 border-t border-slate-200"
        >
          <p className="text-sm text-text-muted">
            ¿Buscas algo específico? Prueba nuestros tratamientos:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {['Limpieza Dental', 'Blanqueamiento', 'Ortodoncia', 'Implantes'].map((term, i) => (
              <motion.span
                key={term}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="px-3 py-1 rounded-full bg-slate-100 text-text-secondary text-sm"
              >
                {term}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}