'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Calendar, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[calc(100vh-var(--navbar-height))] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-accent/3" />
      
      <div className="absolute top-20 right-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-[5%] w-48 h-48 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 md:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 30 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full w-2 h-2 bg-primary"></span>
              </span>
              Citas disponibles esta semana
            </motion.div>
            
            <h1 className="text-5xl sm:text-5.5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.1] font-['Outfit'] tracking-tight">
              Tu sonrisa,&nbsp;
              <span className="text-gradient">más brillante</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-text-secondary max-w-lg leading-relaxed">
              Atención dental de primera calidad en un ambiente cálido y moderno. 
              Tecnología de vanguardia para tu comodidad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/login" className="cursor-pointer">
                <Button size="lg" className="shadow-xl shadow-primary/20 group">
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Reservar Cita
                </Button>
              </Link>
              <Link href="/#tratamientos" className="cursor-pointer">
                <Button variant="secondary" size="lg">
                  Ver Tratamientos
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 md:gap-10 pt-6 border-t border-slate-200/60">
              {[
                { value: '500+', label: 'Pacientes', icon: '✨' },
                { value: '15+', label: 'Años', icon: '🏆' },
                { value: '98%', label: 'Satisfacción', icon: '💯' },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="text-lg">{stat.icon}</span>
                    <p className="text-3xl md:text-4xl font-bold text-text-primary font-['Outfit']">{stat.value}</p>
                  </div>
                  <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary-dark rounded-[3rem] shadow-2xl shadow-primary/15" />
              <div className="absolute inset-3 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Heart className="w-32 lg:w-40 text-white/30" strokeWidth={1} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-full blur-xl" />
                </div>
              </div>
              
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-primary/10 border border-white/50 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-success/10 flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Próxima cita</p>
                    <p className="text-sm text-text-secondary">Mañana 10:00 AM</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                transition={{ delay: prefersReducedMotion ? 0 : 0.7 }}
                className="absolute top-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-primary/10 border border-white/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary text-sm">Blanqueamiento</p>
                    <p className="text-xs text-text-secondary">30% OFF</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}