import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiTruck, FiCheck, FiLock } from 'react-icons/fi'
import { selectCartItems, selectCartTotal, clearCart, removeFromCart } from '../redux/slices/cartSlice'
import { updateUser } from '../redux/slices/authSlice'
import { formatPrice, getImageUrl } from '../utils/helpers'
import api from '../api/axios'
import toast from 'react-hot-toast'

const STEPS = ['Address', 'Payment', 'Confirm']

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartItems = useSelector(selectCartItems)
  const cartTotalData = useSelector(s => selectCartTotal(s))
  const { user } = useSelector(s => s.auth)

  // Use passed checkout items (e.g. single item or selected items) if available, else all cart items
  const isCustomSelection = Boolean(location.state?.checkoutItems && location.state.checkoutItems.length > 0)
  const items = isCustomSelection ? location.state.checkoutItems : cartItems

  // Calculate totals for currently checking out items
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 299
  const reduxCoupon = useSelector((s) => s.cart.coupon)
  const couponCode = location.state?.couponCode !== undefined ? location.state.couponCode : reduxCoupon
  const discount = location.state?.discount !== undefined ? location.state.discount : cartTotalData.discount
  const total = Math.max(0, subtotal + shipping - discount)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  })

  // Keep address synchronized with user profile
  useEffect(() => {
    if (user) {
      setAddress({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        line1: user.address?.line1 || '',
        line2: user.address?.line2 || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      })
    }
  }, [user])

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const handleAddressSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    const required = ['fullName', 'email', 'phone', 'line1', 'city', 'state', 'pincode']
    const missing = required.find(f => !address[f]?.trim())
    if (missing) {
      toast.error('Please fill all required address fields', {
        style: { background: '#fff', color: '#3D2B1F', fontFamily: 'DM Sans', borderRadius: '12px' }
      })
      return
    }

    // Auto-save address to user profile in backend if user is authenticated
    if (user) {
      try {
        const res = await api.put('/auth/profile', {
          name: address.fullName,
          phone: address.phone,
          address: {
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
        })
        if (res.data?.user) {
          dispatch(updateUser(res.data.user))
        }
      } catch {
        // silent fallback
      }
    }

    setStep(1)
    toast.success('Shipping address confirmed!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      iconTheme: { primary: '#C4A35A', secondary: '#F5F0E8' },
    })
  }

  const loadRazorpay = () => new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      if (paymentMethod === 'razorpay') {
        const loaded = await loadRazorpay()
        if (!loaded) { toast.error('Payment gateway failed to load'); setLoading(false); return }

        // Create order on backend
        let razorpayOrder
        try {
          const { data } = await api.post('/orders/create-razorpay', { amount: total })
          razorpayOrder = data
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to initiate payment. Please try COD.')
          setLoading(false)
          return
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SqXJjhjqjZPaHD',
          amount: razorpayOrder.amount,
          currency: 'INR',
          name: 'maaVaishno Furniture',
          description: `Order for ${items.length} items`,
          order_id: razorpayOrder.id,
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          theme: { color: '#8B6914' },
          handler: async (response) => {
            try {
              const res = await api.post('/orders/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items, address, total,
                couponCode,
                discount,
              })
              const realOrderId = res.data?.orderId || res.data?.order?._id || ('MVF' + Date.now().toString().slice(-8))
              if (isCustomSelection) {
                items.forEach(i => dispatch(removeFromCart(i._id)))
              } else {
                dispatch(clearCart())
              }
              setLoading(false)
              navigate('/order-success', { state: { orderId: realOrderId, total, paymentMethod: 'razorpay', items } })
            } catch (vErr) {
              toast.error(vErr.response?.data?.message || 'Payment verification failed')
              setLoading(false)
            }
          },
          modal: { ondismiss: () => setLoading(false) },
        }

        new window.Razorpay(options).open()
      } else {
        // COD
        const res = await api.post('/orders', {
          items,
          address,
          paymentMethod: 'cod',
          total,
          couponCode,
          discount,
        })
        const realOrderId = res.data?.orderId || res.data?.order?._id || ('MVF' + Date.now().toString().slice(-8))
        if (isCustomSelection) {
          items.forEach(i => dispatch(removeFromCart(i._id)))
        } else {
          dispatch(clearCart())
        }
        setLoading(false)
        navigate('/order-success', { state: { orderId: realOrderId, total, paymentMethod: 'cod', items } })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="font-display text-4xl text-bark font-semibold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-wood' : 'text-sand'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold border-2 transition-all ${i < step ? 'bg-wood border-wood text-cream' : i === step ? 'border-wood text-wood' : 'border-sand text-sand'}`}>
                  {i < step ? <FiCheck className="w-4 h-4" /> : i + 1}
                </div>
                <span className="font-body text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px mx-2 ${i < step ? 'bg-wood' : 'bg-sand/50'}`} />}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1">
            {/* Step 0: Address */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiTruck className="w-5 h-5 text-wood" />
                  <h2 className="font-display text-xl text-bark font-semibold">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Full Name *</label>
                    <input autoComplete="off" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} className="input-luxury" placeholder="As on Aadhaar" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Email *</label>
                    <input type="email" autoComplete="off" value={address.email} onChange={e => setAddress(a => ({ ...a, email: e.target.value }))} className="input-luxury" placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Phone *</label>
                    <input type="tel" autoComplete="off" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} className="input-luxury" placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Pincode *</label>
                    <input autoComplete="off" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} className="input-luxury" placeholder="110001" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Address Line 1 *</label>
                    <input autoComplete="off" value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} className="input-luxury" placeholder="House/Flat No., Street" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Address Line 2</label>
                    <input autoComplete="off" value={address.line2} onChange={e => setAddress(a => ({ ...a, line2: e.target.value }))} className="input-luxury" placeholder="Area, Landmark (optional)" />
                  </div>
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">City *</label>
                    <input autoComplete="off" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} className="input-luxury" placeholder="New Delhi" required />
                  </div>
                  <div>
                    <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">State *</label>
                    <input autoComplete="off" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} className="input-luxury" placeholder="Delhi" required />
                  </div>
                  <div className="sm:col-span-2 mt-2">
                    <button type="button" onClick={handleAddressSubmit} className="btn-primary w-full">Continue to Payment</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FiCreditCard className="w-5 h-5 text-wood" />
                  <h2 className="font-display text-xl text-bark font-semibold">Payment Method</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { value: 'razorpay', label: 'Pay Online', desc: 'Cards, UPI, Net Banking, Wallets — via Razorpay', icon: '💳' },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-wood bg-cream/50' : 'border-sand/50 hover:border-sand'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="accent-wood" />
                      <span className="text-2xl">{opt.icon}</span>
                      <div>
                        <p className="font-body text-sm font-semibold text-bark">{opt.label}</p>
                        <p className="font-body text-xs text-sand">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1 text-sm">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 text-sm">Review Order →</button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-display text-xl text-bark font-semibold mb-5">Order Review</h2>
                <div className="bg-cream rounded-xl p-4 mb-4">
                  <p className="font-body text-xs text-sand uppercase tracking-widest mb-2">Shipping to</p>
                  <p className="font-body text-sm text-bark font-medium">{address.fullName}</p>
                  <p className="font-body text-sm text-bark/70">{address.line1}{address.line2 ? ', ' + address.line2 : ''}</p>
                  <p className="font-body text-sm text-bark/70">{address.city}, {address.state} — {address.pincode}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 mb-6">
                  <p className="font-body text-xs text-sand uppercase tracking-widest mb-2">Payment</p>
                  <p className="font-body text-sm text-bark font-medium">
                    {paymentMethod === 'razorpay' ? '💳 Online Payment (Razorpay)' : '💵 Cash on Delivery'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1 text-sm">← Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <><FiLock className="w-4 h-4" /> Place Order — {formatPrice(total)}</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-display text-lg text-bark font-semibold mb-4">
                Order Summary ({items.length} items)
              </h3>
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item._id} className="flex gap-3">
                    <img src={getImageUrl(item.images?.[0])} alt={item.title} className="w-14 h-14 object-cover rounded-xl bg-cream flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-bark font-medium line-clamp-1">{item.title}</p>
                      <p className="font-body text-xs text-sand">Qty: {item.quantity}</p>
                      <p className="font-body text-sm font-semibold text-bark">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand/30 pt-4 space-y-2">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-bark/60">Subtotal</span><span className="text-bark">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-bark/60">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : 'text-bark'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-body text-sm text-green-600 font-medium">
                    <span>Coupon ({couponCode || 'Applied'})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg pt-2 border-t border-sand/30 mt-2">
                  <span className="text-bark font-semibold">Total</span>
                  <span className="text-bark font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
