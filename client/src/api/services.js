/**
 * api/services.js
 * Centralised API service layer.
 * All components should import from here — never call `api` (axios) directly in pages.
 */
import api from './axios'

// ═════════════════════════════════════════════════════════════
// AUTH
// ═════════════════════════════════════════════════════════════
export const authService = {
  register:       (data)     => api.post('/auth/register', data),
  login:          (data)     => api.post('/auth/login', data),
  getMe:          ()         => api.get('/auth/me'),
  updateProfile:  (data)     => api.put('/auth/profile', data),
  changePassword: (data)     => api.put('/auth/change-password', data),
  forgotPassword: (email)    => api.post('/auth/forgot-password', { email }),
  resetPassword:  (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
}

// ═════════════════════════════════════════════════════════════
// PRODUCTS
// ═════════════════════════════════════════════════════════════
export const productService = {
  getAll:     (params)       => api.get('/products', { params }),
  getBySlug:  (slug)         => api.get(`/products/${slug}`),
  create:     (formData)     => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:     (id, data)     => api.put(`/products/${id}`, data),
  delete:     (id)           => api.delete(`/products/${id}`),
  addReview:  (id, data)     => api.post(`/products/${id}/reviews`, data),
  getFeatured: ()            => api.get('/products?featured=true&limit=8'),
  getBestsellers: ()         => api.get('/products?bestseller=true&limit=8'),
}

// ═════════════════════════════════════════════════════════════
// CATEGORIES
// ═════════════════════════════════════════════════════════════
export const categoryService = {
  getAll:   ()               => api.get('/categories'),
  getBySlug:(slug)           => api.get(`/categories/${slug}`),
  create:   (data)           => api.post('/categories', data),
  update:   (id, data)       => api.put(`/categories/${id}`, data),
  delete:   (id)             => api.delete(`/categories/${id}`),
}

// ═════════════════════════════════════════════════════════════
// ORDERS
// ═════════════════════════════════════════════════════════════
export const orderService = {
  createRazorpay: (amount)   => api.post('/orders/create-razorpay', { amount }),
  verifyPayment:  (data)     => api.post('/orders/verify-payment', data),
  placeCOD:       (data)     => api.post('/orders', data),
  getMyOrders:    ()         => api.get('/orders/my'),
  getAllOrders:   (params)   => api.get('/orders', { params }),
  updateStatus:   (id, status) => api.put(`/orders/${id}/status`, { orderStatus: status }),
}

// ═════════════════════════════════════════════════════════════
// COUPONS
// ═════════════════════════════════════════════════════════════
export const couponService = {
  validate: (code, subtotal) => api.post('/coupons/validate', { code, subtotal }),
  getAll:   ()               => api.get('/coupons'),
  create:   (data)           => api.post('/coupons', data),
  update:   (id, data)       => api.put(`/coupons/${id}`, data),
  delete:   (id)             => api.delete(`/coupons/${id}`),
}

// ═════════════════════════════════════════════════════════════
// WISHLIST
// ═════════════════════════════════════════════════════════════
export const wishlistService = {
  get:    ()          => api.get('/wishlist'),
  toggle: (productId) => api.post('/wishlist/toggle', { productId }),
  clear:  ()          => api.delete('/wishlist'),
}

// ═════════════════════════════════════════════════════════════
// USERS (admin)
// ═════════════════════════════════════════════════════════════
export const userService = {
  getAll:       (params)     => api.get('/users', { params }),
  getById:      (id)         => api.get(`/users/${id}`),
  updateRole:   (id, role)   => api.put(`/users/${id}/role`, { role }),
  delete:       (id)         => api.delete(`/users/${id}`),
  getDashboard: ()           => api.get('/admin/dashboard'),
}

// ═════════════════════════════════════════════════════════════
// UPLOAD
// ═════════════════════════════════════════════════════════════
export const uploadService = {
  images: (files) => {
    const fd = new FormData()
    files.forEach(f => fd.append('images', f))
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}
