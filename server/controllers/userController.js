import { User, Order } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const total = await User.countDocuments()
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
    res.json({ success: true, users, total })
  } catch (err) { next(err) }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) throw new AppError('User not found', 404)
    const orderCount = await Order.countDocuments({ user: user._id })
    res.json({ success: true, user: { ...user.toObject(), orderCount } })
  } catch (err) { next(err) }
}

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { role: req.body.role }, { new: true }
    ).select('-password')
    if (!user) throw new AppError('User not found', 404)
    res.json({ success: true, user })
  } catch (err) { next(err) }
}

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'User deleted' })
  } catch (err) { next(err) }
}

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueResult] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      (await import('../models/index.js')).Product.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    // Recent orders for chart (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentOrders = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({ success: true, stats: { totalUsers, totalOrders, totalProducts, totalRevenue, recentOrders } })
  } catch (err) { next(err) }
}
