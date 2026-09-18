import { Category, Product } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    // Add product count
    const withCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id })
        return { ...cat.toObject(), count }
      })
    )
    res.json({ success: true, categories: withCounts })
  } catch (err) { next(err) }
}

export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
    if (!category) throw new AppError('Category not found', 404)
    res.json({ success: true, category })
  } catch (err) { next(err) }
}

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json({ success: true, category })
  } catch (err) { next(err) }
}

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) throw new AppError('Category not found', 404)
    res.json({ success: true, category })
  } catch (err) { next(err) }
}

export const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Category deleted' })
  } catch (err) { next(err) }
}
