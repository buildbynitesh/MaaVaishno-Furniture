import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiStar, FiZap } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../redux/slices/wishlistSlice'
import { setQuickViewProduct } from '../../redux/slices/uiSlice'
import { formatPrice, calcDiscount, getImageUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0 }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isWishlisted = useSelector(selectIsWishlisted(product._id))
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const discount =
  product.discount ||
  calcDiscount(
    product.price,
    product.originalPrice
  )
  const rating = product.ratings?.average || product.ratings || 4.5
  const ratingCount = product.ratings?.count || 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart(product))
    toast.success(`${product.title} added to cart!`, {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      iconTheme: { primary: '#C4A35A', secondary: '#F5F0E8' },
    })
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    dispatch(addToCart({ ...product, quantity: 1 }))
    navigate('/checkout', {
      state: {
        checkoutItems: [{ ...product, quantity: 1 }],
      },
    })
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(product))
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
    })
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(setQuickViewProduct(product))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.slug || product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-cream aspect-[4/3]">
          {!imageLoaded && <div className="absolute inset-0 skeleton" />}
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageLoaded(true)
              e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
            }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-wood text-cream text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
            {product.bestseller && (
              <span className="bg-bark text-cream text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                Bestseller
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-body font-semibold px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted
                ? 'bg-red-50 text-red-500 shadow-md scale-110'
                : 'bg-white/80 backdrop-blur-sm text-bark hover:bg-white hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Hover actions */}
          <div className={`absolute bottom-0 left-0 right-0 flex items-center gap-1.5 p-2.5 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-bark/95 backdrop-blur-sm text-cream py-2 px-1.5 rounded-xl font-body text-xs font-semibold hover:bg-bark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Add to Cart"
            >
              <FiShoppingCart className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 min-w-0 flex items-center justify-center gap-1 bg-wood hover:bg-wood-dark text-cream py-2 px-1.5 rounded-xl font-body text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              title="Buy Now"
            >
              <FiZap className="w-3.5 h-3.5 shrink-0 text-amber-200" />
              <span className="truncate">Buy Now</span>
            </button>
            <button
              onClick={handleQuickView}
              className="w-8 h-8 shrink-0 flex items-center justify-center bg-white/90 backdrop-blur-sm text-bark rounded-xl hover:bg-white hover:text-wood transition-colors shadow-sm"
              title="Quick View"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="font-body text-xs text-wood uppercase tracking-widest mb-1">{product.category?.name}</p>
          <h3 className="font-display text-bark font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-wood transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-sand'}`}
                />
              ))}
            </div>
            <span className="font-body text-xs text-sand">
              {rating} {ratingCount > 0 && `(${ratingCount})`}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-bark font-bold text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-body text-sand text-sm line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
