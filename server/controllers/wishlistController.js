import { Wishlist } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

// @desc  Get user wishlist
// @route GET /api/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'title slug images price originalPrice discount ratings stock category')
    res.json({ success: true, products: wishlist?.products || [] })
  } catch (err) { next(err) }
}

// @desc  Toggle product in wishlist (add/remove)
// @route POST /api/wishlist/toggle
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body
    let wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [productId] })
      return res.json({ success: true, action: 'added', wishlist })
    }

    const isInWishlist = wishlist.products.includes(productId)
    if (isInWishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId)
    } else {
      wishlist.products.push(productId)
    }

    await wishlist.save()
    res.json({ success: true, action: isInWishlist ? 'removed' : 'added' })
  } catch (err) { next(err) }
}

// @desc  Clear wishlist
// @route DELETE /api/wishlist
export const clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.user._id }, { products: [] })
    res.json({ success: true, message: 'Wishlist cleared' })
  } catch (err) { next(err) }
}
