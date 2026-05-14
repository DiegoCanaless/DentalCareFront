'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Award, Users, Heart } from 'lucide-react';

export function About() {
  return (
    <section id="nosotros" className="py-28 md:py-40 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-32 md:w-40 lg:w-48 text-white/20" strokeWidth={1} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -bottom-5 -right-5 md:-bottom-6 md:-right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-primary/10 border border-white/50 p-5 md:p-6 animate-float"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-text-primary font-['Outfit']">15+</p>
                  <p className="text-sm text-text-secondary">Años de experiencia</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-7 order-1 lg:order-2"
          >
            <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest">Sobre Nosotros</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-primary font-['Outfit'] tracking-tight leading-tight">
              Cuidamos tu sonrisa desde 2009
            </h2>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              En DentalCare nos dedicamos a proporcionar atención dental de alta calidad 
              en un ambiente cálido y profesional. Nuestro equipo de dentistas altamente 
              capacitados utiliza la última tecnología para garantizar los mejores resultados.
            </p>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed">
              Creemos que cada sonrisa es única, por eso personalizamos cada tratamiento 
              para satisfacer las necesidades específicas de cada paciente.
            </p>
            
            <div className="grid grid-cols-2 gap-5 md:gap-6 pt-6">
              <Card className="text-center" padding="sm">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <p className="font-semibold text-text-primary">+500 Pacientes</p>
                <p className="text-sm text-text-secondary">Activos</p>
              </Card>
              <Card className="text-center" padding="sm">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-error/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 md:w-7 md:h-7 text-error" />
                </div>
                <p className="font-semibold text-text-primary">+1000</p>
                <p className="text-sm text-text-secondary">Tratamientos</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
