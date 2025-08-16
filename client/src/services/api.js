import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Artworks API
export const artworksAPI = {
  getAll: (params) => api.get('/artworks', { params }),
  getById: (id) => api.get(`/artworks/${id}`),
  getCategories: () => api.get('/artworks/categories/list'),
};

// Orders API
export const ordersAPI = {
  createPaymentIntent: (data) => api.post('/orders/create-payment-intent', data),
  confirmPayment: (data) => api.post('/orders/confirm-payment', data),
  getMyOrders: () => api.get('/orders/my-orders'),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  
  // Artworks
  getArtworks: () => api.get('/admin/artworks'),
  createArtwork: (formData) => api.post('/admin/artworks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateArtwork: (id, formData) => api.put(`/admin/artworks/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteArtwork: (id) => api.delete(`/admin/artworks/${id}`),
  
  // Orders
  getOrders: () => api.get('/admin/orders'),
  
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
};

export default api;