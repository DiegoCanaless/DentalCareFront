'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { CalendarCheck, Clock, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: CalendarCheck,
    title: 'Elige tu Tratamiento',
    description: 'Selecciona el tratamiento que necesitas de nuestra lista de servicios disponibles.',
  },
  {
    icon: Clock,
    title: 'Agenda tu Cita',
    description: 'Escoge la fecha y hora que mejor te convenga de nuestros horarios disponibles.',
  },
  {
    icon: Sparkles,
    title: 'Disfruta tu Sonrisa',
    description: 'Llega a tu cita y deja que nuestro equipo de profesionales cuide de ti.',
  },
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <section id="como-funciona" className="py-28 md:py-40 bg-gradient-to-b from-background to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-4">Proceso Simple</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-primary font-['Outfit'] tracking-tight mb-5">
            ¿Cómo Funciona?
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Reservar tu cita dental nunca fue tan fácil. Solo tres pasos.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-24 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: prefersReducedMotion ? 0 : index * 0.1 }}
              >
                <Card className="text-center relative z-10 h-full" padding="lg">
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30">
                    <span className="text-white text-xl md:text-2xl font-bold">{index + 1}</span>
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-2 font-['Outfit']">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
