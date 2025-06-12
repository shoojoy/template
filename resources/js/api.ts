import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method!)) {
    await axios.get('/sanctum/csrf-cookie', {
      baseURL: api.defaults.baseURL,
      withCredentials: true,
    });
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
