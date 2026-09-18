import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight, FiTag, FiCheckSquare, FiSquare } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartItems, selectCartTotal,
  removeFromCart, increaseQty, decreaseQty,
  applyCoupon, removeCoupon
} from '../redux/slices/cartSlice'
import { formatPrice, getImageUrl } from '../utils/helpers'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const cartTotals = useSelector(s => selectCartTotal(s))
  const couponCode = useSelector(s => s.cart.coupon)
  const couponDiscount = useSelector(s => s.cart.couponDiscount)
  const [couponInput, setCouponInput] = useState('')

  // Item selection state - default all items selected
  const [selectedIds, setSelectedIds] = useState(() => items.map(i => i._id))

  useEffect(() => {
    setSelectedIds(prev => {
      const existingIds = items.map(i => i._id)
      const valid = prev.filter(id => existingIds.includes(id))
      return valid.length > 0 ? valid : existingIds
    })
  }, [items])

  const toggleSelectItem = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map(i => i._id))
    }
  }

  // Calculate totals for selected items
  const selectedItems = items.filter(i => selectedIds.includes(i._id))
  const selectedSubtotal = selectedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const selectedShipping = selectedSubtotal > 5000 || selectedSubtotal === 0 ? 0 : 299
  const activeDiscount = selectedSubtotal > 0 ? Math.min(couponDiscount, selectedSubtotal) : 0
  const selectedTotal = Math.max(0, selectedSubtotal + selectedShipping - activeDiscount)

  const handleRemove = (id, title) => {
    dispatch(removeFromCart(id))
    setSelectedIds(prev => prev.filter(x => x !== id))
    toast.success(`Removed ${title} from cart`, {
      style: { background: '#3D2B1F', color: '#F5F0E8', borderRadius: '12px', fontFamily: 'DM Sans' },
    })
  }

  const handleBuySingleItem = (item) => {
    navigate('/checkout', { state: { checkoutItems: [item] } })
  }

  const handleProceedCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least 1 item to buy', {
        style: { background: '#3D2B1F', color: '#F5F0E8', borderRadius: '12px', fontFamily: 'DM Sans' },
      })
      return
    }
    navigate('/checkout', {
      state: {
        checkoutItems: selectedItems,
        couponCode: couponCode || undefined,
        discount: activeDiscount || 0,
      },
    })
  }

  const handleCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return

    try {
      const res = await api.post('/coupons/validate', { code, subtotal: selectedSubtotal || cartTotals.subtotal })
      const discountAmt = res.data.discountAmount
      dispatch(applyCoupon({ code, discount: discountAmt }))
      toast.success(`Coupon ${code} applied! Saved ₹${Math.round(discountAmt)}`, {
        style: { background: '#3D2B1F', color: '#F5F0E8', borderRadius: '12px', fontFamily: 'DM Sans' },
      })
      setCouponInput('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon code', {
        style: { background: '#fff', borderRadius: '12px', fontFamily: 'DM Sans' },
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen bg-linen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-10"
        >
          <FiShoppingBag className="w-20 h-20 text-sand mx-auto mb-6" />
          <h2 className="font-display text-3xl text-bark font-semibold mb-3">Your Cart is Empty</h2>
          <p className="font-body text-sand mb-8">Looks like you haven't added anything yet.</p>
          <Link to="/shop" className="btn-primary inline-block">Start Shopping</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <h1 className="font-display text-4xl text-bark font-semibold">
            Shopping Cart <span className="text-sand text-2xl font-normal">({items.length} items)</span>
          </h1>
          <p className="font-body text-xs text-sand">
            Tip: You can buy any single item directly or select items to checkout.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Column */}
          <div className="flex-1">
            {/* Select All Toggle Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3.5 shadow-card mb-4">
              <label className="flex items-center gap-3 cursor-pointer font-body text-sm font-medium text-bark select-none">
                <input
                  type="checkbox"
                  checked={selectedIds.length === items.length && items.length > 0}
                  onChange={handleToggleSelectAll}
                  className="w-4 h-4 accent-[#8B6914] rounded cursor-pointer"
                />
                <span>Select All ({items.length} items)</span>
              </label>
              <span className="font-body text-xs text-sand">
                <strong className="text-wood font-semibold">{selectedItems.length}</strong> of {items.length} selected for checkout
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map(item => {
                  const isChecked = selectedIds.includes(item._id)
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className={`bg-white rounded-2xl p-5 shadow-card transition-all flex flex-col sm:flex-row gap-4 border ${
                        isChecked ? 'border-wood/30' : 'border-transparent opacity-85'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <div className="flex items-center sm:self-center pr-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectItem(item._id)}
                          className="w-5 h-5 accent-[#8B6914] rounded cursor-pointer"
                          title="Select to include in checkout"
                        />
                      </div>

                      {/* Product Thumbnail */}
                      <Link to={`/product/${item.slug || item._id}`} className="flex-shrink-0 self-center sm:self-start">
                        <img
                          src={getImageUrl(item.images?.[0])}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded-xl bg-cream"
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-body text-xs text-wood uppercase tracking-wide mb-0.5">
                                {item.category?.name || item.category}
                              </p>
                              <Link to={`/product/${item.slug || item._id}`}>
                                <h3 className="font-display text-bark font-semibold text-base leading-snug hover:text-wood transition-colors">
                                  {item.title}
                                </h3>
                              </Link>
                            </div>
                            <button
                              onClick={() => handleRemove(item._id, item.title)}
                              className="text-sand hover:text-red-500 transition-colors p-1 flex-shrink-0"
                              title="Remove item"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Controls & Buy Single Item Button */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-sand/20">
                          {/* Qty controls */}
                          <div className="flex items-center gap-1 bg-cream rounded-full p-1">
                            <button
                              onClick={() => dispatch(decreaseQty(item._id))}
                              className="w-7 h-7 flex items-center justify-center rounded-full text-bark hover:bg-sand/50 transition-colors"
                              title="Decrease quantity"
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-body font-semibold text-sm text-bark">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(increaseQty(item._id))}
                              className="w-7 h-7 flex items-center justify-center rounded-full text-bark hover:bg-sand/50 transition-colors"
                              title="Increase quantity"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Quick Buy This Item Button */}
                          <button
                            type="button"
                            onClick={() => handleBuySingleItem(item)}
                            className="px-3.5 py-1.5 bg-wood/10 hover:bg-wood hover:text-cream text-wood font-body text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                            title="Buy only this item right now"
                          >
                            <span>Buy This Item</span>
                            <FiArrowRight className="w-3 h-3" />
                          </button>

                          {/* Item Price */}
                          <div className="text-right ml-auto">
                            <div className="font-display text-bark font-bold text-lg">{formatPrice(item.price * item.quantity)}</div>
                            {item.quantity > 1 && (
                              <div className="font-body text-xs text-sand">{formatPrice(item.price)} each</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-bark font-semibold">Order Summary</h2>
                <span className="font-body text-xs text-wood font-medium bg-wood/10 px-2.5 py-1 rounded-full">
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-bark/70">Selected Subtotal</span>
                  <span className="text-bark font-medium">{formatPrice(selectedSubtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-bark/70">Shipping</span>
                  <span className={selectedShipping === 0 ? 'text-green-600 font-medium' : 'text-bark font-medium'}>
                    {selectedShipping === 0 ? 'FREE' : formatPrice(selectedShipping)}
                  </span>
                </div>
                {activeDiscount > 0 && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <FiTag className="w-3.5 h-3.5" />
                      Coupon ({couponCode})
                    </span>
                    <span className="text-green-600 font-medium">-{formatPrice(activeDiscount)}</span>
                  </div>
                )}
                {selectedSubtotal > 0 && selectedSubtotal < 5000 && (
                  <p className="font-body text-xs text-sand">
                    Add {formatPrice(5000 - selectedSubtotal)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t border-sand/30 pt-4 mb-5">
                <div className="flex justify-between font-display text-lg">
                  <span className="text-bark font-semibold">Total</span>
                  <span className="text-bark font-bold">{formatPrice(selectedTotal)}</span>
                </div>
              </div>

              {/* Coupon Form */}
              {!couponCode ? (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="input-luxury flex-1 text-sm py-2.5"
                      onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                    />
                    <button onClick={handleCoupon} className="px-4 py-2 bg-cream border border-sand/50 rounded-xl font-body text-sm font-medium text-bark hover:bg-sand/30 transition-colors">
                      Apply
                    </button>
                  </div>
                  <p className="font-body text-xs text-sand mt-1">Try: WELCOME10, SAVE20, MVF15</p>
                </div>
              ) : (
                <div className="mb-5 flex items-center justify-between bg-green-50 rounded-xl px-4 py-2.5">
                  <span className="font-body text-sm text-green-700 flex items-center gap-2">
                    <FiTag className="w-4 h-4" /> {couponCode} applied
                  </span>
                  <button onClick={() => dispatch(removeCoupon())} className="text-green-700 hover:text-red-500">✕</button>
                </div>
              )}

              {/* Checkout Button for Selected Items */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                disabled={selectedItems.length === 0}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout ({selectedItems.length}) <FiArrowRight className="w-4 h-4" />
              </button>

              <Link to="/shop" className="block text-center font-body text-sm text-wood mt-4 hover:text-wood-dark transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
