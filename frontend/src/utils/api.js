import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  getCategories: () => API.get('/products/categories'),
  getRecommendations: (id) => API.get(`/products/${id}/recommendations`),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  add: (productId, quantity) => API.post('/cart', { productId, quantity }),
  update: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => API.delete(`/cart/${productId}`),
  clear: () => API.delete('/cart'),
};

export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  toggle: (productId) => API.post('/wishlist/toggle', { productId }),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  pay: (id, data) => API.put(`/orders/${id}/pay`, data),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getOrders: () => API.get('/admin/orders'),
  updateOrderStatus: (id, status) => API.put(`/admin/orders/${id}/status`, { status }),
  createProduct: (data) => API.post('/admin/products', data),
  updateProduct: (id, data) => API.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/admin/products/${id}`),
};

export default API;
