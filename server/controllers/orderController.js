import Razorpay from 'razorpay'
import crypto from 'crypto'
import { Order, Product, Coupon } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// Helper to deduct stock
const deductStock = async (items) => {
  for (const item of items) {
    const productId = item._id || item.product
    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: -Math.max(1, item.quantity || 1) }
      })
    }
  }
}

// Helper to restore stock
const restoreStock = async (items) => {
  for (const item of items) {
    const productId = item.product?._id || item.product
    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: Math.max(1, item.quantity || 1) }
      })
    }
  }
}

// @desc  Create Razorpay order
// @route POST /api/orders/create-razorpay
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpayInstance()
    if (!razorpay) {
      throw new AppError('Razorpay credentials not configured in .env', 500)
    }

    const { amount } = req.body
    if (!amount || amount <= 0) throw new AppError('Invalid amount', 400)

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    res.json({ success: true, ...order })
  } catch (err) {
    next(err)
  }
}

// @desc  Verify Razorpay payment & save order
// @route POST /api/orders/verify-payment
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items, address, total,
      couponCode, discount = 0,
    } = req.body

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new AppError('Payment verification failed — invalid signature', 400)
    }

    // Calculate totals
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingCharge = subtotal > 5000 ? 0 : 299
    const tax = 0
    const discountVal = Math.max(0, Number(discount) || 0)
    const totalAmount = Math.max(0, subtotal + shippingCharge - discountVal)

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product: i._id,
        title: i.title,
        image: i.images?.[0],
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress: address,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      subtotal,
      shippingCharge,
      tax: 0,
      discount: discountVal,
      couponCode: couponCode ? couponCode.toUpperCase().trim() : undefined,
      totalAmount,
      orderStatus: 'processing',
    })

    // Increment coupon used count if applicable
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase().trim() },
        { $inc: { usedCount: 1 } }
      )
    }

    // Deduct stock
    await deductStock(items)

    res.json({ success: true, orderId: order._id, order, message: 'Payment verified & order placed!' })
  } catch (err) {
    next(err)
  }
}

// @desc  Place COD order
// @route POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items, address, paymentMethod, couponCode, discount = 0 } = req.body

    if (!items || items.length === 0) {
      throw new AppError('No items in order', 400)
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shippingCharge = subtotal > 5000 ? 0 : 299
    const tax = 0
    const discountVal = Math.max(0, Number(discount) || 0)
    const totalAmount = Math.max(0, subtotal + shippingCharge - discountVal)

    const order = await Order.create({
      user: req.user._id,
      items: items.map(i => ({
        product: i._id,
        title: i.title,
        image: i.images?.[0],
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress: address,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal,
      shippingCharge,
      tax: 0,
      discount: discountVal,
      couponCode: couponCode ? couponCode.toUpperCase().trim() : undefined,
      totalAmount,
      orderStatus: 'pending',
    })

    // Increment coupon used count if applicable
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase().trim() },
        { $inc: { usedCount: 1 } }
      )
    }

    // Deduct stock
    await deductStock(items)

    res.status(201).json({ success: true, orderId: order._id, order })
  } catch (err) {
    next(err)
  }
}

// @desc  Cancel user order
// @route PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) throw new AppError('Order not found', 404)

    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      throw new AppError(`Cannot cancel an order that is already ${order.orderStatus}`, 400)
    }

    order.orderStatus = 'cancelled'
    await order.save()

    // Restore inventory stock
    await restoreStock(order.items)

    res.json({ success: true, message: 'Order cancelled successfully', order })
  } catch (err) {
    next(err)
  }
}

// @desc  Get user orders
// @route GET /api/orders/my
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'title images slug')
      .sort({ createdAt: -1 })
    res.json({ success: true, orders })
  } catch (err) {
    next(err)
  }
}

// @desc  Get all orders (admin)
// @route GET /api/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = status ? { orderStatus: status } : {}

    const total = await Order.countDocuments(query)
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    res.json({ success: true, orders, total })
  } catch (err) {
    next(err)
  }
}

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        ...(orderStatus === 'delivered' && { deliveredAt: new Date(), paymentStatus: 'paid' }),
      },
      { new: true }
    )
    if (!order) throw new AppError('Order not found', 404)
    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}
