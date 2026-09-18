import { Product, Category } from '../models/index.js'
import { AppError } from '../middleware/errorHandler.js'

// @desc Get all products
// @route GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      featured,
      bestseller,
      sale,
      sort = 'newest',
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
    } = req.query

    const query = {}

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    // Category
    if (category) {
      const cat = await Category.findOne({ slug: category })

      if (cat) {
        query.category = cat._id
      }
    }

    // Featured / Bestseller / Sale
    if (featured === 'true') query.featured = true
    if (bestseller === 'true') query.bestseller = true
    if (sale === 'true') query.discount = { $gt: 0 }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {}

      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { 'ratings.average': -1 },
      bestseller: { bestseller: -1 },
    }

    const total = await Product.countDocuments(query)

    const pages = Math.ceil(total / Number(limit))

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages,
    })
  } catch (err) {
    next(err)
  }
}

// @desc Get single product
// @route GET /api/products/:slug
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar')

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (err) {
    next(err)
  }
}

// @desc Create product
// @route POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      price,
      originalPrice,
      stock,
      material,
      color,
      tags,
      featured,
      bestseller,
      discount,
    } = req.body

    const images =
      req.files?.map((file) => file.filename) ||
      req.body.images ||
      []

    const product = await Product.create({
      title,
      slug,
      description,
      category,
      price,
      originalPrice,
      stock,
      material,
      color,
      tags,
      featured,
      bestseller,
      discount,
      images,
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (err) {
    next(err)
  }
}

// @desc Update product
// @route PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  } catch (err) {
    next(err)
  }
}

// @desc Delete product
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}

// @desc Add review
// @route POST /api/products/:id/reviews
export const addReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      throw new AppError('Product not found', 404)
    }

    const alreadyReviewed = product.reviews.find(
      (review) =>
        review.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      throw new AppError(
        'You already reviewed this product',
        400
      )
    }

    const { rating, comment } = req.body

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    }

    product.reviews.push(review)

    product.ratings.count = product.reviews.length

    product.ratings.average =
      product.reviews.reduce(
        (acc, item) => item.rating + acc,
        0
      ) / product.reviews.length

    await product.save()

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
    })
  } catch (err) {
    next(err)
  }
}