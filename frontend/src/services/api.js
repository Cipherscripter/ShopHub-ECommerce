import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — attach JWT ─────────────────────────────────────────
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

// ─── Response Interceptor — handle 401 globally ───────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)  => API.post('/auth/register', data),
  login:    (data)  => API.post('/auth/login', data),
  getMe:    ()      => API.get('/auth/me'),
};

// ─── Products ──────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:      (params) => API.get('/products', { params }),
  getFeatured: ()       => API.get('/products/featured'),
  getById:     (id)     => API.get(`/products/${id}`),
  create:      (data)   => API.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update:      (id, data) => API.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete:      (id)     => API.delete(`/products/${id}`),
  addReview:   (id, data) => API.post(`/products/${id}/reviews`, data),
};

// ─── Cart ──────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()                    => API.get('/cart'),
  add:    (productId, quantity) => API.post('/cart', { productId, quantity }),
  update: (productId, quantity) => API.put(`/cart/${productId}`, { quantity }),
  remove: (productId)           => API.delete(`/cart/${productId}`),
  clear:  ()                    => API.delete('/cart'),
};

// ─── Orders ────────────────────────────────────────────────────────────────────
export const orderAPI = {
  create:       (data)         => API.post('/orders', data),
  getMyOrders:  (params)       => API.get('/orders/my', { params }),
  getById:      (id)           => API.get(`/orders/${id}`),
  getAllOrders: (params)        => API.get('/orders', { params }),
  updateStatus: (id, data)     => API.put(`/orders/${id}/status`, data),
  markPaid:     (id, data)     => API.put(`/orders/${id}/pay`, data),
};

// ─── Payment ───────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createIntent: (orderId) => API.post('/payment/create-payment-intent', { orderId }),
  mockPay:      (orderId) => API.post('/payment/mock', { orderId }),
};

// ─── Users (Admin) ─────────────────────────────────────────────────────────────
export const userAPI = {
  getAll:       (params) => API.get('/users', { params }),
  getById:      (id)     => API.get(`/users/${id}`),
  updateRole:   (id, role) => API.put(`/users/${id}`, { role }),
  delete:       (id)     => API.delete(`/users/${id}`),
  updateProfile:(data)   => API.put('/users/profile/me', data),
};

export default API;
