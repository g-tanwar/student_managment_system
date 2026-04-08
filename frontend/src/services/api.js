import axios from 'axios';

const API = axios.create({
  baseURL: 'https://student-managment-system-2-i0vi.onrender.com/api/v1',
  timeout: 30000,
});

// ── Request Interceptor: attach JWT token ──────────────────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 / 403 globally ───────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Always forward the error so individual components can handle it
    return Promise.reject(error);
  }
);

export default API;
