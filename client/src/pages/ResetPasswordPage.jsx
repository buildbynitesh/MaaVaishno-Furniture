import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiEye, FiEyeOff, FiCheck, FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!token) {
      setError('Reset token is missing from the URL. Please request a new link.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    try {
      setLoading(true)
      const res = await api.post(`/auth/reset-password/${token}`, { password })

      setSuccess(true)
      toast.success(res.data.message || 'Password reset successfully!', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })

      // Auto redirect to login after 2.5 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. The link may have expired.'
      setError(msg)
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
          {!success ? (
            <>
              <h1 className="font-display text-2xl font-bold text-bark mb-2">
                Set New Password
              </h1>
              <p className="font-body text-sand text-sm mb-6">
                Please enter a new, secure password for your account.
              </p>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 mb-6 flex items-start gap-3 text-xs font-body shadow-sm">
                  <FiAlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">{error}</p>
                    <Link
                      to="/forgot-password"
                      className="text-wood underline font-medium inline-block mt-1 hover:text-wood-dark"
                    >
                      Request a new reset link &rarr;
                    </Link>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (error) setError(null)
                      }}
                      placeholder="At least 6 characters"
                      required
                      minLength={6}
                      className="input-luxury pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sand hover:text-bark transition-colors"
                    >
                      {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (error) setError(null)
                      }}
                      placeholder="Repeat your password"
                      required
                      minLength={6}
                      className="input-luxury pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sand hover:text-bark transition-colors"
                    >
                      {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {password && (
                  <div className="text-xs font-body space-y-1 bg-cream/60 p-3 rounded-xl border border-sand/20">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-sand'}`} />
                      <span className={password.length >= 6 ? 'text-green-700 font-medium' : 'text-sand'}>
                        At least 6 characters
                      </span>
                    </div>
                    {confirmPassword && (
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${password === confirmPassword ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={password === confirmPassword ? 'text-green-700 font-medium' : 'text-red-600'}>
                          {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-bark mb-2">
                Password Reset Successful!
              </h2>
              <p className="font-body text-sand text-sm leading-relaxed mb-6">
                Your password has been securely updated. You can now sign in with your new credentials.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary w-full"
              >
                Sign In Now
              </button>
            </div>
          )}
        </div>

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
