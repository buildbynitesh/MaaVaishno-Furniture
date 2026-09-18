import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// ─── USER ──────────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone:    { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:   { type: String, default: '' },
  address:  {
    line1: String, line2: String,
    city: String, state: String, pincode: String,
  },
  resetPasswordToken:   String,
  resetPasswordExpires: Date,
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password)
}

// ─── CATEGORY ──────────────────────────────────────────────────────────────
const categorySchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  slug:        { type: String, required: true, unique: true },
  description: String,
  image:       String,
  icon:        String,
}, { timestamps: true })

// ─── PRODUCT ───────────────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    String,
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: String,
}, { timestamps: true })

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images:      [{ type: String }],
  price:       { type: Number, required: true },
  originalPrice:    { type: Number },
  discount:    { type: Number, default: 0 },
  stock:       { type: Number, required: true, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 },
  },
  reviews:     [reviewSchema],
  featured:    { type: Boolean, default: false },
  bestseller:  { type: Boolean, default: false },
  weight:      Number,
  dimensions:  { length: Number, width: Number, height: Number },
  material:    String,
  color:       String,
  tags:        [String],
}, { timestamps: true })

productSchema.index({ title: 'text', description: 'text', tags: 'text' })

// ─── ORDER ─────────────────────────────────────────────────────────────────
const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:    String,
  image:    String,
  price:    { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
})

const orderSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:           [orderItemSchema],
  shippingAddress: {
    fullName: String, email: String, phone: String,
    line1: String, line2: String,
    city: String, state: String, pincode: String,
  },
  paymentMethod:     { type: String, enum: ['razorpay', 'cod'], required: true },
  paymentStatus:     { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId:   String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  subtotal:          { type: Number, required: true },
  shippingCharge:    { type: Number, default: 0 },
  tax:               { type: Number, default: 0 },
  discount:          { type: Number, default: 0 },
  couponCode:        String,
  totalAmount:       { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  deliveredAt: Date,
  notes:       String,
}, { timestamps: true })

// ─── COUPON ────────────────────────────────────────────────────────────────
const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType:  { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount:   { type: Number, default: 0 },
  maxUses:       { type: Number, default: 100 },
  usedCount:     { type: Number, default: 0 },
  active:        { type: Boolean, default: true },
  expiresAt:     Date,
}, { timestamps: true })

// ─── WISHLIST ──────────────────────────────────────────────────────────────
const wishlistSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true })

// ─── BANNER ────────────────────────────────────────────────────────────────
const bannerSchema = new mongoose.Schema({
  title:    String,
  subtitle: String,
  image:    { type: String, required: true },
  link:     String,
  active:   { type: Boolean, default: true },
  order:    { type: Number, default: 0 },
}, { timestamps: true })

// ─── CONTACT MESSAGE ───────────────────────────────────────────────────────
const contactMessageSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, required: true, trim: true },
  email:   { type: String, default: '', trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, default: '', trim: true },
  status:  { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true })

export const User           = mongoose.model('User',           userSchema)
export const Category       = mongoose.model('Category',       categorySchema)
export const Product        = mongoose.model('Product',        productSchema)
export const Order          = mongoose.model('Order',          orderSchema)
export const Coupon         = mongoose.model('Coupon',         couponSchema)
export const Wishlist       = mongoose.model('Wishlist',       wishlistSchema)
export const Banner         = mongoose.model('Banner',         bannerSchema)
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
