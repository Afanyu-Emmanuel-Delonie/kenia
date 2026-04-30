import api from './client';

// ── Backend verification ──────────────────────────────────────────────────
export const verifyBackend = () => api.get('/dashboard'); // Use authenticated endpoint
export const getProfile = () => api.get('/auth/profile');

// ── Auth ──────────────────────────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// ── Dashboard ─────────────────────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard');

// ── Products ──────────────────────────────────────────────────────────────
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const signStage = (id, data) => api.post(`/products/${id}/sign`, data);
export const uploadQaPhoto = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/products/${id}/qa-photo`, form);
};
export const generateOtp = (id) => api.post(`/products/${id}/activation-otp`);
export const activateProduct = (id, data) => api.post(`/products/${id}/activate`, data);
export const transferOwnership = (id, data) => api.post(`/products/${id}/transfer`, data);

// ── Materials ─────────────────────────────────────────────────────────────
export const getMaterials = () => api.get('/materials');
export const getMaterial = (id) => api.get(`/materials/${id}`);
export const createMaterial = (data) => api.post('/materials', data);
export const adjustStock = (id, data) => api.patch(`/materials/${id}/stock`, data);
export const getLowStock = () => api.get('/materials/low-stock');
export const deleteMaterial = (id) => api.delete(`/materials/${id}`);
export const deleteListing = (id) => api.delete(`/store/${id}`);
export const deleteInquiry = (id) => api.delete(`/inquiries/${id}`);

// ── Store ─────────────────────────────────────────────────────────────────
export const getStoreListings = () => api.get('/store/all');
export const createListing = (data) => api.post('/store', data);
export const updateListing = (id, data) => api.put(`/store/${id}`, data);
export const uploadListingImage = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post(`/store/${id}/images`, form);
};

// ── Orders ────────────────────────────────────────────────────────────────
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => api.patch(`/orders/${id}/status`, data);

// ── Inquiries ─────────────────────────────────────────────────────────────
export const getInquiries = () => api.get('/inquiries');
export const getOpenInquiries = () => api.get('/inquiries/open');
export const replyInquiry = (id, data) => api.post(`/inquiries/${id}/reply`, data);
export const submitInquiry = (data) =>
  api.post('/inquiries', data, { skipAuth: true });
