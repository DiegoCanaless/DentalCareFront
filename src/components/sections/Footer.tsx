'use client';

import Link from 'next/link';
import { Heart, Phone, Mail, MapPin, Clock, Camera, Flag, Bird } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-secondary via-secondary to-slate-900 text-white py-20 md:py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-['Outfit']">DentalCare</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tu clínica dental de confianza. Cuidamos tu sonrisa con profesionalismo y cariño.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Camera, label: 'Instagram', url: 'https://instagram.com' },
                { icon: Flag, label: 'Facebook', url: 'https://facebook.com' },
                { icon: Bird, label: 'Twitter', url: 'https://twitter.com' },
              ].map(({ icon: Icon, label, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base md:text-lg mb-4 font-['Outfit']">Tratamientos</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {['Limpieza Dental', 'Blanqueamiento', 'Ortodoncia', 'Revisión General'].map((item, i) => (
                <li key={i}>
                  <a href="#tratamientos" className="hover:text-white transition-colors inline-block py-1">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base md:text-lg mb-4 font-['Outfit']">Contacto</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                { icon: Phone, text: '+54 11 5555-1234' },
                { icon: Mail, text: 'info@dentalcare.com' },
                { icon: MapPin, text: 'Av. Libertador 5000, Buenos Aires' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base md:text-lg mb-4 font-['Outfit']">Horario</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {[
                'Lun - Vie: 9:00 - 18:00',
                'Sáb: 9:00 - 14:00',
                'Dom: Cerrado',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-slate-400">
            © 2024 DentalCare. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs md:text-sm text-slate-400">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/#contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
