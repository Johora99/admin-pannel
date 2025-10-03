import axios from 'axios';

const axiosSecure = axios.create({
  // baseURL: 'https://admin-pannel-1.onrender.com',
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://backend-delta-wine.vercel.app',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function useAxiosSecure() {
  return axiosSecure;
}
