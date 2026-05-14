'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { formatPrice, formatDuration } from '@/lib/utils';
import { Sparkles, Sun, Shield, Braces, Scissors, Stethoscope, Star, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Sun, Shield, Braces, Scissors, Stethoscope, Star, Clock, TrendingUp,
};

interface Treatment {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: string;
}

interface TreatmentsProps {
  treatments: Treatment[];
}

const TREATMENTS_PER_PAGE = 6;

export function Treatments({ treatments }: TreatmentsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(treatments.length / TREATMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * TREATMENTS_PER_PAGE;
  const paginatedTreatments = treatments.slice(startIndex, startIndex + TREATMENTS_PER_PAGE);

  return (
    <section id="tratamientos" className="py-28 md:py-40 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Servicios Dentales
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-primary font-['Outfit'] tracking-tight mb-5">
            Cuidamos tu<span className="text-gradient"> sonrisa</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
            Tratamientos modernos y personalizados para cada miembro de tu familia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {paginatedTreatments.map((treatment, index) => {
            const Icon = iconMap[treatment.icon] || Sparkles;
            return (
              <motion.div
                key={treatment.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
              >
                <Card className="h-full group hover:border-primary/30 relative overflow-hidden" padding="md">
                  <div className="absolute top-0 right-0 size-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10" />
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-primary-dark group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <Badge variant="success" size="sm">{formatDuration(treatment.duration)}</Badge>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-text-primary mb-2 font-['Outfit']">
                    {treatment.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-5 line-clamp-2 leading-relaxed">
                    {treatment.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-xl md:text-2xl font-bold text-primary font-['Outfit']">{formatPrice(treatment.price)}</p>
                      <p className="text-xs text-text-muted">por sesión</p>
                    </div>
                    <Link href="/login" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                      Reservar <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </section>
  );
}