import { Banner } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

// @desc  Get active banners
// @route GET /api/banners
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, banners })
  } catch (err) { next(err) }
}

// @desc  Get all banners (admin)
// @route GET /api/banners/all
export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ order: 1 })
    res.json({ success: true, banners })
  } catch (err) { next(err) }
}

// @desc  Create banner (admin)
// @route POST /api/banners
export const createBanner = async (req, res, next) => {
  try {
    const image = req.file?.filename || req.body.image
    if (!image) throw new AppError('Banner image is required', 400)
    const banner = await Banner.create({ ...req.body, image })
    res.status(201).json({ success: true, banner })
  } catch (err) { next(err) }
}

// @desc  Update banner (admin)
// @route PUT /api/banners/:id
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!banner) throw new AppError('Banner not found', 404)
    res.json({ success: true, banner })
  } catch (err) { next(err) }
}

// @desc  Delete banner (admin)
// @route DELETE /api/banners/:id
export const deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Banner deleted' })
  } catch (err) { next(err) }
}
