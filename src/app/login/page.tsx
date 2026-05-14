'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const user = await (await fetch('http://localhost:3001/api/auth/me', { credentials: 'include' })).json();
      router.push(user.role === 'SUPERADMIN' ? '/admin' : user.role === 'DENTIST' ? '/dentist' : '/user');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-primary-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-center max-w-md relative z-10 space-y-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold font-['Outfit']">Bienvenido de nuevo</h1>
          <p className="text-base lg:text-lg text-white/80">
            Accede a tu cuenta para gestionar tus citas y mantener tu sonrisa saludable.
          </p>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-['Outfit']">Iniciar Sesión</h2>
          </div>

          <Card className="hidden lg:block">
            <h2 className="text-2xl font-bold text-text-primary font-['Outfit'] mb-2">Iniciar Sesión</h2>
            <p className="text-sm text-text-secondary mb-6">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">Regístrate aquí</Link>
            </p>
          </Card>

          <Card padding="lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />

              <div className="relative">
                <Input
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-text-muted hover:text-text-primary cursor-pointer">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-text-secondary text-center mb-3">Credenciales de prueba:</p>
              <div className="p-4 rounded-xl bg-slate-50 space-y-1.5 text-sm">
                <p><strong className="text-text-secondary">Admin:</strong> admin@dentalcare.com / admin123</p>
                <p><strong className="text-text-secondary">Doctor:</strong> dr.garcia@dentalcare.com / dentist123</p>
              </div>
            </div>
          </Card>

          <p className="lg:hidden text-center text-sm text-text-secondary">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">Regístrate aquí</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
