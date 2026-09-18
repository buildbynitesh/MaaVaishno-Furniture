import { useLocation, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiPackage, FiArrowRight } from 'react-icons/fi'
import { formatPrice } from '../utils/helpers'
import Confetti from '../components/ui/Confetti'

export default function OrderSuccessPage() {
  const { state } = useLocation()

  if (!state?.orderId) return <Navigate to="/" replace />

  const { orderId, total, paymentMethod, items = [] } = state

  return (
    <div className="pt-20 min-h-screen bg-linen flex items-center justify-center px-4">
      <Confetti />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="bg-white rounded-3xl shadow-luxury p-8 sm:p-12 max-w-lg w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheck className="w-12 h-12 text-green-500" strokeWidth={2.5} />
        </motion.div>

        <h1 className="font-display text-3xl text-bark font-bold mb-2">Order Confirmed! 🎉</h1>
        <p className="font-body text-sand leading-relaxed mb-6">
          Thank you for shopping with maaVaishno Furniture. Your order has been placed successfully.
        </p>

        {/* Order details card */}
        <div className="bg-cream rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-sand uppercase tracking-widest">Order ID</span>
            <span className="font-body text-sm font-bold text-wood">{orderId}</span>
          </div>
          {total && (
            <div className="flex justify-between items-center">
              <span className="font-body text-xs text-sand uppercase tracking-widest">Amount Paid</span>
              <span className="font-display text-lg font-bold text-bark">{formatPrice(total)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-sand uppercase tracking-widest">Payment</span>
            <span className="font-body text-sm text-bark font-medium">
              {paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Paid Online'}
            </span>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-linen rounded-2xl p-5 mb-8 text-left">
          <h3 className="font-display text-base text-bark font-semibold mb-3 flex items-center gap-2">
            <FiPackage className="w-4 h-4 text-wood" /> What happens next?
          </h3>
          <ol className="space-y-2">
            {[
              'Order confirmation email sent to your inbox',
              'Our team will process your order within 24 hours',
              paymentMethod === 'cod'
                ? 'Pay the delivery agent when your order arrives (5–7 days)'
                : 'Your order will be dispatched and you\'ll receive tracking details',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-sm text-bark/70">
                <span className="w-5 h-5 bg-wood/10 text-wood rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 btn-outline text-sm flex items-center justify-center gap-2"
          >
            Print Receipt
          </button>
          <Link to="/orders" className="flex-1 btn-outline text-sm flex items-center justify-center gap-2">
            Track Order
          </Link>
          <Link to="/shop" className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
            Continue Shopping <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
