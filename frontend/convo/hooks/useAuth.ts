import { getToken, logout, saveUser } from "@/lib/auth";
import { api } from "@/services/Api";
import { User } from "@/types/user/User";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function useAuth(username?: string){
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();

      if (!token){
        setLoading(false);
        return;
      }

      await fetchUserFromApi();
    }catch(err){
      if (err instanceof AxiosError){
        if(err.response?.status === 401) {
          logout();
          setError('Session expired. Please login again.')
        } else {
          setError(err.response?.data?.message || 'Failed to fetch user');
        }
      }
      else {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      }

      setLoading(false);
    }
  };

  const fetchUserFromApi = async () => {
    const token = getToken();
    if(!token) return;

    try{
      const url = username ? `/users/details/${username}` : '/users/me';
      const response = await api.get(url);

      const userData = response.data;
      setUser(userData);

      if(!username){
        saveUser(userData);
      }

      setLoading(false);
      setError(null);
    }catch(err){
      if(err instanceof AxiosError && err.response?.status === 401){
        logout();
      }
      throw err;
    }
  };

const toggleFollow = async () => {
    if (!username || !user) {
      return;
    }
    
    try {
      await api.post(`/users/${username}/follow`);
      
      await fetchUserFromApi();
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setError('Failed to update follow status. Please try again.');
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [username]);

  return { user, loading, error, refetch: fetchCurrentUser, toggleFollow };

}