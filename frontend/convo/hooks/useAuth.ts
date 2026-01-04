'use client';
import { useState, useEffect } from 'react';
import { getToken, getUser, saveUser, logout } from '@/lib/auth';
import { api } from '@/services/Api';
import { User } from '@/types/user/User';
import { AxiosError } from 'axios';

export function useAuth(username? : string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
    
      if (!token) {
        setLoading(false);
        return;
      }

      const cachedUser = getUser();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
        fetchUserFromAPI();
        return;
      }

      await fetchUserFromAPI();
    } catch (err) {
      
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          logout();
          setError('Session expired. Please login again.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch user');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      }
      
      setLoading(false);
    }
  };

  const fetchUserFromAPI = async () => {
    const token = getToken();
    if (!token) return;

    try {

    const url = username
      ? `/users/details/${username}`
      : '/users/me';
      const response = await api.get(url);
      
      const userData = response.data;
      setUser(userData);
      saveUser(userData);
      setLoading(false);
      setError(null);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  };
  
  const toggleFollow = async () => {
    await api.post(`/users/${username}/follow`);
    setUser((prev: any) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing
        ? prev.followersCount - 1
        : prev.followersCount + 1,
    }));
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return { user, loading, error, refetch: fetchCurrentUser, toggleFollow };
}
