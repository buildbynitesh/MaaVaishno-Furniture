import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiMail, FiLock, FiShoppingBag, FiShield } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../redux/slices/authSlice'
import toast from 'react-hot-toast'

const LOCKOUT_STORAGE_KEY = 'mvf_login_rate_limit_state'

const getStoredLockout = () => {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY)
    if (!raw) return { attempts: 0, stage: 1, lockUntil: null }
    return JSON.parse(raw)
  } catch {
    return { attempts: 0, stage: 1, lockUntil: null }
  }
}

const saveStoredLockout = (data) => {
  try {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

const clearStoredLockout = () => {
  try {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY)
  } catch {
    // ignore
  }
}

// Format countdown exactly like user's reference: "1m 57s" or "5s"
const formatCountdown = (totalSec) => {
  if (totalSec <= 0) return '0s'
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  if (m > 0) {
    return `${m}m ${s < 10 ? '0' : ''}${s}s`
  }
  return `${s}s`
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoading, isAuthenticated, user } = useSelector((s) => s.auth)

  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [isEditable, setIsEditable] = useState(false)
  const [activeRoleTab, setActiveRoleTab] = useState(() => {
    try {
      const saved = localStorage.getItem('mvf_remember_login')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.email?.toLowerCase().includes('admin') || parsed?.email === 'buildbynitesh@gmail.com') {
          return 'admin'
        }
      }
    } catch {}
    return 'customer'
  })

  // Rate limiting & lockout state
  const [lockoutState, setLockoutState] = useState(getStoredLockout)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [attemptsLeft, setAttemptsLeft] = useState(null)
  const [hasError, setHasError] = useState(false)

  const from = location.state?.from?.pathname || '/'
  const isLocked = secondsLeft > 0

  // 1-second interval to run real-time countdown timer
  useEffect(() => {
    const checkTimer = () => {
      const stored = getStoredLockout()
      if (stored.lockUntil) {
        const now = Date.now()
        const remaining = Math.max(0, Math.ceil((stored.lockUntil - now) / 1000))
        if (remaining > 0) {
          setSecondsLeft(remaining)
          setLockoutState(stored)
          return
        } else {
          // Lockout period expired!
          const updated = {
            attempts: 0,
            stage: 2,
            lockUntil: null,
          }
          saveStoredLockout(updated)
          setLockoutState(updated)
          setSecondsLeft(0)
          setHasError(false)
          setAttemptsLeft(null)
          toast.success('Lockout expired. You may now sign in.', {
            id: 'lockout-expired',
            style: { fontFamily: 'DM Sans', borderRadius: '12px' },
          })
          return
        }
      }
      setSecondsLeft(0)
    }

    checkTimer()
    const timer = setInterval(checkTimer, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto pre-fill if Remember Me was checked previously
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mvf_remember_login')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.remember && parsed?.email) {
          setForm({
            email: parsed.email || '',
            password: parsed.password || '',
            remember: true,
          })
          setIsEditable(true)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      clearStoredLockout()
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    }
  }, [isAuthenticated, user])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLocked) {
      toast.error(`Please try again in ${formatCountdown(secondsLeft)}.`, {
        id: 'locked-warn',
      })
      return
    }

    setHasError(false)

    if (form.remember) {
      localStorage.setItem(
        'mvf_remember_login',
        JSON.stringify({
          email: form.email,
          password: form.password,
          remember: true,
        })
      )
    } else {
      localStorage.removeItem('mvf_remember_login')
    }

    const result = await dispatch(loginUser({ email: form.email, password: form.password }))

    if (loginUser.fulfilled.match(result)) {
      clearStoredLockout()
      setLockoutState({ attempts: 0, stage: 1, lockUntil: null })
      setSecondsLeft(0)
      setHasError(false)
      setAttemptsLeft(null)

      const loggedUser = result.payload.user
      if (loggedUser?.role === 'admin') {
        toast.success('Welcome back, Admin!', {
          style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
        })
        navigate('/admin', { replace: true })
      } else {
        toast.success('Welcome back! Signed in successfully.')
        navigate(from, { replace: true })
      }
    } else {
      const current = getStoredLockout()
      const currentStage = current.stage || 1
      const newAttempts = (current.attempts || 0) + 1

      if (currentStage === 1) {
        if (newAttempts >= 5) {
          // 5 failed attempts -> 2 minute lock (120 seconds)
          const lockUntil = Date.now() + 120 * 1000
          const updated = { attempts: 0, stage: 2, lockUntil }
          saveStoredLockout(updated)
          setLockoutState(updated)
          setSecondsLeft(120)
          setHasError(true)
          setAttemptsLeft(null)
          toast.error('Too many failed attempts. Please wait 2 minutes.', {
            style: { fontFamily: 'DM Sans', borderRadius: '12px' },
          })
        } else {
          const updated = { ...current, attempts: newAttempts }
          saveStoredLockout(updated)
          setLockoutState(updated)
          const remaining = 5 - newAttempts
          setHasError(true)
          setAttemptsLeft(remaining)
          toast.error(`Invalid credentials. (${remaining} attempts left)`, {
            style: { fontFamily: 'DM Sans', borderRadius: '12px' },
          })
        }
      } else {
        // Stage 2: 3 failed attempts -> 5 minute lock (300 seconds)
        if (newAttempts >= 3) {
          const lockUntil = Date.now() + 300 * 1000
          const updated = { attempts: 0, stage: 2, lockUntil }
          saveStoredLockout(updated)
          setLockoutState(updated)
          setSecondsLeft(300)
          setHasError(true)
          setAttemptsLeft(null)
          toast.error('Too many failed attempts. Please wait 5 minutes.', {
            style: { fontFamily: 'DM Sans', borderRadius: '12px' },
          })
        } else {
          const updated = { ...current, attempts: newAttempts }
          saveStoredLockout(updated)
          setLockoutState(updated)
          const remaining = 3 - newAttempts
          setHasError(true)
          setAttemptsLeft(remaining)
          toast.error(`Invalid credentials. (${remaining} attempts left)`, {
            style: { fontFamily: 'DM Sans', borderRadius: '12px' },
          })
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left - Luxury Image & Branding (Preserves existing website luxury UI) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=90"
          alt="Luxury furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bark/50 flex flex-col items-center justify-center p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to="/" className="inline-block mb-8">
              <span className="font-display text-4xl font-bold text-cream">
                maa<span className="text-wood-light">Vaishno</span>
              </span>
              <div className="font-accent text-sm text-wood-light italic tracking-widest mt-1">
                FURNITURE
              </div>
            </Link>

            {activeRoleTab === 'admin' ? (
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream/10 border border-cream/25 text-wood-light text-xs font-semibold uppercase tracking-widest mb-5 backdrop-blur-sm">
                  <FiShield className="w-3.5 h-3.5" />
                  <span>Enterprise Admin Portal</span>
                </div>
                <p className="font-accent text-cream text-2xl italic leading-relaxed mb-3">
                  "Control catalog, live orders, revenue, & coupons with precision."
                </p>
                <p className="font-body text-xs text-cream/70 tracking-wider uppercase">
                  maaVaishno Furniture • Central Management System
                </p>
              </div>
            ) : (
              <div>
                <p className="font-accent text-cream/80 text-2xl italic leading-relaxed">
                  "Your home is a reflection<br />of your unique story."
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-lg">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link to="/">
              <span className="font-display text-3xl font-bold text-bark">
                maa<span className="text-wood">Vaishno</span>
              </span>
            </Link>
          </div>

          {activeRoleTab === 'admin' ? (
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B6914]/10 border border-[#8B6914]/25 text-[#8B6914] text-xs font-semibold uppercase tracking-wider mb-2">
                <FiShield className="w-3.5 h-3.5 text-wood" />
                <span>Store Management Console</span>
              </div>
              <h1 className="font-display text-3xl text-bark font-semibold">
                Admin Console
              </h1>
              <p className="font-body text-sand text-sm mt-1">
                Authorized access for store administration & inventory.
              </p>
            </div>
          ) : (
            <div className="mb-4">
              <h1 className="font-display text-3xl text-bark font-semibold mb-1">
                Welcome back
              </h1>
              <p className="font-body text-sand text-sm">
                Sign in to your account to continue shopping.
              </p>
            </div>
          )}

          {/* ── Reference-style Clean Centered Status / Error Messages ── */}
          {isLocked ? (
            <div className="py-2 mb-4 text-center">
              <p className="text-red-600 font-body text-sm font-semibold tracking-wide animate-pulse">
                Too many failed attempts. Please try again in {formatCountdown(secondsLeft)}.
              </p>
            </div>
          ) : hasError && attemptsLeft !== null ? (
            <div className="py-2 mb-4 text-center">
              <p className="text-red-600 font-body text-sm font-medium">
                Invalid credentials. ({attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left)
              </p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input
                  type="email"
                  name="mv_login_email"
                  id="mv_login_email"
                  autoComplete="off"
                  disabled={isLocked}
                  readOnly={!isEditable}
                  onFocus={() => setIsEditable(true)}
                  onPointerDown={() => setIsEditable(true)}
                  value={form.email}
                  onChange={(e) => {
                    const val = e.target.value
                    setForm((f) => ({ ...f, email: val }))
                    if (hasError) setHasError(false)
                    if (val.toLowerCase().includes('admin') || val === 'buildbynitesh@gmail.com') {
                      setActiveRoleTab('admin')
                    }
                  }}
                  placeholder="you@example.com"
                  required
                  className={`input-luxury pl-11 ${isLocked ? 'opacity-60 cursor-not-allowed bg-sand/10' : ''}`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="font-body text-xs text-bark/70 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="font-body text-xs text-wood hover:text-wood-dark">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="mv_login_password"
                  id="mv_login_password"
                  autoComplete="new-password"
                  disabled={isLocked}
                  readOnly={!isEditable}
                  onFocus={() => setIsEditable(true)}
                  onPointerDown={() => setIsEditable(true)}
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }))
                    if (hasError) setHasError(false)
                  }}
                  placeholder="••••••••"
                  required
                  className={`input-luxury pl-11 pr-11 ${isLocked ? 'opacity-60 cursor-not-allowed bg-sand/10' : ''}`}
                />
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sand hover:text-bark transition-colors disabled:opacity-50"
                >
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                disabled={isLocked}
                checked={form.remember}
                onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))}
                className="w-4 h-4 accent-wood rounded disabled:opacity-50"
              />
              <label htmlFor="remember" className="font-body text-sm text-bark/70 cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || isLocked}
              className={`btn-primary w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                isLocked ? '!bg-bark/70 opacity-80 cursor-not-allowed' : 'disabled:opacity-60'
              }`}
            >
              {isLocked ? (
                <span className="flex items-center gap-2 text-cream/90 font-medium">
                  <FiLock className="w-4 h-4 text-wood-light" />
                  Locked ({formatCountdown(secondsLeft)})
                </span>
              ) : isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : activeRoleTab === 'admin' ? (
                <span className="flex items-center gap-2">
                  <FiShield className="w-4 h-4" />
                  Access Admin Console
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {activeRoleTab === 'admin' ? (
              <div className="flex items-center justify-center gap-2 font-body text-xs text-bark/70 bg-bark/5 py-2.5 px-4 rounded-xl border border-bark/10">
                <FiShield className="w-3.5 h-3.5 text-wood flex-shrink-0" />
                <span>Restricted portal: Store administrators & management only.</span>
              </div>
            ) : (
              <p className="font-body text-sm text-bark/60">
                Don't have an account?{' '}
                <Link to="/signup" className="text-wood font-medium hover:text-wood-dark transition-colors">
                  Create account
                </Link>
              </p>
            )}
          </div>

          {/* Customer / Admin Pill Switcher */}
          <div className="mt-8">
            <div className="flex p-1 bg-sand/20 rounded-2xl border border-sand/30 shadow-inner">
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return
                  setActiveRoleTab('customer')
                  setIsEditable(true)
                  setHasError(false)
                  setForm({ email: 'user@demo.com', password: 'password123', remember: true })
                }}
                className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeRoleTab === 'customer'
                    ? 'bg-white text-bark shadow-sm border border-sand/20 font-bold'
                    : 'text-bark/70 hover:text-bark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiShoppingBag className="w-4 h-4 text-wood" />
                <span>Customer Sign In</span>
              </button>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  if (isLocked) return
                  setActiveRoleTab('admin')
                  setIsEditable(true)
                  setHasError(false)
                  setForm({ email: 'buildbynitesh@gmail.com', password: 'buildAdmin@321', remember: true })
                }}
                className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeRoleTab === 'admin'
                    ? 'bg-white text-bark shadow-sm border border-sand/20 font-bold'
                    : 'text-bark/70 hover:text-bark'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiShield className="w-4 h-4 text-wood" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
