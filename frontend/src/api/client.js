import axios from 'axios';
import { API_BASE } from '../utils/urls';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kernia_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Only treat a true auth failure as a session reset.
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('kernia_token');
        localStorage.removeItem('kernia_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
