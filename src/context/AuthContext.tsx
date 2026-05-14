'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'DENTIST' | 'SUPERADMIN';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        await refreshToken();
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));

    const checkTokenInterval = setInterval(async () => {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });
      if (response.status === 401) {
        await refreshToken();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(checkTokenInterval);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setUser(data);
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}