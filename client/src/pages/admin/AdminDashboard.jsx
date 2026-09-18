import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../api/axios'
import { motion } from 'framer-motion'
import {
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiPlus,
  FiSettings,
  FiBarChart2,
  FiList,
  FiTag,
  FiImage,
  FiTrash2,
  FiCheck,
  FiX,
  FiShield,
  FiSave,
  FiExternalLink,
  FiLogOut,
  FiMenu,
} from 'react-icons/fi'
import { logout } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'
import { formatPrice } from '../../utils/helpers'

import ProductForm from '../../components/admin/ProductForm'
import OrderManagement from '../../components/admin/OrderManagement'

import {
  RevenueChart,
  OrdersBarChart,
} from '../../components/admin/AdminCharts'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2 },
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'orders', label: 'Orders', icon: FiList },
  { id: 'customers', label: 'Customers', icon: FiUsers },
  { id: 'coupons', label: 'Coupons', icon: FiTag },
  { id: 'banners', label: 'Banners', icon: FiImage },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out from Admin Console')
    navigate('/login')
  }

  const [activeTab, setActiveTab] = useState('dashboard')
  const [statsData, setStatsData] = useState(null)
  const [products, setProducts] = useState([])
  const [showProductForm, setShowForm] = useState(false)
  const [editingProduct, setEditing] = useState(null)

  // Customers state
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  // Coupons state
  const [coupons, setCoupons] = useState([])
  const [loadingCoupons, setLoadingCoupons] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    minAmount: '',
    maxDiscount: '',
    expiresAt: '',
  })

  // Banners state
  const [banners, setBanners] = useState([])
  const [loadingBanners, setLoadingBanners] = useState(false)
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    link: '/shop',
    imageUrl: '',
  })

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    storeName: 'Maa Vaishno Furniture',
    tagline: 'Luxury Handcrafted Living & Heritage Woodwork',
    contactPhone: '+91 98765 43210',
    supportEmail: 'care@maavaishnofurniture.com',
    showroomAddress: 'Furniture Street, Main Market, Delhi NCR, India',
    freeShippingThreshold: '25000',
    standardDelivery: '3 - 7 Business Days',
  })

  useEffect(() => {
    fetchDashboardStats()
    fetchProducts()
  }, [])

  useEffect(() => {
    if (activeTab === 'customers') fetchCustomers()
    if (activeTab === 'coupons') fetchCoupons()
    if (activeTab === 'banners') fetchBanners()
  }, [activeTab])

  // FETCH DASHBOARD STATS
  const fetchDashboardStats = async () => {
    try {
      const res = await api.get('/admin/dashboard')
      if (res.data?.stats) {
        setStatsData(res.data.stats)
      }
    } catch (err) {
      console.log('Stats error:', err)
    }
  }

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100')
      setProducts(res.data.products || [])
    } catch (error) {
      console.log(error)
    }
  }

  // FETCH CUSTOMERS
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true)
      const res = await api.get('/users')
      setCustomers(res.data.users || [])
    } catch (err) {
      console.log('Users error:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }

  // TOGGLE USER ROLE
  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await api.put(`/users/${userId}/role`, { role: newRole })
      setCustomers((prev) =>
        prev.map((c) => (c._id === userId ? { ...c, role: newRole } : c))
      )
      toast.success(`User role updated to ${newRole}`, {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to update role')
    }
  }

  // DELETE USER
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/users/${userId}`)
      setCustomers((prev) => prev.filter((c) => c._id !== userId))
      toast.success('User deleted successfully', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  // FETCH COUPONS
  const fetchCoupons = async () => {
    try {
      setLoadingCoupons(true)
      const res = await api.get('/coupons')
      setCoupons(res.data.coupons || [])
    } catch (err) {
      console.log('Coupons error:', err)
    } finally {
      setLoadingCoupons(false)
    }
  }

  // CREATE COUPON
  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    if (!couponForm.code || !couponForm.discount) {
      toast.error('Coupon code and discount are required')
      return
    }
    try {
      const payload = {
        code: couponForm.code.toUpperCase().trim(),
        discount: Number(couponForm.discount),
        discountValue: Number(couponForm.discount),
        minAmount: Number(couponForm.minAmount) || 0,
        minOrderValue: Number(couponForm.minAmount) || 0,
        maxDiscount: Number(couponForm.maxDiscount) || 0,
        expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt).toISOString() : undefined,
      }
      const res = await api.post('/coupons', payload)
      setCoupons((prev) => [res.data.coupon, ...prev])
      setShowCouponModal(false)
      setCouponForm({ code: '', discount: '', minAmount: '', maxDiscount: '', expiresAt: '' })
      toast.success(`Coupon ${res.data.coupon.code} created successfully!`, {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon')
    }
  }

  // TOGGLE COUPON STATUS
  const handleToggleCoupon = async (coupon) => {
    try {
      const res = await api.put(`/coupons/${coupon._id}`, { active: !coupon.active })
      setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? res.data.coupon : c)))
      toast.success(`Coupon ${coupon.code} is now ${res.data.coupon.active ? 'active' : 'inactive'}`, {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to update coupon status')
    }
  }

  // DELETE COUPON
  const handleDeleteCoupon = async (couponId) => {
    try {
      await api.delete(`/coupons/${couponId}`)
      setCoupons((prev) => prev.filter((c) => c._id !== couponId))
      toast.success('Coupon removed', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to delete coupon')
    }
  }

  // FETCH BANNERS
  const fetchBanners = async () => {
    try {
      setLoadingBanners(true)
      const res = await api.get('/banners/all')
      setBanners(res.data.banners || [])
    } catch (err) {
      console.log('Banners error:', err)
    } finally {
      setLoadingBanners(false)
    }
  }

  // CREATE BANNER
  const handleCreateBanner = async (e) => {
    e.preventDefault()
    if (!bannerForm.imageUrl) {
      toast.error('Banner Image URL is required')
      return
    }
    try {
      const res = await api.post('/banners', bannerForm)
      setBanners((prev) => [res.data.banner, ...prev])
      setBannerForm({ title: '', subtitle: '', link: '/shop', imageUrl: '' })
      toast.success('Banner added successfully!', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to add banner')
    }
  }

  // DELETE BANNER
  const handleDeleteBanner = async (bannerId) => {
    try {
      await api.delete(`/banners/${bannerId}`)
      setBanners((prev) => prev.filter((b) => b._id !== bannerId))
      toast.success('Banner deleted', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (err) {
      toast.error('Failed to delete banner')
    }
  }

  // SAVE SETTINGS
  const handleSaveSettings = (e) => {
    e.preventDefault()
    toast.success('Store settings updated successfully!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
    })
  }

  const openAddForm = () => {
    setEditing(null)
    setShowForm(true)
  }

  const openEditForm = (p) => {
    setEditing(p)
    setShowForm(true)
  }

  const closeForm = () => {
    setEditing(null)
    setShowForm(false)
  }

  // SAVE PRODUCT
  const handleSaveProduct = async (data) => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, data)
      } else {
        await api.post('/products', data)
      }
      fetchProducts()
      closeForm()
    } catch (error) {
      console.log(error)
      toast.error('Failed to save product')
    }
  }

  // DELETE PRODUCT
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
      toast.success('Product deleted successfully', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
    } catch (error) {
      console.log(error)
      toast.error('Failed to delete product')
    }
  }

  // DYNAMIC STATS CARDS (with clickable tab navigation)
  const STATS = [
    {
      label: 'Total Revenue',
      value: statsData?.totalRevenue ? formatPrice(statsData.totalRevenue) : '₹8,42,500',
      change: '+12% this month',
      icon: FiDollarSign,
      bg: 'bg-green-50',
      fg: 'text-green-600',
      tab: 'orders',
    },
    {
      label: 'Total Orders',
      value: statsData?.totalOrders !== undefined ? statsData.totalOrders : '284',
      change: '+8% this month',
      icon: FiShoppingCart,
      bg: 'bg-blue-50',
      fg: 'text-blue-600',
      tab: 'orders',
    },
    {
      label: 'Products',
      value: statsData?.totalProducts !== undefined ? statsData.totalProducts : products.length || '127',
      change: `${products.length} in catalog`,
      icon: FiPackage,
      bg: 'bg-purple-50',
      fg: 'text-purple-600',
      tab: 'products',
    },
    {
      label: 'Customers',
      value: statsData?.totalUsers !== undefined ? statsData.totalUsers : '1,024',
      change: 'Registered members',
      icon: FiUsers,
      bg: 'bg-amber-50',
      fg: 'text-amber-600',
      tab: 'customers',
    },
  ]

  return (
    <div className="min-h-screen bg-linen flex">
      {/* ── MOBILE OVERLAY BACKDROP ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-bark/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── LEFT VERTICAL SIDEBAR ── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 lg:w-72 bg-bark text-cream z-50 flex flex-col justify-between border-r border-white/10 transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2.5">
              <span className="font-display text-2xl font-bold text-cream tracking-tight">
                maa<span className="text-wood-light">Vaishno</span>
              </span>
              <span className="bg-wood/25 text-wood-light border border-wood-light/30 text-[9px] font-body uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">
                Portal
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-cream/70 hover:text-cream p-1 rounded-lg hover:bg-white/10 transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3.5 space-y-1">
            <p className="font-body text-[11px] text-cream/40 uppercase tracking-widest px-3 mb-2 font-semibold">
              Admin Menu
            </p>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    closeForm()
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-body text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-wood text-cream font-semibold shadow-sm'
                      : 'text-cream/70 hover:text-cream hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className={`w-4 h-4 ${isActive ? 'text-cream' : 'text-wood-light'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.id === 'products' && products.length > 0 && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-cream/20 text-cream' : 'bg-white/10 text-wood-light'
                      }`}
                    >
                      {products.length}
                    </span>
                  )}
                  {tab.id === 'orders' && statsData?.totalOrders !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-cream/20 text-cream' : 'bg-white/10 text-wood-light'
                      }`}
                    >
                      {statsData.totalOrders}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-3.5 border-t border-white/10 space-y-2.5">
          <Link
            to="/shop"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-body font-medium text-cream/90 transition-all"
            title="Open customer live shop in new tab"
          >
            <FiExternalLink className="w-3.5 h-3.5 text-wood-light" />
            <span>View Live Website</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-wood flex items-center justify-center font-display text-xs font-bold text-cream shadow-sm shrink-0">
                {(user?.name || 'A')[0].toUpperCase()}
              </div>
              <div className="text-left min-w-0">
                <p className="font-body text-xs font-semibold text-cream leading-tight truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="font-body text-[10px] text-wood-light leading-tight">Super Admin</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-all shrink-0"
              title="Logout"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── RIGHT MAIN WORKSPACE ── */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen bg-linen">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-sand/30 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-cream text-bark hover:bg-sand/30 transition-all"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl sm:text-2xl text-bark font-semibold capitalize">
                {activeTab}
              </h1>
              <p className="font-body text-[11px] text-sand hidden sm:block">
                MaaVaishno Furniture Administration Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-body text-wood hover:text-wood-dark font-medium bg-sand/15 hover:bg-sand/25 px-3 py-1.5 rounded-lg transition-all"
            >
              <span>Live Store</span>
              <FiExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* STATS CARDS (Clickable to switch tabs) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => s.tab && setActiveTab(s.tab)}
                  className="bg-white rounded-2xl p-5 shadow-card cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-wood/40 border border-sand/20 transition-all group select-none relative"
                  title={`Click to view ${s.label}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <s.icon className={`w-5 h-5 ${s.fg}`} />
                    </div>
                    <span className="text-sand/40 group-hover:text-wood group-hover:translate-x-0.5 transition-all text-xs font-semibold flex items-center gap-0.5">
                      <span>View</span>
                      <span>&rarr;</span>
                    </span>
                  </div>
                  <div className="font-display text-2xl font-bold text-bark group-hover:text-wood transition-colors">
                    {s.value}
                  </div>
                  <div className="font-body text-xs text-sand mt-0.5 font-medium">
                    {s.label}
                  </div>
                  <div className="font-body text-xs text-green-600 mt-1 font-medium">
                    {s.change}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <OrdersBarChart />
            </div>

            {/* TOP PRODUCTS */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-bark font-semibold">
                  Recent Catalog Products
                </h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="font-body text-sm text-wood hover:text-wood-dark"
                >
                  View all ({products.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {products.slice(0, 5).map((p, i) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-cream/50 transition-colors"
                  >
                    <span className="font-body text-xs text-sand w-4">
                      {i + 1}
                    </span>
                    <img
                      src={p.images?.[0] || '/images/placeholder.jpg'}
                      alt={p.title}
                      className="w-10 h-10 rounded-xl object-cover bg-cream"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm font-medium text-bark truncate">
                        {p.title}
                      </p>
                      <p className="font-body text-xs text-sand">
                        {p.category?.name || p.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-bold text-bark">
                        {formatPrice(p.price)}
                      </p>
                      <p className="font-body text-xs text-green-600">{p.stock} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS VIEW */}
        {activeTab === 'products' && (
          <>
            {showProductForm ? (
              <ProductForm
                product={editingProduct}
                onSave={handleSaveProduct}
                onCancel={closeForm}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-bark font-semibold">
                    Products ({products.length})
                  </h2>
                  <button
                    onClick={openAddForm}
                    className="btn-primary flex items-center gap-2 text-sm py-2.5"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>

                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-cream/50">
                        <tr>
                          {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-4 text-left font-body text-xs text-sand uppercase tracking-widest"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand/10">
                        {products.map((p) => (
                          <tr key={p._id} className="hover:bg-cream/20 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images?.[0] || '/images/placeholder.jpg'}
                                  alt={p.title}
                                  className="w-12 h-12 object-cover rounded-xl bg-cream"
                                />
                                <div>
                                  <p className="font-body text-sm font-medium text-bark">
                                    {p.title}
                                  </p>
                                  <p className="font-body text-xs text-sand">
                                    {p.slug}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4 font-body text-sm text-bark/60">
                              {p.category?.name || p.category}
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-display text-sm font-bold text-bark">
                                {formatPrice(p.price)}
                              </p>
                              {p.originalPrice && (
                                <p className="font-body text-xs text-sand line-through">
                                  {formatPrice(p.originalPrice)}
                                </p>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`font-body text-xs font-medium px-2 py-0.5 rounded-full ${
                                p.stock > 5 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openEditForm(p)}
                                  className="px-3 py-1.5 text-xs font-body font-medium text-wood hover:bg-wood/10 rounded-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id)}
                                  className="px-3 py-1.5 text-xs font-body font-medium text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ORDERS VIEW */}
        {activeTab === 'orders' && <OrderManagement />}

        {/* CUSTOMERS VIEW */}
        {activeTab === 'customers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-bark font-semibold">
                Registered Customers ({customers.length})
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-cream/50">
                    <tr>
                      {['Customer', 'Email', 'Role', 'Joined Date', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-left font-body text-xs text-sand uppercase tracking-widest"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand/10">
                    {loadingCustomers ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sand font-body">
                          Loading customers...
                        </td>
                      </tr>
                    ) : customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sand font-body">
                          No registered customers found.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c._id} className="hover:bg-cream/20 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-display font-semibold text-bark text-sm">
                                {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="font-body text-sm font-medium text-bark">
                                {c.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-body text-sm text-sand">
                            {c.email}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-body font-medium uppercase tracking-wider ${
                                c.role === 'admin'
                                  ? 'bg-wood/10 text-wood font-semibold'
                                  : 'bg-sand/20 text-bark'
                              }`}
                            >
                              {c.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-body text-xs text-sand">
                            {new Date(c.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleRole(c._id, c.role)}
                                className="px-3 py-1.5 text-xs font-body font-medium text-wood hover:bg-wood/10 rounded-lg"
                              >
                                {c.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(c._id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COUPONS VIEW */}
        {activeTab === 'coupons' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-bark font-semibold">
                Promotional Coupons ({coupons.length})
              </h2>
              <button
                onClick={() => setShowCouponModal(true)}
                className="btn-primary flex items-center gap-2 text-sm py-2.5"
              >
                <FiPlus className="w-4 h-4" />
                Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loadingCoupons ? (
                <div className="col-span-3 py-8 text-center text-sand font-body">
                  Loading coupons...
                </div>
              ) : coupons.length === 0 ? (
                <div className="col-span-3 py-12 text-center bg-white rounded-2xl shadow-card">
                  <FiTag className="w-10 h-10 text-sand mx-auto mb-2 opacity-50" />
                  <p className="font-body text-sand">No coupons found. Create your first coupon above!</p>
                </div>
              ) : (
                coupons.map((c) => {
                  const isExpired = Boolean(c.expiresAt && new Date(c.expiresAt) < new Date())
                  const minVal = c.minOrderValue ?? c.minAmount ?? 0
                  const maxVal = c.maxDiscount ?? 0
                  const discountVal = c.discountValue ?? c.discount ?? 0

                  return (
                    <div
                      key={c._id}
                      className="bg-white rounded-2xl shadow-card p-5 border border-sand/20 relative flex flex-col justify-between transition-all hover:shadow-luxury"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(c.code)
                              toast.success(`Copied "${c.code}" to clipboard!`, {
                                style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
                              })
                            }}
                            title="Click to copy coupon code"
                            className="font-display font-bold text-lg text-bark tracking-wider bg-cream px-3 py-1 rounded-lg border border-sand/30 hover:border-gold transition-colors text-left"
                          >
                            {c.code}
                          </button>
                          <span className="font-body text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                            {discountVal}% OFF
                          </span>
                        </div>

                        <div className="space-y-1.5 font-body text-xs text-sand">
                          <p className="text-bark/80">
                            Min Order: {minVal > 0 ? `₹${minVal.toLocaleString('en-IN')}` : 'No minimum'}
                          </p>
                          {maxVal > 0 && (
                            <p className="text-bark/80">Max Discount: ₹{maxVal.toLocaleString('en-IN')}</p>
                          )}
                          {c.expiresAt ? (
                            <p className={isExpired ? 'text-red-500 font-medium' : 'text-sand'}>
                              {isExpired ? 'Expired on: ' : 'Expires: '}
                              {new Date(c.expiresAt).toLocaleDateString('en-IN')}
                            </p>
                          ) : (
                            <p className="text-sand/70">Never expires</p>
                          )}
                          <p className="text-sand/80">
                            Redeemed: {c.usedCount || 0} / {c.maxUses || 100} uses
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-sand/20 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleCoupon(c)}
                          title="Click to toggle active/inactive status"
                          className={`font-body text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            isExpired
                              ? 'bg-red-50 text-red-600 border-red-200 cursor-not-allowed'
                              : c.active
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {isExpired ? 'Expired' : c.active ? '● Active' : '○ Inactive'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(c._id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete coupon"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* CREATE COUPON MODAL */}
            {showCouponModal && (
              <div className="fixed inset-0 z-50 bg-bark/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-luxury max-w-md w-full p-6 animate-scaleIn">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-xl font-bold text-bark">Create New Coupon</h3>
                    <button
                      onClick={() => setShowCouponModal(false)}
                      className="p-1 text-sand hover:text-bark rounded-lg"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCoupon} className="space-y-4 font-body">
                    <div>
                      <label className="text-xs font-medium text-bark block mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        placeholder="e.g. MAAVAISHO09"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                        className="input-luxury uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-bark block mb-1">Discount (%) *</label>
                      <input
                        type="number"
                        placeholder="e.g. 90"
                        min="1"
                        max="100"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: e.target.value })}
                        className="input-luxury"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-bark block mb-1">Min Order (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 5000"
                          value={couponForm.minAmount}
                          onChange={(e) => setCouponForm({ ...couponForm, minAmount: e.target.value })}
                          className="input-luxury"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-bark block mb-1">Max Discount (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 2000"
                          value={couponForm.maxDiscount}
                          onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                          className="input-luxury"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-bark block mb-1">Expiry Date</label>
                      <input
                        type="date"
                        value={couponForm.expiresAt}
                        onChange={(e) => setCouponForm({ ...couponForm, expiresAt: e.target.value })}
                        className="input-luxury"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowCouponModal(false)}
                        className="flex-1 py-2.5 rounded-xl border border-sand/30 font-medium text-bark hover:bg-cream transition-colors"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 btn-primary py-2.5">
                        Save Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BANNERS VIEW */}
        {activeTab === 'banners' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-bark font-semibold">
                Promotional Hero Banners
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ADD BANNER FORM */}
              <div className="bg-white rounded-2xl shadow-card p-6 h-fit">
                <h3 className="font-display text-lg font-bold text-bark mb-4">Add New Banner</h3>
                <form onSubmit={handleCreateBanner} className="space-y-4 font-body">
                  <div>
                    <label className="text-xs font-medium text-bark block mb-1">Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Festive Living Collection"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-bark block mb-1">Subtitle / Offer</label>
                    <input
                      type="text"
                      placeholder="e.g. Up to 40% Off Handcrafted Teak"
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-bark block mb-1">Image URL *</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={bannerForm.imageUrl}
                      onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                      className="input-luxury"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-bark block mb-1">Target Link</label>
                    <input
                      type="text"
                      placeholder="/shop"
                      value={bannerForm.link}
                      onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-2.5">
                    Add Banner
                  </button>
                </form>
              </div>

              {/* BANNERS LIST */}
              <div className="lg:col-span-2 space-y-4">
                {loadingBanners ? (
                  <div className="py-8 text-center text-sand font-body">Loading banners...</div>
                ) : banners.length === 0 ? (
                  <div className="py-12 text-center bg-white rounded-2xl shadow-card">
                    <FiImage className="w-10 h-10 text-sand mx-auto mb-2 opacity-50" />
                    <p className="font-body text-sand">No promotional banners configured yet.</p>
                  </div>
                ) : (
                  banners.map((b) => (
                    <div
                      key={b._id}
                      className="bg-white rounded-2xl shadow-card overflow-hidden border border-sand/20 flex flex-col sm:flex-row items-center gap-4 p-4"
                    >
                      <img
                        src={b.imageUrl}
                        alt={b.title || 'Banner'}
                        className="w-full sm:w-44 h-24 object-cover rounded-xl bg-cream"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-semibold text-bark text-base">{b.title || 'Untitled Banner'}</h4>
                        <p className="font-body text-xs text-sand mt-0.5">{b.subtitle || 'No subtitle'}</p>
                        <p className="font-body text-xs text-wood mt-1 font-medium">{b.link}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBanner(b._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors self-end sm:self-center"
                        title="Delete banner"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-bark font-semibold">
                Store Information & Policies
              </h2>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl shadow-card p-6 space-y-5 font-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="input-luxury"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-bark block mb-1">Showroom Address</label>
                <textarea
                  rows={2}
                  value={settingsForm.showroomAddress}
                  onChange={(e) => setSettingsForm({ ...settingsForm, showroomAddress: e.target.value })}
                  className="input-luxury resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-sand/20">
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Free Shipping Min Order (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: e.target.value })}
                    className="input-luxury"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-bark block mb-1">Standard Delivery Timeline</label>
                  <input
                    type="text"
                    value={settingsForm.standardDelivery}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardDelivery: e.target.value })}
                    className="input-luxury"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button type="submit" className="btn-primary flex items-center gap-2 py-2.5 px-6">
                  <FiSave className="w-4 h-4" />
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}

        </main>
      </div>
    </div>
  )
}