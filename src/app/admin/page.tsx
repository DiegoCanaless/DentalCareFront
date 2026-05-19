'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
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
import { 
  Users, UserPlus, Trash2, Edit2, Crown, Stethoscope, User, Shield, 
  Calendar, Sparkles, Star, TrendingUp, Clock, DollarSign
} from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Treatment {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  icon: string;
  available: boolean;
}

interface Stats {
  totalUsers: number;
  totalDentists: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  monthlyRevenue: number;
}

const roleLabels: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'pending'; icon: React.ElementType }> = {
  SUPERADMIN: { label: 'SuperAdmin', variant: 'warning', icon: Crown },
  DENTIST: { label: 'Dentista', variant: 'success', icon: Stethoscope },
  USER: { label: 'Paciente', variant: 'default', icon: User },
};

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Star, Shield, Clock, Calendar, TrendingUp, DollarSign, Users, Stethoscope, User,
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalDentists: 0, pendingAppointments: 0, confirmedAppointments: 0, completedAppointments: 0, monthlyRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'DENTIST' as 'USER' | 'DENTIST' });
  const [activeTab, setActiveTab] = useState<'users' | 'treatments'>('users');
  const [userFilter, setUserFilter] = useState<'all' | 'dentists' | 'patients'>('all');
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
  const [treatmentForm, setTreatmentForm] = useState({ name: '', description: '', duration: 30, price: 0, icon: 'Sparkles' });
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; type: 'user' | 'treatment' | null; id: number | null }>({ isOpen: false, type: null, id: null });
  const [usersPage, setUsersPage] = useState(1);
  const [treatmentsPage, setTreatmentsPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'SUPERADMIN')) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'SUPERADMIN') loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [statsData, usersData, treatmentsData] = await Promise.all([
        api.stats.get(),
        api.users.list(),
        api.treatments.listAll(),
      ]);
      setUsers(usersData);
      setTreatments(treatmentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (!userForm.name) {
        showToast('warning', 'El nombre es requerido');
        return;
      }
      if (!editingUser && (!userForm.email || !userForm.password)) {
        showToast('warning', 'Email y contraseña son requeridos para nuevos usuarios');
        return;
      }
      if (editingUser) {
        await api.users.update(editingUser.id, { name: userForm.name, role: userForm.role });
        showToast('success', 'Usuario actualizado correctamente');
      } else {
        await api.users.create({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          role: userForm.role as 'USER' | 'DENTIST'
        });
        showToast('success', 'Usuario creado correctamente');
      }
      loadData();
      setShowUserModal(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'DENTIST' });
    } catch (error) {
      console.error('Error saving user:', error);
      showToast('error', error instanceof Error ? error.message : 'Error al guardar usuario');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDialog.id) return;
    try {
      await api.users.delete(confirmDialog.id);
      loadData();
      showToast('success', 'Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('error', error instanceof Error ? error.message : 'Error al eliminar usuario');
    } finally {
      setConfirmDialog({ isOpen: false, type: null, id: null });
    }
  };

  const handleDeleteTreatment = async () => {
    if (!confirmDialog.id) return;
    console.log('Deleting treatment:', confirmDialog.id);
    try {
      const result = await api.treatments.delete(confirmDialog.id);
      console.log('Delete result:', result);
      loadData();
      showToast('success', 'Tratamiento deshabilitado correctamente');
    } catch (error) {
      console.error('Error deleting treatment:', error);
      showToast('error', error instanceof Error ? error.message : 'Error al deshabilitar tratamiento');
    } finally {
      setConfirmDialog({ isOpen: false, type: null, id: null });
    }
  };

  const openDeleteUserConfirm = (id: number) => setConfirmDialog({ isOpen: true, type: 'user', id });
  const openDeleteTreatmentConfirm = (id: number) => setConfirmDialog({ isOpen: true, type: 'treatment', id });
  const closeConfirmDialog = () => setConfirmDialog({ isOpen: false, type: null, id: null });

  const handleToggleAvailability = async (treatment: Treatment) => {
    try {
      await api.treatments.update(treatment.id, { available: !treatment.available });
      loadData();
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const handleSaveTreatment = async () => {
    try {
      if (!treatmentForm.name || !treatmentForm.description) {
        showToast('warning', 'Nombre y descripción son requeridos');
        return;
      }
      if (editingTreatment) {
        await api.treatments.update(editingTreatment.id, treatmentForm);
      } else {
        await api.treatments.create(treatmentForm);
      }
      loadData();
      setShowTreatmentModal(false);
      setEditingTreatment(null);
      setTreatmentForm({ name: '', description: '', duration: 30, price: 0, icon: 'Sparkles' });
    } catch (error) {
      console.error('Error saving treatment:', error);
      showToast('error', error instanceof Error ? error.message : 'Error al guardar tratamiento');
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full" /></div>;
  }

  if (!user || user.role !== 'SUPERADMIN') return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-white">
      <Navbar />
      
      <main className="flex-1 pt-20 md:pt-24 pb-12 md:pb-16 px-4">
        <div className="container-responsive max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary font-['Outfit']">
                Panel de <span className="text-accent">Administración</span>
              </h1>
            </div>
            <p className="text-sm md:text-base text-text-secondary">Gestiona usuarios, dentistas y tratamientos</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            {[
              { label: 'Pacientes', value: stats.totalPatients.toLocaleString('es-AR'), icon: Users, color: 'from-primary to-primary-dark' },
              { label: 'Dentistas', value: stats.totalDentists.toLocaleString('es-AR'), icon: Stethoscope, color: 'from-emerald-500 to-emerald-600' },
              { label: 'Citas este Mes', value: (stats.pendingAppointments + stats.confirmedAppointments + stats.completedAppointments).toLocaleString('es-AR'), icon: Calendar, color: 'from-blue-500 to-blue-600' },
              { label: 'Ingresos del Mes', value: `$${stats.monthlyRevenue.toLocaleString('es-AR')}`, icon: DollarSign, color: 'from-amber-500 to-amber-600' },
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

          <Card className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex gap-2">
                <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
                  <Users className="w-4 h-4 inline mr-2" />
                  Usuarios
                </button>
                <button onClick={() => setActiveTab('treatments')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === 'treatments' ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-text-secondary hover:bg-slate-200'}`}>
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Tratamientos
                </button>
              </div>
              {activeTab === 'users' && (
                <Button onClick={() => setShowUserModal(true)} className="w-full sm:w-auto shadow-lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Usuario
                </Button>
              )}
              {activeTab === 'treatments' && (
                <Button onClick={() => { setEditingTreatment(null); setTreatmentForm({ name: '', description: '', duration: 30, price: 0, icon: 'Sparkles' }); setShowTreatmentModal(true); }} className="w-full sm:w-auto shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Agregar Tratamiento
                </Button>
              )}
            </div>

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex gap-2 border-b border-slate-200 pb-2">
                  <button onClick={() => setUserFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${userFilter === 'all' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                    Todos ({users.length})
                  </button>
                  <button onClick={() => setUserFilter('dentists')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${userFilter === 'dentists' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                    <Stethoscope className="w-3.5 h-3.5" />
                    Dentistas ({users.filter(u => u.role === 'DENTIST').length})
                  </button>
                  <button onClick={() => setUserFilter('patients')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${userFilter === 'patients' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                    <User className="w-3.5 h-3.5" />
                    Pacientes ({users.filter(u => u.role === 'USER').length})
                  </button>
                </div>
                <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
                <table className="w-full min-w-[500px] md:min-w-0">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Usuario</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Rol</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">Fecha</th>
                      <th className="text-right py-3 px-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = users.filter(u => userFilter === 'all' || (userFilter === 'dentists' && u.role === 'DENTIST') || (userFilter === 'patients' && u.role === 'USER'));
                      const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                      const paginatedUsers = filtered.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE);
                      return paginatedUsers.map((u) => {
                      const RoleIcon = roleLabels[u.role]?.icon || User;
                      return (
                        <tr key={u.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${u.role === 'DENTIST' ? 'bg-emerald-50/50' : ''}`}>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <RoleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                              </div>
                              <span className="font-medium text-text-primary text-sm">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 hidden sm:table-cell">
                            <span className="text-sm text-text-secondary">{u.email}</span>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant={roleLabels[u.role]?.variant || 'default'} className="text-xs">{roleLabels[u.role]?.label}</Badge>
                          </td>
                          <td className="py-3 px-2 hidden md:table-cell">
                            <span className="text-xs sm:text-sm text-text-secondary">{new Date(u.createdAt).toLocaleDateString('es-ES')}</span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditingUser(u); setUserForm({ name: u.name, email: u.email, password: '', role: u.role as 'USER' | 'DENTIST' }); setShowUserModal(true); }} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-text-secondary" />
                              </button>
                              {u.role !== 'SUPERADMIN' && (
                                <button onClick={() => openDeleteUserConfirm(u.id)} className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-error" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                      });
                    })()}
                  </tbody>
                </table>
                </div>
                {(() => {
                  const filtered = users.filter(u => userFilter === 'all' || (userFilter === 'dentists' && u.role === 'DENTIST') || (userFilter === 'patients' && u.role === 'USER'));
                  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
                  return totalPages > 1 ? <Pagination currentPage={usersPage} totalPages={totalPages} onPageChange={setUsersPage} /> : null;
                })()}
              </div>
            )}

            {activeTab === 'treatments' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(() => {
                    const totalPages = Math.ceil(treatments.length / ITEMS_PER_PAGE);
                    const paginatedTreatments = treatments.slice((treatmentsPage - 1) * ITEMS_PER_PAGE, treatmentsPage * ITEMS_PER_PAGE);
                    return paginatedTreatments.map((treatment) => {
                    const Icon = iconMap[treatment.icon] || Star;
                    return (
                      <div key={treatment.id} className={`p-4 rounded-xl transition-colors ${treatment.available ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-100 opacity-60'}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary text-sm sm:text-base">{treatment.name}</p>
                            <p className="text-xs sm:text-sm text-text-secondary">${treatment.price} • {treatment.duration}min</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingTreatment(treatment); setTreatmentForm({ name: treatment.name, description: treatment.description, duration: treatment.duration, price: treatment.price, icon: treatment.icon }); setShowTreatmentModal(true); }} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer" title="Editar tratamiento">
                            <Edit2 className="w-4 h-4 text-text-secondary" />
                          </button>
                          <button onClick={() => openDeleteTreatmentConfirm(treatment.id)} className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" title="Deshabilitar tratamiento">
                            <Trash2 className="w-4 h-4 text-error" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleToggleAvailability(treatment)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            treatment.available
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {treatment.available ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Disponible
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              No disponible
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                    });
                  })()}
                </div>
                {(() => {
                  const totalPages = Math.ceil(treatments.length / ITEMS_PER_PAGE);
                  return totalPages > 1 ? <Pagination currentPage={treatmentsPage} totalPages={totalPages} onPageChange={setTreatmentsPage} /> : null;
                })()}
              </>
            )}
          </Card>
        </div>
      </main>

      <Modal isOpen={showUserModal} onClose={() => { setShowUserModal(false); setEditingUser(null); setUserForm({ name: '', email: '', password: '', role: 'DENTIST' }); }} title={editingUser ? 'Editar Usuario' : 'Agregar Nuevo Dentista'}>
        <div className="space-y-4">
          <Input label="Nombre completo" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Dr. Juan Pérez" />
          <Input label="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="doctor@clinica.com" disabled={!!editingUser} />
          {!editingUser && <Input label="Contraseña" type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••" />}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Rol</label>
            <div className="flex gap-2">
              {(['USER', 'DENTIST'] as const).map((role) => {
                const Icon = roleLabels[role].icon;
                return (
                  <button key={role} type="button" onClick={() => setUserForm({ ...userForm, role })} className={`flex-1 p-3 rounded-xl transition-colors flex flex-col items-center gap-2 cursor-pointer ${userForm.role === role ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200'}`}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{roleLabels[role].label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <Button className="w-full" onClick={handleSaveUser}>{editingUser ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
        </div>
      </Modal>

      <Modal isOpen={showTreatmentModal} onClose={() => { setShowTreatmentModal(false); setEditingTreatment(null); setTreatmentForm({ name: '', description: '', duration: 30, price: 0, icon: 'Sparkles' }); }} title={editingTreatment ? 'Editar Tratamiento' : 'Agregar Nuevo Tratamiento'}>
        <div className="space-y-4">
          <Input label="Nombre" value={treatmentForm.name} onChange={(e) => setTreatmentForm({ ...treatmentForm, name: e.target.value })} placeholder="Limpieza Dental" />
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Descripción</label>
            <textarea
              value={treatmentForm.description}
              onChange={(e) => setTreatmentForm({ ...treatmentForm, description: e.target.value })}
              placeholder="Descripción del tratamiento..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duración (min)" type="number" value={treatmentForm.duration} onChange={(e) => setTreatmentForm({ ...treatmentForm, duration: parseInt(e.target.value) || 0 })} placeholder="30" />
            <Input label="Precio ($)" type="number" value={treatmentForm.price} onChange={(e) => setTreatmentForm({ ...treatmentForm, price: parseFloat(e.target.value) || 0 })} placeholder="100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Icono</label>
            <div className="grid grid-cols-5 gap-2">
              {Object.keys(iconMap).map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setTreatmentForm({ ...treatmentForm, icon: iconName })}
                  className={`p-3 rounded-xl transition-colors flex items-center justify-center ${treatmentForm.icon === iconName ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
                >
                  {React.createElement(iconMap[iconName], { className: 'w-5 h-5' })}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleSaveTreatment}>{editingTreatment ? 'Guardar Cambios' : 'Crear Tratamiento'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'user' ? 'Eliminar Usuario' : 'Eliminar Tratamiento'}
        message={confirmDialog.type === 'user' ? '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.' : '¿Estás seguro de eliminar este tratamiento? Se dará de baja para nuevos pacientes.'}
        confirmLabel={confirmDialog.type === 'user' ? 'Eliminar Usuario' : 'Eliminar Tratamiento'}
        variant="danger"
        onConfirm={confirmDialog.type === 'user' ? handleDeleteUser : handleDeleteTreatment}
        onCancel={closeConfirmDialog}
      />
    </div>
  );
}
