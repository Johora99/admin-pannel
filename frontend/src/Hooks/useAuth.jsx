import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import { useState, useEffect } from 'react';

export default function useAuth() {
  const axiosSecure = useAxiosSecure();
  const [tokenExists, setTokenExists] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTokenExists(false);
    }
  }, []);

  const {data : userData = [], isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axiosSecure.get('/api/auth/me');
      return data;
    },
    enabled: tokenExists, 
    retry: false,
  });

  return { user: userData, loading: isLoading || !tokenExists };
}
