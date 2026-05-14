'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from './Button';
import { Menu, X, Heart, LogOut, User, Calendar, Crown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'SUPERADMIN': return '/admin';
      case 'DENTIST': return '/dentist';
      default: return '/user';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'SUPERADMIN': return 'Admin';
      case 'DENTIST': return 'Dr. ' + user.name.split(' ').slice(-1)[0];
      default: return user?.name.split(' ')[0] || 'Usuario';
    }
  };

  const getLogoLink = () => {
    if (user) return getDashboardLink();
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          <Link href={getLogoLink()} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-text-primary font-['Outfit'] tracking-tight">
              DentalCare
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/#tratamientos" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer">
              Tratamientos
            </Link>
            <Link href="/#como-funciona" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer">
              Cómo Funciona
            </Link>
            <Link href="/#nosotros" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer">
              Nosotros
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {user.role === 'SUPERADMIN' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                        <Crown className="w-3 h-3" />
                        ADMIN
                      </span>
                    )}
                    <Link href={getDashboardLink()}>
                      <Button variant="ghost" size="sm">
                        <User className="w-4 h-4 mr-1.5" />
                        {getRoleLabel()}
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2">
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">Iniciar Sesión</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="shadow-lg shadow-primary/20">Registrarse</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 -mr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              <Link href="/#tratamientos" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-slate-50 hover:text-primary cursor-pointer">
                Tratamientos
              </Link>
              <Link href="/#como-funciona" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-slate-50 hover:text-primary cursor-pointer">
                Cómo Funciona
              </Link>
              <Link href="/#nosotros" onClick={() => setMobileOpen(false)} className="block py-2.5 px-3 text-sm font-medium text-text-secondary rounded-lg hover:bg-slate-50 hover:text-primary cursor-pointer">
                Nosotros
              </Link>
              <div className="pt-3 mt-3 border-t border-slate-100 space-y-1.5">
                {!user ? (
                  <div className="space-y-2 pt-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="ghost" className="w-full justify-center">Iniciar Sesión</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="block">
                      <Button className="w-full justify-center shadow-lg shadow-primary/20">Registrarse</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1.5 pt-2">
                    {user.role === 'SUPERADMIN' && (
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/10">
                        <Crown className="w-4 h-4 text-accent" />
                        <span className="text-sm font-semibold text-accent">Super Administrador</span>
                      </div>
                    )}
                    <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block">
                      <Button variant="secondary" className="w-full justify-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {user.role === 'SUPERADMIN' ? 'Panel Admin' : user.role === 'DENTIST' ? 'Dashboard' : 'Mis Turnos'}
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-center text-error" onClick={() => { setMobileOpen(false); handleLogout(); }}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
