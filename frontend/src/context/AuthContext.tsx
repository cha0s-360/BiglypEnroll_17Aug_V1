'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextValue {
  user: AuthUser | null | false;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: any) => Promise<AuthUser>;
  logout: () => void;
  setUser: (u: AuthUser | false) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // null = loading, false = logged out
  const [user, setUser] = useState<AuthUser | null | false>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('biglyp_token') : null;
    if (!token) {
      setUser(false);
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem('biglyp_token');
        setUser(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const persist = (data: any) => {
    localStorage.setItem('biglyp_token', data.token);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
    return data.user as AuthUser;
  };

  const register = async (payload: any) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data);
    return data.user as AuthUser;
  };

  const logout = () => {
    localStorage.removeItem('biglyp_token');
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext) as AuthContextValue;
