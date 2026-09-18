import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiStar,
  FiTruck,
  FiShield,
  FiPlus,
  FiMinus,
  FiMapPin,
  FiCheck,
  FiMessageSquare,
  FiUser,
  FiZap,
} from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import api from '../api/axios'
import { addToCart } from '../redux/slices/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../redux/slices/wishlistSlice'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, getImageUrl } from '../utils/helpers'
import toast from 'react-hot-toast'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('description')

  // Pincode Delivery Checker State
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState(null)

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  // FETCH PRODUCT
  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${slug}`)
      const foundProduct = res.data.product
      setProduct(foundProduct)

      // Fetch related products
      const relatedRes = await api.get('/products?limit=8')
      const relatedProducts = (relatedRes.data.products || [])
        .filter((p) => p.category?._id === foundProduct.category?._id && p._id !== foundProduct._id)
        .slice(0, 4)
      setRelated(relatedProducts)
    } catch (error) {
      console.error(error)
    }
  }

  const isWishlisted = useSelector(selectIsWishlisted(product?._id))
  const rating = product?.ratings?.average || 4.5
  const ratingCount = product?.ratings?.count || 0

  // ADD TO CART
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }))
    toast.success(`${product.title} (${qty}) added to cart!`, {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      iconTheme: { primary: '#C4A35A', secondary: '#F5F0E8' },
    })
  }

  const handleBuyNow = () => {
    if (product.stock === 0) return
    dispatch(addToCart({ ...product, quantity: qty }))
    navigate('/checkout', {
      state: {
        checkoutItems: [{ ...product, quantity: qty }],
      },
    })
  }

  // CHECK PINCODE
  const handleCheckPincode = (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error('Please enter a valid 6-digit Indian pincode')
      return
    }
    const days = Math.floor(Math.random() * 3) + 3 // 3-5 days
    const deliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    setPincodeStatus({
      pincode: pincode.trim(),
      dateString: deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      free: product.price >= 5000,
    })
  }

  // SUBMIT REVIEW
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review')
      return
    }
    if (!reviewComment.trim()) {
      toast.error('Please enter your review comments')
      return
    }

    setSubmittingReview(true)
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      })
      toast.success('Review submitted successfully!', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
      setReviewComment('')
      fetchProduct()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  // LOADING STATE
  if (product === null) {
    return (
      <div className="pt-28 min-h-screen bg-linen flex items-center justify-center">
        <p className="font-display text-2xl text-bark animate-pulse">Loading Product Details...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="pt-28 min-h-screen bg-linen flex items-center justify-center text-center p-6">
        <div>
          <h2 className="font-display text-3xl text-bark mb-4">Product Not Found</h2>
          <Link to="/shop" className="btn-primary inline-block">Back to Shop</Link>
        </div>
      </div>
    )
  }

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80']

  return (
    <div className="pt-24 min-h-screen bg-linen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 font-body text-xs text-sand mb-8 flex-wrap">
          <Link to="/" className="hover:text-wood">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-wood">Shop</Link>
          <span>/</span>
          {product.category?.slug && (
            <>
              <Link to={`/categories/${product.category.slug}`} className="hover:text-wood">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-bark font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* MAIN PRODUCT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* IMAGE GALLERY */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-card mb-4 border border-sand/30">
              <img
                src={getImageUrl(images[activeImg])}
                alt={product.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
                }}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.discount > 0 && (
                <span className="badge-discount">{product.discount}% OFF</span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImg === i ? 'border-wood ring-2 ring-wood/20 scale-105' : 'border-sand/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT DETAILS */}
          <div>
            <span className="font-body text-xs font-semibold text-wood uppercase tracking-widest block mb-2">
              {product.category?.name || 'Luxury Furniture'}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl text-bark font-bold mb-3 leading-tight">
              {product.title}
            </h1>

            {/* RATING */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-1 text-wood">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-current' : 'opacity-30'}`}
                  />
                ))}
              </div>
              <span className="font-body text-xs font-semibold text-bark">{rating.toFixed(1)}</span>
              <span className="text-sand text-xs">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="font-body text-xs text-sand hover:text-wood underline underline-offset-2"
              >
                {ratingCount} customer {ratingCount === 1 ? 'review' : 'reviews'}
              </button>
            </div>

            {/* PRICE */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-display text-3xl sm:text-4xl font-bold text-bark">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-body text-lg text-sand line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="font-body text-bark/80 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* STOCK INDICATOR */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <FiCheck className="w-3.5 h-3.5" /> In Stock {product.stock <= 5 && `(Only ${product.stock} units left)`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  Out of Stock
                </span>
              )}
            </div>

            {/* QUANTITY & ACTIONS */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-white border border-sand/50 rounded-full p-1 shadow-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-bark hover:bg-sand/30 transition-colors"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-display font-semibold text-bark text-base">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-bark hover:bg-sand/30 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-outline flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiZap className="w-4 h-4 text-wood-light" /> Buy Now
              </button>

              <button
                onClick={() => dispatch(toggleWishlist(product))}
                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-sand/60 text-bark hover:border-wood hover:text-wood'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* PINCODE ESTIMATOR */}
            <div className="bg-white rounded-2xl p-5 border border-sand/30 shadow-card mb-8">
              <div className="flex items-center gap-2 mb-2 font-display text-sm font-semibold text-bark">
                <FiMapPin className="w-4 h-4 text-wood" /> Check Delivery to Your Pincode
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit Pincode"
                  className="input-luxury flex-1 text-sm py-2 px-3"
                />
                <button type="submit" className="btn-primary text-xs px-5 py-2">
                  Check
                </button>
              </form>

              {pincodeStatus && (
                <div className="mt-3 text-xs font-body text-bark/80 space-y-1 bg-cream/40 p-3 rounded-xl border border-sand/20">
                  <p className="text-green-700 font-semibold flex items-center gap-1.5">
                    <FiCheck className="w-3.5 h-3.5" /> Delivery available to {pincodeStatus.pincode}
                  </p>
                  <p>Estimated Delivery by <strong>{pincodeStatus.dateString}</strong></p>
                  <p className="text-sand">
                    {pincodeStatus.free ? '✓ Free Shipping Eligible' : 'Standard Shipping ₹299 (Free on ₹5,000+)'}
                  </p>
                </div>
              )}
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FiTruck, title: 'Free Delivery', sub: 'On orders ₹5000+' },
                { icon: FiShield, title: '5 Year Warranty', sub: 'Solid wood guarantee' },
                { icon: FiShare2, title: 'Easy Returns', sub: '7 days hassle-free' },
              ].map((badge) => (
                <div key={badge.title} className="bg-cream/60 rounded-2xl p-3 text-center border border-sand/20">
                  <badge.icon className="w-5 h-5 text-wood mx-auto mb-1" />
                  <p className="font-body text-xs text-bark font-semibold">{badge.title}</p>
                  <p className="font-body text-[11px] text-sand">{badge.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS: Description, Specifications, Reviews */}
        <div className="bg-white rounded-3xl shadow-card border border-sand/30 overflow-hidden mb-16">
          <div className="flex border-b border-sand/20 bg-cream/30">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-body text-sm font-semibold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-wood text-wood bg-white shadow-sm'
                    : 'border-transparent text-sand hover:text-bark'
                }`}
              >
                {tab === 'reviews' ? `Customer Reviews (${ratingCount})` : tab}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {/* Tab 1: Description */}
            {activeTab === 'description' && (
              <div className="max-w-3xl font-body text-bark/80 leading-relaxed space-y-4">
                <p>{product.description}</p>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 flex-wrap">
                    <span className="text-xs text-sand uppercase tracking-wider font-semibold">Tags:</span>
                    {product.tags.map((t) => (
                      <span key={t} className="bg-cream text-bark text-xs px-3 py-1 rounded-full border border-sand/30">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Specifications */}
            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cream/30 p-4 rounded-2xl border border-sand/20">
                    <span className="font-body text-xs text-sand uppercase tracking-wider block mb-1">Material</span>
                    <span className="font-body text-sm font-semibold text-bark">{product.material || 'Solid Teak Wood'}</span>
                  </div>
                  <div className="bg-cream/30 p-4 rounded-2xl border border-sand/20">
                    <span className="font-body text-xs text-sand uppercase tracking-wider block mb-1">Color / Finish</span>
                    <span className="font-body text-sm font-semibold text-bark">{product.color || 'Natural Walnut'}</span>
                  </div>
                  <div className="bg-cream/30 p-4 rounded-2xl border border-sand/20">
                    <span className="font-body text-xs text-sand uppercase tracking-wider block mb-1">Category</span>
                    <span className="font-body text-sm font-semibold text-bark">{product.category?.name || 'Living'}</span>
                  </div>
                  <div className="bg-cream/30 p-4 rounded-2xl border border-sand/20">
                    <span className="font-body text-xs text-sand uppercase tracking-wider block mb-1">Warranty</span>
                    <span className="font-body text-sm font-semibold text-bark">5 Years Manufacturer Warranty</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Customer Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-10">
                {/* Review Header & Stats */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-sand/20">
                  <div className="text-center sm:text-left">
                    <div className="font-display text-5xl font-bold text-bark">{rating.toFixed(1)}</div>
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-wood my-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-current' : 'opacity-30'}`} />
                      ))}
                    </div>
                    <p className="font-body text-xs text-sand">Based on {ratingCount} verified reviews</p>
                  </div>

                  <div className="flex-1 max-w-xs text-xs font-body text-sand space-y-1.5">
                    <p className="text-bark/80 font-medium">100% Genuine reviews from verified furniture buyers</p>
                    <p>All reviews are validated against delivered orders.</p>
                  </div>
                </div>

                {/* Write a Review Form */}
                <div className="bg-cream/40 p-6 sm:p-8 rounded-3xl border border-sand/30">
                  <h4 className="font-display text-lg text-bark font-semibold mb-2">Write a Customer Review</h4>
                  {!isAuthenticated ? (
                    <p className="font-body text-sm text-sand">
                      Please <Link to="/login" className="text-wood font-semibold underline">Log in</Link> to share your experience with this furniture piece.
                    </p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-2xl text-wood focus:outline-none hover:scale-110 transition-transform"
                            >
                              <FiStar className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-sand'}`} />
                            </button>
                          ))}
                          <span className="font-body text-xs font-semibold text-bark ml-2">
                            {reviewRating} of 5 stars
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                          Your Review
                        </label>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share details about the quality, finish, and packaging..."
                          className="input-luxury text-sm"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn-primary text-xs py-2.5 px-6 disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((r, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-white border border-sand/20 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cream text-wood flex items-center justify-center font-bold text-xs">
                              {r.name ? r.name[0].toUpperCase() : 'U'}
                            </div>
                            <span className="font-body text-sm font-semibold text-bark">{r.name || 'Verified Buyer'}</span>
                          </div>
                          <div className="flex text-wood text-xs">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <FiStar key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? 'fill-current' : 'text-sand/40'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="font-body text-xs text-bark/80 leading-relaxed pl-10">{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 font-body text-sm text-sand">
                      No reviews yet. Be the first to review this furniture!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl sm:text-3xl text-bark font-semibold mb-8">
              Complementary Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* STICKY MOBILE BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-sand/30 p-3 sm:hidden z-40 flex items-center justify-between gap-3 shadow-lg">
        <div className="min-w-0 flex-1">
          <p className="font-body text-xs font-semibold text-bark truncate">{product.title}</p>
          <p className="font-display text-sm font-bold text-wood">{formatPrice(product.price)}</p>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn-primary text-xs py-2.5 px-6 whitespace-nowrap flex items-center gap-1.5"
        >
          <FiShoppingCart className="w-3.5 h-3.5" /> Add
        </button>
      </div>
    </div>
  )
}