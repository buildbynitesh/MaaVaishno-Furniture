import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, clearError } from '../redux/slices/authSlice'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector(s => s.auth)
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isAuthenticated) navigate('/')
  }, [isAuthenticated])

  useEffect(() => {
    if (error) {
      toast.error(error, { style: { fontFamily: 'DM Sans', borderRadius: '12px' } })
      dispatch(clearError())
    }
  }, [error])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    dispatch(registerUser({ name: form.name, email: form.email, phone: form.phone, password: form.password }))
  }

  const inputClass = (field) => `input-luxury ${errors[field] ? 'border-red-400 focus:border-red-400' : ''}`

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=90"
          alt="Bedroom furniture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-bark/50 flex flex-col items-center justify-center p-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
            <Link to="/" className="inline-block mb-8">
              <span className="font-display text-4xl font-bold text-cream">maa<span className="text-wood-light">Vaishno</span></span>
              <div className="font-accent text-sm text-wood-light italic tracking-widest mt-1">FURNITURE</div>
            </Link>
            <h2 className="font-display text-3xl text-cream font-semibold mb-4">Join the maaVaishno Family</h2>
            <p className="font-body text-cream/70 leading-relaxed">Get exclusive access to new arrivals, member-only deals and interior design inspiration.</p>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-lg overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm py-8"
        >
          <div className="lg:hidden mb-8 text-center">
            <Link to="/"><span className="font-display text-3xl font-bold text-bark">maa<span className="text-wood">Vaishno</span></span></Link>
          </div>

          <h1 className="font-display text-3xl text-bark font-semibold mb-2">Create Account</h1>
          <p className="font-body text-sand text-sm mb-8">Join us for a luxurious furniture experience.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className={`${inputClass('name')} pl-11`} />
              </div>
              {errors.name && <p className="font-body text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={`${inputClass('email')} pl-11`} />
              </div>
              {errors.email && <p className="font-body text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">Phone (optional)</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="input-luxury pl-11" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" className={`${inputClass('password')} pl-11 pr-11`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sand hover:text-bark">
                  {showPass ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="font-body text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="font-body text-xs text-bark/70 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sand" />
                <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat password" className={`${inputClass('confirm')} pl-11`} />
              </div>
              {errors.confirm && <p className="font-body text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="font-body text-xs text-sand text-center mt-4">
            By creating an account, you agree to our{' '}
            <Link to="#" className="text-wood hover:underline">Terms</Link> and{' '}
            <Link to="#" className="text-wood hover:underline">Privacy Policy</Link>.
          </p>

          <div className="mt-6 text-center">
            <p className="font-body text-sm text-bark/60">
              Already have an account?{' '}
              <Link to="/login" className="text-wood font-medium hover:text-wood-dark">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
