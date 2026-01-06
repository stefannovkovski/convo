'use client';

import { useState } from 'react';
import { api } from '@/services/Api';
import { saveToken } from '@/lib/auth';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken } = res.data;

      saveToken(accessToken);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    loading,
    error,
  };
}
