'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { toLocalDateString, getToday, getTomorrow } from '@/lib/utils';
import {
  Calendar, Check, X, Clock, Users, Star, Plus, Edit2, Trash2,
  ChevronLeft, ChevronRight, Sparkles, Sun, Shield, Braces, Scissors, Stethoscope, TrendingUp, DollarSign, RotateCcw
} from 'lucide-react';

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

interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  user: { id: number; name: string; email: string };
  treatment: Treatment;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'pending' }> = {
  PENDING: { label: 'Pendiente', variant: 'pending' },
  CONFIRMED: { label: 'Confirmada', variant: 'success' },
  CANCELLED: { label: 'Cancelada', variant: 'error' },
  COMPLETED: { label: 'Completada', variant: 'default' },
};

export default function DentistDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [myTreatments, setMyTreatments] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showMyTreatmentsModal, setShowMyTreatmentsModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'DENTIST')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'DENTIST') loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [appointmentsData, treatmentsData] = await Promise.all([
        api.appointments.list(),
        api.treatments.list(),
      ]);
      setAppointments(appointmentsData || []);
      setTreatments(treatmentsData || []);
      
      try {
        const myTreatmentsData = await api.users.getMyTreatments();
        setMyTreatments((myTreatmentsData || []).map((t: Treatment) => t.id));
      } catch (e) {
        setMyTreatments([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    try {
      await api.appointments.update(id, { status });
      showToast('success', status === 'CONFIRMED' ? 'Cita confirmada' : status === 'CANCELLED' ? 'Cita cancelada' : 'Estado actualizado');
      loadData();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Error al actualizar';
      showToast('error', errMsg);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = toLocalDateString(date);
    const filtered = appointments.filter(a => {
      const appointmentDate = a.date.split('T')[0];
      return appointmentDate === dateStr && (statusFilter === 'all' || a.status === statusFilter);
    });
    const statusOrder: Record<string, number> = { PENDING: 0, CONFIRMED: 1, COMPLETED: 2, CANCELLED: 3 };
    return filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  };

  const getAppointmentCountForDate = (date: Date) => {
    const dateStr = toLocalDateString(date);
    return appointments.filter(a => a.date.split('T')[0] === dateStr && ['PENDING', 'CONFIRMED'].includes(a.status)).length;
  };

  const getStats = () => {
    const today = getToday();
    const todayStr = toLocalDateString(today);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const activeAppointments = appointments.filter(a => ['PENDING', 'CONFIRMED', 'COMPLETED'].includes(a.status));

    return {
      today: activeAppointments.filter(a => a.date.split('T')[0] === todayStr).length,
      week: activeAppointments.filter(a => {
        const aptDate = a.date.split('T')[0];
        return aptDate >= toLocalDateString(weekStart) && aptDate <= toLocalDateString(weekEnd);
      }).length,
      month: activeAppointments.filter(a => {
        const aptDate = new Date(a.date);
        return aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
      }).length,
    };
  };

  const handleSaveMyTreatments = async () => {
    try {
      await api.users.setMyTreatments(myTreatments);
      setShowMyTreatmentsModal(false);
    } catch (error) {
      console.error('Error saving treatments:', error);
    }
  };

  const toggleMyTreatment = (id: number) => {
    setMyTreatments(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const goToToday = () => setSelectedDate(getToday());
  const goToPrevDay = () => setSelectedDate(new Date(selectedDate.getTime() - 86400000));
  const goToNextDay = () => setSelectedDate(new Date(selectedDate.getTime() + 86400000));

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full" /></div>;
  }

  if (!user || user.role !== 'DENTIST') return null;

  const stats = getStats();
  const dateAppointments = getAppointmentsForDate(selectedDate);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-white">
      <Navbar />

      <main className="flex-1 pt-20 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container-responsive max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary font-['Outfit']">
              Dashboard <span className="text-primary">Dr. {user.name.split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-sm md:text-base text-text-secondary mt-1">Gestiona tus citas y tratamientos</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { label: 'Citas Hoy', value: stats.today, icon: Clock, color: 'from-primary to-primary-dark' },
              { label: 'Esta Semana', value: stats.week, icon: Calendar, color: 'from-blue-500 to-blue-600' },
              { label: 'Este Mes', value: stats.month, icon: Users, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Mis Servicios', value: myTreatments.length, icon: Star, color: 'from-amber-500 to-amber-600' },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className={`bg-gradient-to-r ${stat.color} text-white border-0 shadow-lg p-4 md:p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-xs md:text-sm">{stat.label}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary font-['Outfit']">Citas</h2>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button onClick={goToPrevDay} className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={goToToday} className="px-3 py-1 text-xs sm:text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer">
                        Hoy
                      </button>
                      <span className="font-medium text-xs sm:text-sm min-w-[120px] sm:min-w-[160px] text-center capitalize">
                        {selectedDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <button onClick={goToNextDay} className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
                    {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
                      <button key={status} onClick={() => setStatusFilter(status)} className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${statusFilter === status ? 'bg-primary text-white' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
                        {status === 'all' ? 'Todas' : statusLabels[status]?.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-[350px] md:max-h-[400px] overflow-y-auto">
                    {dateAppointments.length === 0 ? (
                      <div className="text-center py-8 md:py-10 text-text-secondary">
                        <Calendar className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 md:mb-3 opacity-50" />
                        <p className="text-sm sm:text-base">No hay citas para este día</p>
                      </div>
                    ) : (
                      dateAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm sm:text-base text-text-primary truncate">{appointment.user.name}</p>
                              <p className="text-xs sm:text-sm text-text-secondary truncate">{appointment.treatment.name} • {appointment.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={statusLabels[appointment.status].variant} className="text-xs font-medium">{statusLabels[appointment.status].label}</Badge>
                            {appointment.status === 'PENDING' && (
                              <div className="flex gap-1.5">
                                <button onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')} className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer" title="Confirmar">
                                  <Check className="w-4 h-4" />
                                  <span>Confirmar</span>
                                </button>
                                <button onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')} className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-red-200 hover:border-red-400 text-red-500 hover:text-red-600 font-semibold text-sm hover:bg-red-50 hover:-translate-y-0.5 transition-all cursor-pointer" title="Cancelar">
                                  <X className="w-4 h-4" />
                                  <span>Cancelar</span>
                                </button>
                              </div>
                            )}
                            {appointment.status === 'CONFIRMED' && (
                              <div className="flex gap-1.5">
                                <button onClick={() => updateAppointmentStatus(appointment.id, 'COMPLETED')} className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer" title="Completar">
                                  <Check className="w-4 h-4" />
                                  <span>Completar</span>
                                </button>
                                <button onClick={() => updateAppointmentStatus(appointment.id, 'CANCELLED')} className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-red-200 hover:border-red-400 text-red-500 hover:text-red-600 font-semibold text-sm hover:bg-red-50 hover:-translate-y-0.5 transition-all cursor-pointer" title="Cancelar">
                                  <X className="w-4 h-4" />
                                  <span>Cancelar</span>
                                </button>
                              </div>
                            )}
                            {appointment.status === 'COMPLETED' && (
                              <button onClick={() => updateAppointmentStatus(appointment.id, 'CONFIRMED')} className="group relative flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-400 text-amber-600 hover:text-amber-700 font-semibold text-sm hover:bg-amber-50 hover:-translate-y-0.5 transition-all cursor-pointer" title="Revertir a confirmado">
                                <RotateCcw className="w-4 h-4" />
                                <span>Revertir</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-4 md:mt-6">
                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary font-['Outfit']">Calendario</h2>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-sm">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                      <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                      <div key={d} className="text-xs font-medium text-text-muted py-2">{d}</div>
                    ))}
                    {days.map((day, idx) => {
                      if (!day) return <div key={idx} />;
                      const isSelected = toLocalDateString(day) === toLocalDateString(selectedDate);
                      const isToday = toLocalDateString(day) === toLocalDateString(getToday());
                      const aptCount = getAppointmentCountForDate(day);
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedDate(day)}
                          className={`p-2 rounded-lg text-sm transition-colors relative ${isSelected ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}
                        >
                          {day.getDate()}
                          {aptCount > 0 && (
                            <span className={`absolute top-0 right-0 w-4 h-4 text-xs rounded-full flex items-center justify-center ${isSelected ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                              {aptCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </div>

            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-4 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary font-['Outfit']">Mis Tratamientos</h2>
                      <p className="text-xs text-text-secondary mt-1">{myTreatments.length} tratamientos seleccionados</p>
                    </div>
                    <Button size="sm" onClick={() => setShowMyTreatmentsModal(true)} className="shadow-md">
                      <Edit2 className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[300px] md:max-h-[350px] overflow-y-auto">
                    {treatments.filter(t => myTreatments.includes(t.id)).map((treatment) => {
                      const Icon = iconMap[treatment.icon] || Star;
                      return (
                        <div key={treatment.id} className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-text-primary text-xs sm:text-sm truncate">{treatment.name}</p>
                              <p className="text-xs text-text-secondary">${treatment.price} • {treatment.duration}min</p>
                            </div>
                          </div>
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        </div>
                      );
                    })}
                    {myTreatments.length === 0 && (
                      <div className="text-center py-6 text-text-secondary">
                        <p className="text-sm">No has configurado tus tratamientos</p>
                        <Button size="sm" variant="ghost" onClick={() => setShowMyTreatmentsModal(true)} className="mt-2">
                          Seleccionar tratamientos
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showMyTreatmentsModal} onClose={() => setShowMyTreatmentsModal(false)} title="Mis Tratamientos">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Selecciona los tratamientos que realizas en tu consultorio:</p>
          <div className="grid gap-2 max-h-[50vh] overflow-y-auto pr-2">
            {treatments.map((treatment) => {
              const Icon = iconMap[treatment.icon] || Star;
              const isSelected = myTreatments.includes(treatment.id);
              return (
                <button
                  key={treatment.id}
                  type="button"
                  onClick={() => toggleMyTreatment(treatment.id)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${isSelected ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-slate-100'}`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base text-text-primary">{treatment.name}</p>
                    <p className="text-xs sm:text-sm text-text-secondary">${treatment.price} • {treatment.duration}min</p>
                  </div>
                </button>
              );
            })}
          </div>
          <Button className="w-full" onClick={handleSaveMyTreatments}>
            Guardar Tratamientos
          </Button>
        </div>
      </Modal>
    </div>
  );
}
