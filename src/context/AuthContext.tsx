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
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getAuthHeader: () => { Authorization: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getStoredTokens = () => {
  if (typeof window === 'undefined') return { accessToken: null, refreshToken: null };
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken')
  };
};

const setStoredTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearStoredTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const { accessToken } = getStoredTokens();
    return { Authorization: `Bearer ${accessToken}` };
  };

  const refreshToken = async () => {
    try {
      const { refreshToken } = getStoredTokens();
      if (!refreshToken) {
        setUser(null);
        return;
      }
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`
        }
      });
      if (!response.ok) {
        clearStoredTokens();
        setUser(null);
        return;
      }
      const data = await response.json();
      if (data.user && data.accessToken && data.refreshToken) {
        setStoredTokens(data.accessToken, data.refreshToken);
        setUser(data.user);
      }
    } catch {
      clearStoredTokens();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const { accessToken } = getStoredTokens();
      if (!accessToken) {
        setUser(null);
        return;
      }
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: getAuthHeader()
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
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setStoredTokens(data.accessToken, data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900`;
    const userData = { id: data.id, name: data.name, email: data.email, role: data.role };
    setUser(userData);
    return userData;
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    setStoredTokens(data.accessToken, data.refreshToken);
    document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900`;
    setUser({ id: data.id, name: data.name, email: data.email, role: data.role });
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST'
    });
    clearStoredTokens();
    document.cookie = 'accessToken=; path=/; max-age=0';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}