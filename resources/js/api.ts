// src/api.ts
import axios from 'axios';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const API     = import.meta.env.VITE_API_URL     || `${BACKEND}/api`;

export const csrf = axios.create({
  baseURL: BACKEND,
  withCredentials: true,
});

const api = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async config => {
  const m = config.method?.toLowerCase();
  if (['post','put','patch','delete'].includes(m!)) {
    // 상태 변경 전 CSRF 쿠키 요청
    await csrf.get('/sanctum/csrf-cookie');
  }
  return config;
});

export default api;
