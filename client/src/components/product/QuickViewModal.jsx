import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { setQuickViewProduct } from '../../redux/slices/uiSlice'
import { addToCart } from '../../redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../redux/slices/wishlistSlice'
import { formatPrice, getImageUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function QuickViewModal() {
  const dispatch = useDispatch()
  const product = useSelector(s => s.ui.quickViewProduct)
  const isWishlisted = useSelector(selectIsWishlisted(product?._id))

  if (!product) return null

  const handleClose = () => dispatch(setQuickViewProduct(null))
  const rating = product.ratings?.average || 4.5
  const ratingCount = product.ratings?.count || 0

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast.success('Added to cart!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-bark/50 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative bg-linen rounded-3xl shadow-luxury w-full max-w-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 bg-cream rounded-full flex items-center justify-center text-bark hover:bg-sand transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-2/5 bg-cream aspect-square sm:aspect-auto">
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <span className="font-body text-xs text-wood uppercase tracking-widest">{product.category?.name?.name}</span>
                <h2 className="font-display text-2xl font-semibold text-bark mt-2 mb-3">{product.title}</h2>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400 fill-current' : 'text-sand'}`} />
                    ))}
                  </div>
                  <span className="font-body text-sm text-sand">{rating} ({ratingCount} reviews)</span>
                </div>

                <p className="font-body text-sm text-bark/70 leading-relaxed mb-4 line-clamp-3">{product.description}</p>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="font-display text-3xl font-bold text-bark">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="font-body text-sand line-through text-lg">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-3"
                >
                  <FiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => { dispatch(toggleWishlist(product)) }}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-sand text-bark hover:border-wood hover:text-wood'}`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <Link
                to={`/product/${product.slug || product._id}`}
                onClick={handleClose}
                className="mt-3 text-center font-body text-sm text-wood hover:text-wood-dark underline underline-offset-2"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
