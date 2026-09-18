import { Coupon } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

// @desc  Validate coupon code
// @route POST /api/coupons/validate
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body
    if (!code || !code.trim()) {
      throw new AppError('Coupon code is required', 400)
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      active: true,
    })

    if (!coupon) throw new AppError('Invalid or inactive coupon code', 400)
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new AppError('Coupon has expired', 400)
    }
    if (coupon.usedCount >= coupon.maxUses) {
      throw new AppError('Coupon usage limit reached', 400)
    }

    const orderSubtotal = Number(subtotal) || 0
    const minOrder = Number(coupon.minOrderValue) || 0
    if (orderSubtotal < minOrder) {
      throw new AppError(`Minimum order of ₹${minOrder.toLocaleString('en-IN')} required for this coupon`, 400)
    }

    let discountAmount = coupon.discountType === 'percentage'
      ? (orderSubtotal * coupon.discountValue) / 100
      : coupon.discountValue

    // Cap at maxDiscount if defined
    if (coupon.maxDiscount && coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount)
    }

    discountAmount = Math.min(discountAmount, orderSubtotal)

    res.json({
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscount: coupon.maxDiscount || 0,
      minOrderValue: coupon.minOrderValue || 0,
      discountAmount: Math.round(discountAmount * 100) / 100,
    })
  } catch (err) {
    next(err)
  }
}

// @desc  Get all coupons (admin)
// @route GET /api/coupons
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    // Ensure both frontend-friendly keys and DB schema keys are present
    const normalized = coupons.map((c) => {
      const obj = c.toObject()
      return {
        ...obj,
        discount: obj.discountValue,
        minAmount: obj.minOrderValue,
      }
    })
    res.json({ success: true, coupons: normalized })
  } catch (err) { next(err) }
}

// @desc  Create coupon (admin)
// @route POST /api/coupons
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discount,
      discountValue,
      discountType = 'percentage',
      minAmount,
      minOrderValue,
      maxDiscount,
      maxUses = 100,
      expiresAt,
    } = req.body

    if (!code || !code.trim()) {
      throw new AppError('Coupon code is required', 400)
    }

    const normalizedCode = code.trim().toUpperCase()
    const finalDiscountValue = Number(discountValue ?? discount)

    if (isNaN(finalDiscountValue) || finalDiscountValue <= 0) {
      throw new AppError('Valid discount value is required', 400)
    }

    if (discountType === 'percentage' && finalDiscountValue > 100) {
      throw new AppError('Percentage discount cannot exceed 100%', 400)
    }

    const existing = await Coupon.findOne({ code: normalizedCode })
    if (existing) {
      throw new AppError(`Coupon code "${normalizedCode}" already exists`, 400)
    }

    const coupon = await Coupon.create({
      code: normalizedCode,
      discountType,
      discountValue: finalDiscountValue,
      minOrderValue: Number(minOrderValue ?? minAmount) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      maxUses: Number(maxUses) || 100,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      active: true,
    })

    const responseCoupon = {
      ...coupon.toObject(),
      discount: coupon.discountValue,
      minAmount: coupon.minOrderValue,
    }

    res.status(201).json({ success: true, coupon: responseCoupon })
  } catch (err) { next(err) }
}

// @desc  Update coupon (admin)
// @route PUT /api/coupons/:id
export const updateCoupon = async (req, res, next) => {
  try {
    const updateData = { ...req.body }
    if (updateData.code) updateData.code = updateData.code.trim().toUpperCase()
    if (updateData.discount !== undefined) updateData.discountValue = Number(updateData.discount)
    if (updateData.minAmount !== undefined) updateData.minOrderValue = Number(updateData.minAmount)

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!coupon) throw new AppError('Coupon not found', 404)

    const responseCoupon = {
      ...coupon.toObject(),
      discount: coupon.discountValue,
      minAmount: coupon.minOrderValue,
    }

    res.json({ success: true, coupon: responseCoupon })
  } catch (err) { next(err) }
}

// @desc  Delete coupon (admin)
// @route DELETE /api/coupons/:id
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id)
    if (!coupon) throw new AppError('Coupon not found', 404)
    res.json({ success: true, message: 'Coupon deleted successfully' })
  } catch (err) { next(err) }
}
