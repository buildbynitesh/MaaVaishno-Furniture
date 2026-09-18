import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft, FiCheck, FiKey, FiExternalLink } from 'react-icons/fi'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sentData, setSentData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    try {
      setLoading(true)
      const res = await api.post('/auth/forgot-password', { email })

      toast.success(res.data.message || 'Password reset link generated!', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })

      setSentData({
        email,
        resetToken: res.data.resetToken,
        resetUrl: res.data.resetUrl,
        emailSent: res.data.emailSent,
      })
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send reset link. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* LOGO */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="font-display text-3xl font-bold text-bark">
              maa<span className="text-wood">Vaishno</span>
            </span>
            <div className="font-accent text-xs text-wood-light italic tracking-widest mt-0.5">
              FURNITURE
            </div>
          </Link>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-sand/30 shadow-lg">
          {!sentData ? (
            <>
              <h1 className="font-display text-2xl font-bold text-bark mb-2">
                Forgot Password?
              </h1>
              <p className="font-body text-sand text-sm mb-6 leading-relaxed">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="input-luxury pl-11"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                      Sending instructions...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="font-display text-2xl font-bold text-bark mb-2">
                Reset Link Ready
              </h2>

              <p className="font-body text-sand text-sm leading-relaxed mb-6">
                Password reset instructions have been generated for{' '}
                <span className="text-bark font-semibold">{sentData.email}</span>.
                {sentData.emailSent && (
                  <span className="block text-green-700 font-medium text-xs mt-1">
                    An email has been dispatched to your inbox.
                  </span>
                )}
              </p>

              {/* Instant Reset Action Button */}
              {sentData.resetToken && (
                <div className="p-4 bg-wood/10 rounded-xl border border-wood/20 mb-6 text-left">
                  <div className="flex items-center gap-2 text-wood font-semibold text-xs uppercase tracking-wider mb-2">
                    <FiKey className="w-4 h-4" />
                    <span>Instant Password Reset</span>
                  </div>
                  <p className="text-xs font-body text-bark/80 mb-3">
                    You can set your new password directly now without waiting for email delivery:
                  </p>
                  <button
                    onClick={() => navigate(`/reset-password/${sentData.resetToken}`)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs"
                  >
                    <span>Proceed to Set New Password</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="font-body text-xs text-sand">
                Need to use another email?{' '}
                <button
                  onClick={() => setSentData(null)}
                  className="text-wood hover:underline font-medium"
                >
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 font-body text-sm text-bark/60 hover:text-wood transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}