import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor: attach auth token ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: handle 401 ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't clear storage here — let AuthContext handle it
    }
    return Promise.reject(error);
  }
);

// ── College APIs ─────────────────────────────────────────────
export const fetchColleges = (params = {}) => {
  // Strip null/undefined/empty/zero values to prevent backend misfiltering
  const clean = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') return;
    if ((k === 'minRating' || k === 'minFees') && (v === 0 || v === '0')) return;
    clean[k] = v;
  });
  return api.get('/colleges', { params: clean });
};

export const fetchCollegeById = (id) => api.get(`/colleges/${id}`);

export const compareColleges = (ids) => {
  const params = ids.map(id => `ids=${id}`).join('&');
  return api.get(`/colleges/compare?${params}`);
};

// ── Save/Favorite APIs ────────────────────────────────────────
export const fetchSavedColleges = () => api.get('/colleges/saved');

// Backend: POST /colleges/save  body: { collegeId }
export const saveCollege = (id) => api.post('/colleges/save', { collegeId: id });

// Backend: DELETE /colleges/save/{collegeId}
export const unsaveCollege = (id) => api.delete(`/colleges/save/${id}`);

// ── Auth APIs ─────────────────────────────────────────────────
export const loginUser = (data) => api.post('/auth/login', data);

export const registerUser = (data) => api.post('/auth/register', data);

export default api;
