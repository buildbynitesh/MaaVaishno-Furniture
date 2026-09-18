import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiPackage,
  FiHeart,
  FiLogOut,
  FiCheck,
  FiShield,
  FiSave,
} from 'react-icons/fi'
import api from '../api/axios'
import { updateUser, logout } from '../redux/slices/authSlice'
import { selectWishlistCount } from '../redux/slices/wishlistSlice'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const wishlistCount = useSelector(selectWishlistCount)

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [ordersCount, setOrdersCount] = useState(0)

  // Profile Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: user?.address?.line1 || '',
    line2: user?.address?.line2 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  })

  // Password Form State
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        line1: user.address?.line1 || '',
        line2: user.address?.line2 || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
      })
    }
  }, [user])

  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const res = await api.get('/orders/my')
        setOrdersCount(res.data.orders?.length || 0)
      } catch (err) {
        // silent fallback
      }
    }
    fetchOrdersCount()
  }, [])

  const handleProfileSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault()
    setLoading(true)
    try {
      const res = await api.put('/auth/profile', {
        name: formData.name,
        phone: formData.phone,
        address: {
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      })
      dispatch(updateUser(res.data.user))
      toast.success('Profile updated successfully!', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile', {
        style: { borderRadius: '12px', fontFamily: 'DM Sans' },
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (pwdData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword,
      })
      toast.success('Password changed successfully!', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password', {
        style: { borderRadius: '12px', fontFamily: 'DM Sans' },
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <div className="pt-24 min-h-screen bg-linen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-card mb-8 border border-sand/30 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-bark text-cream flex items-center justify-center font-display text-2xl font-bold shadow-md">
              {initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-bark">
                  {user?.name}
                </h1>
                <span className="bg-wood/10 text-wood px-3 py-0.5 rounded-full font-body text-xs font-semibold capitalize tracking-wide">
                  {user?.role === 'admin' ? 'Administrator' : 'Valued Member'}
                </span>
              </div>
              <p className="font-body text-sm text-sand flex items-center justify-center sm:justify-start gap-2">
                <FiMail className="w-4 h-4 text-wood" /> {user?.email}
              </p>
              {user?.createdAt && (
                <p className="font-body text-xs text-sand/80 mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-full border border-sand/60 text-bark font-body text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center gap-2"
            >
              <FiLogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </motion.div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            to="/orders"
            className="bg-white rounded-2xl p-5 shadow-card border border-sand/30 hover:border-wood transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-wood group-hover:scale-110 transition-transform">
              <FiPackage className="w-6 h-6" />
            </div>
            <div>
              <p className="font-body text-xs text-sand uppercase tracking-wider">My Orders</p>
              <p className="font-display text-2xl font-bold text-bark">{ordersCount}</p>
            </div>
          </Link>

          <Link
            to="/wishlist"
            className="bg-white rounded-2xl p-5 shadow-card border border-sand/30 hover:border-wood transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-wood group-hover:scale-110 transition-transform">
              <FiHeart className="w-6 h-6" />
            </div>
            <div>
              <p className="font-body text-xs text-sand uppercase tracking-wider">Wishlist Items</p>
              <p className="font-display text-2xl font-bold text-bark">{wishlistCount}</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-5 shadow-card border border-sand/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-wood">
              <FiShield className="w-6 h-6" />
            </div>
            <div>
              <p className="font-body text-xs text-sand uppercase tracking-wider">Security</p>
              <p className="font-display text-sm font-semibold text-green-600 flex items-center gap-1">
                <FiCheck className="w-4 h-4" /> Verified Account
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sand/30 mb-8 gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-display font-medium text-base sm:text-lg border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-wood text-wood font-semibold'
                : 'border-transparent text-sand hover:text-bark'
            }`}
          >
            <FiUser className="w-4 h-4" /> Personal & Address
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-display font-medium text-base sm:text-lg border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-wood text-wood font-semibold'
                : 'border-transparent text-sand hover:text-bark'
            }`}
          >
            <FiLock className="w-4 h-4" /> Password & Security
          </button>
        </div>

        {/* Tab 1: Profile & Shipping Form */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-sand/30"
          >
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl text-bark font-semibold mb-1">
                  Personal Information
                </h3>
                <p className="font-body text-xs text-sand mb-6">
                  Manage your personal contact details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="input-luxury pl-11 text-sm"
                        placeholder="Your Full Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input-luxury pl-11 text-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-sand/30 pt-6">
                <h3 className="font-display text-xl text-bark font-semibold mb-1">
                  Default Shipping Address
                </h3>
                <p className="font-body text-xs text-sand mb-6">
                  Used to prefill your orders during checkout
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                      Flat / House / Building Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                      <input
                        type="text"
                        value={formData.line1}
                        onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                        className="input-luxury pl-11 text-sm"
                        placeholder="House no., Street, Area"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                      Landmark / Colony (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.line2}
                      onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                      className="input-luxury text-sm"
                      placeholder="Near Landmark, Sector..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="input-luxury text-sm"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="input-luxury text-sm"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="input-luxury text-sm"
                        placeholder="6-digit Pincode"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleProfileSubmit}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 text-sm px-8 py-3 disabled:opacity-60"
                >
                  <FiSave className="w-4 h-4" />
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: Security & Password Form */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-sand/30 max-w-2xl"
          >
            <h3 className="font-display text-xl text-bark font-semibold mb-1">
              Change Password
            </h3>
            <p className="font-body text-xs text-sand mb-6">
              Ensure your account is protected with a strong password
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                  <input
                    type="password"
                    value={pwdData.currentPassword}
                    onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                    required
                    className="input-luxury pl-11 text-sm"
                    placeholder="Enter current password"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                  <input
                    type="password"
                    value={pwdData.newPassword}
                    onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                    required
                    className="input-luxury pl-11 text-sm"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-bark uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 text-sand w-4 h-4" />
                  <input
                    type="password"
                    value={pwdData.confirmPassword}
                    onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                    required
                    className="input-luxury pl-11 text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 text-sm px-8 py-3 disabled:opacity-60"
                >
                  <FiLock className="w-4 h-4" />
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  )
}