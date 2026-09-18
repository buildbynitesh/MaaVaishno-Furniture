import express from 'express'

// Controllers
import contactRoutes from './contactRoutes.js'


import { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview }               from '../controllers/productController.js'
import { createRazorpayOrder, verifyPayment, createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelOrder } from '../controllers/orderController.js'
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory }                   from '../controllers/categoryController.js'
import { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats }                       from '../controllers/userController.js'
import { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon }                       from '../controllers/couponController.js'
import { getWishlist, toggleWishlist, clearWishlist }                                                   from '../controllers/wishlistController.js'
import { subscribe, unsubscribe, getAllSubscribers }                                                     from '../controllers/newsletterController.js'
import { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner }                           from '../controllers/bannerController.js'

// Middleware
import { protect, adminOnly } from '../middleware/auth.js'
import { upload }             from '../middleware/upload.js'

const router = express.Router()
router.use('/contact', contactRoutes);
// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
router.post('/auth/register',             register)
router.post('/auth/login',                login)
router.post('/auth/forgot-password',      forgotPassword)
router.post('/auth/reset-password/:token', resetPassword)
router.get('/auth/me',                    protect, getMe)
router.put('/auth/profile',               protect, updateProfile)
router.put('/auth/change-password',       protect, changePassword)

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════
router.get ('/products',              getProducts)
router.get ('/products/:slug',        getProduct)
router.post('/products',              protect, adminOnly, upload.array('images', 6), createProduct)
router.put ('/products/:id',          protect, adminOnly, updateProduct)
router.delete('/products/:id',        protect, adminOnly, deleteProduct)
router.post('/products/:id/reviews',  protect, addReview)

// ═══════════════════════════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════════════════════════
router.get   ('/categories',       getCategories)
router.get   ('/categories/:slug', getCategory)
router.post  ('/categories',       protect, adminOnly, createCategory)
router.put   ('/categories/:id',   protect, adminOnly, updateCategory)
router.delete('/categories/:id',   protect, adminOnly, deleteCategory)

// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════
router.post('/orders/create-razorpay', protect, createRazorpayOrder)
router.post('/orders/verify-payment',  protect, verifyPayment)
router.post('/orders',                 protect, createOrder)
router.get ('/orders/my',              protect, getMyOrders)
router.put ('/orders/:id/cancel',      protect, cancelOrder)
router.get ('/orders',                 protect, adminOnly, getAllOrders)
router.put ('/orders/:id/status',      protect, adminOnly, updateOrderStatus)

// ═══════════════════════════════════════════════════════════════
// COUPONS
// ═══════════════════════════════════════════════════════════════
router.post  ('/coupons/validate', validateCoupon)
router.get   ('/coupons',          protect, adminOnly, getAllCoupons)
router.post  ('/coupons',          protect, adminOnly, createCoupon)
router.put   ('/coupons/:id',      protect, adminOnly, updateCoupon)
router.delete('/coupons/:id',      protect, adminOnly, deleteCoupon)

// ═══════════════════════════════════════════════════════════════
// WISHLIST
// ═══════════════════════════════════════════════════════════════
router.get   ('/wishlist',        protect, getWishlist)
router.post  ('/wishlist/toggle', protect, toggleWishlist)
router.delete('/wishlist',        protect, clearWishlist)

// ═══════════════════════════════════════════════════════════════
// NEWSLETTER
// ═══════════════════════════════════════════════════════════════
router.post('/newsletter/subscribe',   subscribe)
router.post('/newsletter/unsubscribe', unsubscribe)
router.get ('/newsletter',             protect, adminOnly, getAllSubscribers)

// ═══════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════
router.get   ('/banners',     getBanners)
router.get   ('/banners/all', protect, adminOnly, getAllBanners)
router.post  ('/banners',     protect, adminOnly, upload.single('image'), createBanner)
router.put   ('/banners/:id', protect, adminOnly, updateBanner)
router.delete('/banners/:id', protect, adminOnly, deleteBanner)

// ═══════════════════════════════════════════════════════════════
// USERS (admin)
// ═══════════════════════════════════════════════════════════════
router.get   ('/admin/dashboard', protect, adminOnly, getDashboardStats)
router.get   ('/users',           protect, adminOnly, getAllUsers)
router.get   ('/users/:id',       protect, adminOnly, getUserById)
router.put   ('/users/:id/role',  protect, adminOnly, updateUserRole)
router.delete('/users/:id',       protect, adminOnly, deleteUser)

// ═══════════════════════════════════════════════════════════════
// FILE UPLOAD (generic)
// ═══════════════════════════════════════════════════════════════
router.post('/upload', protect, adminOnly, upload.array('images', 6), (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ success: false, message: 'No files uploaded' })
  }
  res.json({
    success: true,
    images: req.files.map(f => f.filename),
    count:  req.files.length,
  })
})

export default router
