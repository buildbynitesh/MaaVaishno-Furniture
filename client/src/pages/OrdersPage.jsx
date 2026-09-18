import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiPackage,
  FiClock,
  FiCheck,
  FiTruck,
  FiX,
  FiPrinter,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi'
import { useSelector } from 'react-redux'
import api from '../api/axios'
import { formatPrice, getImageUrl } from '../utils/helpers'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: {
    label: 'Order Placed',
    color: 'bg-amber-100 text-amber-800 border border-amber-200',
    icon: FiClock,
    step: 1,
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-800 border border-blue-200',
    icon: FiClock,
    step: 2,
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    icon: FiTruck,
    step: 3,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border border-green-200',
    icon: FiCheck,
    step: 4,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border border-red-200',
    icon: FiX,
    step: 0,
  },
}

const STEPS = ['Placed', 'Processing', 'Shipped', 'Delivered']

export default function OrdersPage() {
  const { isAuthenticated } = useSelector((s) => s.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await api.get('/orders/my')
      setOrders(res.data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setCancellingId(orderId)
    try {
      await api.put(`/orders/${orderId}/cancel`)
      toast.success('Order cancelled successfully', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
      fetchOrders()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancellingId(null)
    }
  }

  const handlePrintInvoice = (order) => {
    const printWindow = window.open('', '_blank')
    const html = `
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #3D2B1F; }
            .header { border-bottom: 2px solid #8B6914; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            .title { font-size: 24px; font-weight: bold; color: #3D2B1F; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background: #F5F0E8; }
            .total { text-align: right; margin-top: 30px; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">maaVaishno Furniture</div>
              <p>Luxury Living, Handcrafted For You</p>
              <p>Order ID: ${order._id}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
            <div style="text-align: right;">
              <h3>INVOICE</h3>
              <p>Status: ${order.orderStatus.toUpperCase()}</p>
              <p>Payment: ${order.paymentMethod.toUpperCase()}</p>
            </div>
          </div>
          <h4>Delivery Address:</h4>
          <p>${order.shippingAddress?.fullName || ''}<br/>
          ${order.shippingAddress?.line1 || ''}, ${order.shippingAddress?.line2 || ''}<br/>
          ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}<br/>
          Phone: ${order.shippingAddress?.phone || ''}</p>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(i => `
                <tr>
                  <td>${i.title}</td>
                  <td>${i.quantity}</td>
                  <td>₹${i.price}</td>
                  <td>₹${i.price * i.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Subtotal: ₹${order.subtotal}</p>
            <p>Shipping: ₹${order.shippingCharge}</p>
            ${order.discount ? `<p style="color: green;">Discount: -₹${order.discount}</p>` : ''}
            <p style="color: #8B6914; font-size: 20px;">Total Paid: ₹${order.totalAmount}</p>
          </div>
          <p style="margin-top: 50px; text-align: center; color: #888; font-size: 12px;">Thank you for shopping with maaVaishno Furniture!</p>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="pt-24 min-h-screen bg-linen pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-bark font-semibold">
              My Orders
            </h1>
            <p className="font-body text-sand text-sm mt-1">
              Track, view details, and manage your furniture purchases
            </p>
          </div>
          <Link to="/shop" className="btn-outline text-xs sm:text-sm py-2 px-5 hidden sm:flex items-center gap-1.5">
            Browse More <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl p-10 border border-sand/30 shadow-card">
            <p className="font-display text-xl text-bark animate-pulse">
              Loading your orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl p-10 border border-sand/30 shadow-card">
            <FiPackage className="w-16 h-16 text-sand mx-auto mb-4" />
            <h3 className="font-display text-2xl text-bark mb-2">No Orders Yet</h3>
            <p className="font-body text-sand mb-6 max-w-sm mx-auto text-sm">
              You haven't placed any furniture orders yet. Discover our latest collections.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-sm">
              Start Shopping <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, i) => {
              const sc = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending
              const StatusIcon = sc.icon
              const currentStep = sc.step
              const isCancellable = order.orderStatus === 'pending' || order.orderStatus === 'processing'

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-3xl shadow-card overflow-hidden border border-sand/30"
                >
                  {/* HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-sand/20 bg-cream/40">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                      <div>
                        <p className="font-body text-xs text-sand uppercase tracking-wider">Order ID</p>
                        <p className="font-body text-sm font-semibold text-bark font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>

                      <div>
                        <p className="font-body text-xs text-sand uppercase tracking-wider">Date Placed</p>
                        <p className="font-body text-sm text-bark">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="font-body text-xs text-sand uppercase tracking-wider">Total Amount</p>
                        <p className="font-display text-base font-bold text-bark">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-body text-xs font-semibold ${sc.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL ORDER STEPPER (For active orders) */}
                  {order.orderStatus !== 'cancelled' && (
                    <div className="px-6 py-4 bg-linen/50 border-b border-sand/20">
                      <div className="flex items-center justify-between max-w-xl mx-auto relative">
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-sand/30 -translate-y-1/2 z-0" />
                        {STEPS.map((stepName, idx) => {
                          const isDone = currentStep >= idx + 1
                          const isCurrent = currentStep === idx + 1
                          return (
                            <div key={stepName} className="flex flex-col items-center relative z-10">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-wood text-cream shadow-sm'
                                    : isCurrent
                                    ? 'bg-bark text-cream ring-4 ring-sand/40'
                                    : 'bg-sand/40 text-bark/60'
                                }`}
                              >
                                {isDone ? <FiCheck className="w-3.5 h-3.5" /> : idx + 1}
                              </div>
                              <span className={`font-body text-xs mt-1.5 ${isDone || isCurrent ? 'text-bark font-semibold' : 'text-sand'}`}>
                                {stepName}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ITEMS LIST */}
                  <div className="px-6 py-4 divide-y divide-sand/15">
                    {order.items?.map((item, j) => (
                      <div key={j} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={getImageUrl(item.product?.images?.[0] || item.image)}
                          alt={item.product?.title || item.title}
                          className="w-16 h-16 object-cover rounded-2xl bg-cream flex-shrink-0 border border-sand/20"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.product?.slug || ''}`}
                            className="font-body text-sm font-semibold text-bark hover:text-wood transition-colors block truncate"
                          >
                            {item.product?.title || item.title}
                          </Link>
                          <p className="font-body text-xs text-sand mt-0.5">
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <p className="font-display text-sm font-bold text-bark">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER & ACTIONS */}
                  <div className="px-6 py-4 bg-cream/30 flex flex-wrap items-center justify-between gap-3 border-t border-sand/20">
                    <div className="text-xs font-body text-sand">
                      <span>Payment: </span>
                      <strong className="text-bark capitalize">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
                      </strong>
                      <span className="mx-2">•</span>
                      <span>Status: </span>
                      <strong className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.paymentStatus}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePrintInvoice(order)}
                        className="px-4 py-1.5 rounded-full border border-sand/60 bg-white hover:bg-cream text-bark font-body text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <FiPrinter className="w-3.5 h-3.5" /> Invoice
                      </button>

                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="px-4 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 font-body text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}