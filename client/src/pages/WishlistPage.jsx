import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromWishlist, selectWishlistItems } from '../redux/slices/wishlistSlice'
import { addToCart } from '../redux/slices/cartSlice'
import { formatPrice, getImageUrl } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector(selectWishlistItems)

  const handleMoveToCart = (item) => {
    dispatch(addToCart(item))
    dispatch(removeFromWishlist(item._id))
    toast.success('Moved to cart!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
    })
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-linen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-10">
          <FiHeart className="w-20 h-20 text-sand mx-auto mb-6" />
          <h2 className="font-display text-3xl text-bark font-semibold mb-3">Your Wishlist is Empty</h2>
          <p className="font-body text-sand mb-8">Save your favourite pieces here and come back to them anytime.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Explore Products <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-bark font-semibold">My Wishlist</h1>
            <p className="font-body text-sand mt-1">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group"
              >
                <Link to={`/product/${item.slug || item._id}`} className="block relative aspect-[4/3] bg-cream overflow-hidden">
                  <img
                    src={getImageUrl(item.images?.[0])}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); dispatch(removeFromWishlist(item._id)) }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-600 transition-colors shadow"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </Link>

                <div className="p-4">
                  <p className="font-body text-xs text-wood uppercase tracking-widest mb-1">{item.category?.name}</p>
                  <h3 className="font-display text-bark font-semibold text-sm leading-snug mb-3 line-clamp-2">{item.title}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display text-bark font-bold text-lg">{formatPrice(item.price)}</span>
                    {item.originalPrice > item.price && (
                      <span className="font-body text-sand text-sm line-through">{formatPrice(item.originalPrice)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full flex items-center justify-center gap-2 bg-bark text-cream py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-wood-dark transition-colors"
                  >
                    <FiShoppingCart className="w-4 h-4" /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
