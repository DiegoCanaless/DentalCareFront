'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/ui/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Pagination } from '@/components/ui/Pagination';
import { api } from '@/lib/api';
import { formatPrice, formatDuration, toLocalDateString, getTomorrow, getToday } from '@/lib/utils';
import { useSocket } from '@/lib/useSocket';
import { Calendar, Clock, Sparkles, User, ChevronLeft, ChevronRight, CheckCircle, X, AlertCircle } from 'lucide-react';

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
  treatment: Treatment;
  dentist?: { name: string };
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  useSocket({
    onAppointmentCreated: (newAppointment) => {
      setAppointments(prev => [...prev, newAppointment as Appointment]);
    },
    onAppointmentUpdated: ({ id, date, time, status }) => {
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, date, time, status } : a
      ));
    },
    onAppointmentCancelled: ({ id }) => {
      setAppointments(prev => prev.map(a => 
        a.id === id ? { ...a, status: 'CANCELLED' } : a
      ));
    },
  });

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDentist, setSelectedDentist] = useState<{ id: number; name: string } | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const APPOINTMENTS_PER_PAGE = 5;
  const [cancelConfirm, setCancelConfirm] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDentists, setAvailableDentists] = useState<Record<number, { dentist: { id: number; name: string }; slots: string[] }>>({});
  const [error, setError] = useState('');

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      if (user.role === 'SUPERADMIN') {
        router.push('/admin');
        return;
      }
      if (user.role === 'DENTIST') {
        router.push('/dentist');
        return;
      }
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [appointmentsData, treatmentsData] = await Promise.all([
        api.appointments.list(),
        api.treatments.list(),
      ]);
      setAppointments(appointmentsData);
      setTreatments(treatmentsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailability = async (treatmentId: number, date: string) => {
    try {
      const result = await api.appointments.availability(treatmentId, date);
      const typedResult = result as Record<number, { dentist: { id: number; name: string }; slots: string[] }>;
      setAvailableDentists(typedResult);
      const firstDentist = Object.values(typedResult)[0];
      if (firstDentist) {
        setSelectedDentist(firstDentist.dentist);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setAvailableDentists({});
    }
  };

  const handleSelectTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setBookingStep(2);
    setSelectedTime('');
    setSelectedDentist(null);
    const tomorrow = getTomorrow();
    setSelectedDate(toLocalDateString(tomorrow));
    loadAvailability(treatment.id, toLocalDateString(tomorrow));
    setError('');
    setShowBooking(true);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    if (selectedTreatment) {
      loadAvailability(selectedTreatment.id, date);
    }
  };

  const handleDentistChange = (dentistId: number) => {
    const dentist = availableDentists[dentistId];
    if (dentist) {
      setSelectedDentist(dentist.dentist);
      setSelectedTime('');
    }
  };

  const handleBook = async () => {
    if (!selectedTreatment || !selectedDate || !selectedTime) return;
    setBookingLoading(true);
    setError('');
    try {
      await api.appointments.create({
        date: selectedDate,
        time: selectedTime,
        treatmentId: selectedTreatment.id,
        dentistId: selectedDentist?.id,
      });
      setBookingSuccess(true);
      loadData();
      setTimeout(() => {
        setShowBooking(false);
        setBookingSuccess(false);
        setBookingStep(1);
        setSelectedTreatment(null);
        setSelectedDate('');
        setSelectedTime('');
        setSelectedDentist(null);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al reservar');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelConfirm.id) return;
    try {
      await api.appointments.delete(cancelConfirm.id);
      loadData();
      showToast('success', 'Cita cancelada correctamente');
    } catch (error) {
      console.error('Error cancelling:', error);
      showToast('error', 'Error al cancelar la cita');
    } finally {
      setCancelConfirm({ isOpen: false, id: null });
    }
  };

  const openCancelConfirm = (id: number) => setCancelConfirm({ isOpen: true, id });
  const closeCancelConfirm = () => setCancelConfirm({ isOpen: false, id: null });

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

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  const today = getToday();
  const tomorrow = getTomorrow();
  const days = getDaysInMonth(currentMonth);

  const upcomingAppointments = appointments
    .filter(a => ['PENDING', 'CONFIRMED'].includes(a.status) && a.date.split('T')[0] >= toLocalDateString(tomorrow))
    .sort((a, b) => a.date.localeCompare(b.date));

  const pastAppointments = appointments
    .filter(a => a.status === 'COMPLETED' || a.date.split('T')[0] < toLocalDateString(today))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full" /></div>;
  }

  if (!user || user.role !== 'USER') return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-white">
      <Navbar />
      
      <main className="flex-1 pt-20 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container-responsive max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary font-['Outfit']">
                Hola, <span className="text-primary">{user.name.split(' ')[0]}</span>
              </h1>
            </div>
            <p className="text-sm md:text-base text-text-secondary">Gestiona tus citas y treatmentsos</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Mis Citas
                  </h2>
                  <Button onClick={() => { setSelectedTreatment(null); setBookingStep(1); setSelectedDate(''); setSelectedTime(''); setSelectedDentist(null); setError(''); setShowBooking(true); }} size="sm" className="shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Nuevo Turno
                  </Button>
                </div>
                
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-text-secondary mb-4">No tenés citas próximas</p>
                    <Button onClick={() => { setSelectedTreatment(null); setBookingStep(1); setSelectedDate(''); setSelectedTime(''); setSelectedDentist(null); setError(''); setShowBooking(true); }} className="shadow-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Reservar Primera Cita
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const totalPages = Math.ceil(upcomingAppointments.length / APPOINTMENTS_PER_PAGE);
                      const paginatedAppointments = upcomingAppointments.slice((appointmentsPage - 1) * APPOINTMENTS_PER_PAGE, appointmentsPage * APPOINTMENTS_PER_PAGE);
                      return paginatedAppointments.map((apt) => (
                      <motion.div 
                        key={apt.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-text-primary">{apt.treatment.name}</p>
                              <p className="text-sm text-text-secondary">
                                {new Date(apt.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })} • {apt.time}
                              </p>
                              <p className="text-xs text-text-muted mt-1">{apt.treatment.duration} min • {formatPrice(apt.treatment.price)}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={apt.status === 'PENDING' ? 'pending' : 'success'}>
                              {apt.status === 'PENDING' ? 'Pendiente' : 'Confirmada'}
                            </Badge>
                            <button onClick={() => openCancelConfirm(apt.id)} className="text-xs text-error hover:underline cursor-pointer">
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ));
                    })()}
                    {(() => {
                      const totalPages = Math.ceil(upcomingAppointments.length / APPOINTMENTS_PER_PAGE);
                      return totalPages > 1 ? <Pagination currentPage={appointmentsPage} totalPages={totalPages} onPageChange={setAppointmentsPage} /> : null;
                    })()}
                  </div>
                )}
              </Card>

              {pastAppointments.length > 0 && (
                <Card className="p-4 md:p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-text-secondary" />
                    Historial
                  </h2>
                  <div className="space-y-2">
                    {pastAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary text-sm">{apt.treatment.name}</p>
                            <p className="text-xs text-text-secondary">{new Date(apt.date).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</p>
                          </div>
                        </div>
                        <Badge variant="default" size="sm">Completada</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Treatments Disponibles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {treatments.map((treatment) => (
                    <button
                      key={treatment.id}
                      onClick={() => handleSelectTreatment(treatment)}
                      className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 hover:from-primary/5 hover:to-primary/10 border border-slate-200 hover:border-primary/30 transition-all text-left group cursor-pointer"
                    >
                      <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">{treatment.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-text-secondary">{formatPrice(treatment.price)}</span>
                        <span className="text-xs text-text-muted bg-slate-100 px-2 py-1 rounded-full">{formatDuration(treatment.duration)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Mi Perfil
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{user.name}</p>
                      <p className="text-sm text-text-secondary">Paciente</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Email:</span>
                      <span className="font-medium text-text-primary">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Citas Totales:</span>
                      <span className="font-medium text-text-primary">{appointments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Próximas:</span>
                      <span className="font-medium text-primary">{upcomingAppointments.length}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary">¿Necesitás ayuda?</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">Contactanos para cualquier consulta sobre tu tratamiento.</p>
                <Button variant="secondary" className="w-full" size="sm">
                  Ver Contacto
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={showBooking} onClose={() => { setShowBooking(false); setBookingStep(1); setSelectedTreatment(null); setSelectedDate(''); setSelectedTime(''); setError(''); }} title="Reservar Cita" size="lg">
        <AnimatePresence mode="wait">
          {bookingSuccess ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">¡Reserva Confirmada!</h3>
              <p className="text-text-secondary">Te hemos enviado un email con los detalles.</p>
            </motion.div>
          ) : bookingStep === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <p className="text-text-secondary mb-4">Seleccioná un tratamiento:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {treatments.map((treatment) => (
                  <button
                    key={treatment.id}
                    onClick={() => handleSelectTreatment(treatment)}
                    className="p-4 rounded-xl bg-slate-50 hover:bg-primary/10 border border-slate-200 hover:border-primary/30 transition-all text-left"
                  >
                    <p className="font-medium text-text-primary">{treatment.name}</p>
                    <p className="text-sm text-text-secondary">{formatPrice(treatment.price)} • {formatDuration(treatment.duration)}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                <p className="font-semibold text-text-primary">{selectedTreatment?.name}</p>
                <p className="text-sm text-text-secondary">{formatPrice(selectedTreatment?.price || 0)} • {formatDuration(selectedTreatment?.duration || 0)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Seleccioná un día</label>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
                  <span className="flex-1 text-center font-medium">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                    <div key={d} className="text-xs font-medium text-text-muted py-2">{d}</div>
                  ))}
                  {days.map((day, idx) => {
                    if (!day) return <div key={idx} />;
                    const isSelected = selectedDate === day.toISOString().split('T')[0];
                    const isPast = day < tomorrow;
                    const isSunday = day.getDay() === 0;
                    const isDisabled = isPast || isSunday;
                    return (
                      <button
                        key={idx}
                        onClick={() => !isDisabled && handleDateChange(toLocalDateString(day))}
                        disabled={isDisabled}
                        className={`p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          isSelected ? 'bg-primary text-white' : isDisabled ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100'
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && Object.keys(availableDentists).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Seleccioná un dentista</label>
                  {Object.keys(availableDentists).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {Object.entries(availableDentists).map(([dentistId, data]) => (
                        <button
                          key={dentistId}
                          onClick={() => handleDentistChange(parseInt(dentistId))}
                          className={`p-3 rounded-lg text-left transition-colors cursor-pointer ${
                            selectedDentist?.id === parseInt(dentistId)
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-text-primary'
                          }`}
                        >
                          <p className="font-medium">{data.dentist.name}</p>
                          <p className={`text-xs ${selectedDentist?.id === parseInt(dentistId) ? 'text-white/80' : 'text-text-secondary'}`}>
                            {data.slots.length} horarios disponibles
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      No hay dentists disponibles para este día. Los domingos la clínica está cerrada.
                    </div>
                  )}
                </div>
              )}

              {selectedDate && selectedDentist && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Horarios disponibles</label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableDentists[selectedDentist.id]?.slots.map((slot: string) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedTime === slot ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200 text-text-primary'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setBookingStep(1)} className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-2" />Volver
                </Button>
                <Button onClick={handleBook} disabled={!selectedDate || !selectedTime} loading={bookingLoading} className="flex-1">
                  Confirmar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      <ConfirmDialog
        isOpen={cancelConfirm.isOpen}
        title="Cancelar Cita"
        message="¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
        confirmLabel="Cancelar Cita"
        variant="warning"
        onConfirm={handleCancelAppointment}
        onCancel={closeCancelConfirm}
      />
    </div>
  );
}