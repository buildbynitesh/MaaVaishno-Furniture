import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX,
  FiLogOut, FiPackage, FiSettings, FiMoon, FiSun, FiChevronDown
} from 'react-icons/fi'
import { selectCartCount } from '../../redux/slices/cartSlice'
import { logout } from '../../redux/slices/authSlice'
import { toggleDarkMode, setSearchOpen, setMobileMenuOpen } from '../../redux/slices/uiSlice'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  {
    label: 'Categories', to: '/categories',
    sub: [
      { label: 'Bedroom', to: '/categories/bedroom' },
      { label: 'Living Room', to: '/categories/living-room' },
      { label: 'Dining', to: '/categories/dining' },
      { label: 'Office', to: '/categories/office' },
    ]
  },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const cartCount = useSelector(selectCartCount)
  const wishlistCount = useSelector(s => s.wishlist.items.length)
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const { darkMode, mobileMenuOpen } = useSelector(s => s.ui)
  const [scrolled, setScrolled] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [categoryDropdown, setCategoryDropdown] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchOpen, setSearchOpenLocal] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`)
      setSearchOpenLocal(false)
      setSearchInput('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setUserDropdown(false)
    navigate('/')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-linen/95 backdrop-blur-md shadow-luxury border-b border-sand/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-bark group-hover:text-wood transition-colors duration-300">
                  maa<span className="text-wood font-black">Vaishno</span>
                </span>
                <span className="font-accent text-xs text-wood-light italic tracking-widest">FURNITURE</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative"
                  onMouseEnter={() => link.sub && setCategoryDropdown(true)}
                  onMouseLeave={() => link.sub && setCategoryDropdown(false)}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `font-body text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                        isActive ? 'text-wood' : 'text-bark hover:text-wood'
                      }`
                    }
                  >
                    {link.label}
                    {link.sub && <FiChevronDown className="w-3 h-3" />}
                  </NavLink>

                  {link.sub && (
                    <AnimatePresence>
                      {categoryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-linen/98 backdrop-blur-md rounded-2xl shadow-luxury border border-sand/30 overflow-hidden"
                        >
                          {link.sub.map((s) => (
                            <Link
                              key={s.label}
                              to={s.to}
                              className="block px-5 py-3 text-sm font-body text-bark hover:bg-cream hover:text-wood transition-colors"
                            >
                              {s.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpenLocal(!searchOpen)}
                className="p-2 text-bark hover:text-wood transition-colors duration-200 rounded-full hover:bg-cream"
              >
                <FiSearch className="w-5 h-5" />
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => dispatch(toggleDarkMode())}
                className="p-2 text-bark hover:text-wood transition-colors duration-200 rounded-full hover:bg-cream hidden sm:flex"
              >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-bark hover:text-wood transition-colors duration-200 rounded-full hover:bg-cream hidden sm:flex"
              >
                <FiHeart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-wood text-cream text-xs rounded-full w-4 h-4 flex items-center justify-center font-body font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-bark hover:text-wood transition-colors duration-200 rounded-full hover:bg-cream"
              >
                <FiShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-wood text-cream text-xs rounded-full w-4 h-4 flex items-center justify-center font-body font-semibold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="p-2 text-bark hover:text-wood transition-colors duration-200 rounded-full hover:bg-cream flex items-center gap-2"
                >
                  <FiUser className="w-5 h-5" />
                  {isAuthenticated && (
                    <span className="text-sm font-body font-medium hidden md:block">
                      {user?.name?.split(' ')[0]}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {userDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-52 bg-linen/98 backdrop-blur-md rounded-2xl shadow-luxury border border-sand/30 overflow-hidden"
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="px-5 py-4 border-b border-sand/30">
                            <p className="font-body font-semibold text-bark text-sm">{user?.name}</p>
                            <p className="font-body text-xs text-sand mt-0.5">{user?.email}</p>
                          </div>
                          <Link to="/profile" onClick={() => setUserDropdown(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-body text-bark hover:bg-cream hover:text-wood transition-colors">
                            <FiUser className="w-4 h-4" /> My Profile
                          </Link>
                          <Link to="/orders" onClick={() => setUserDropdown(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-body text-bark hover:bg-cream hover:text-wood transition-colors">
                            <FiPackage className="w-4 h-4" /> My Orders
                          </Link>
                          {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setUserDropdown(false)} className="flex items-center gap-3 px-5 py-3 text-sm font-body text-wood font-medium hover:bg-cream transition-colors">
                              <FiSettings className="w-4 h-4" /> Admin Panel
                            </Link>
                          )}
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-3 text-sm font-body text-red-600 hover:bg-red-50 transition-colors border-t border-sand/30">
                            <FiLogOut className="w-4 h-4" /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setUserDropdown(false)} className="block px-5 py-3 text-sm font-body text-bark hover:bg-cream hover:text-wood transition-colors font-medium">
                            Login
                          </Link>
                          <Link to="/signup" onClick={() => setUserDropdown(false)} className="block px-5 py-3 text-sm font-body text-wood hover:bg-cream transition-colors font-semibold border-t border-sand/30">
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
                className="lg:hidden p-2 text-bark hover:text-wood transition-colors rounded-full hover:bg-cream"
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-linen border-t border-sand/30 px-4 py-4"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search furniture, categories..."
                  className="input-luxury flex-1"
                />
                <button type="submit" className="btn-primary py-3 px-6">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-bark/40" onClick={() => dispatch(setMobileMenuOpen(false))} />
            <div className="relative w-72 h-full bg-linen shadow-luxury overflow-y-auto">
              <div className="p-6">
                <div className="mb-8 pt-4">
                  <span className="font-display text-2xl font-bold text-bark">
                    maa<span className="text-wood">Vaishno</span>
                  </span>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <div key={link.label}>
                      <NavLink
                        to={link.to}
                        onClick={() => dispatch(setMobileMenuOpen(false))}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl font-body font-medium text-sm transition-colors ${
                            isActive ? 'bg-cream text-wood' : 'text-bark hover:bg-cream hover:text-wood'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                      {link.sub && (
                        <div className="ml-4 mt-1 space-y-1">
                          {link.sub.map(s => (
                            <NavLink
                              key={s.label}
                              to={s.to}
                              onClick={() => dispatch(setMobileMenuOpen(false))}
                              className="block px-4 py-2 rounded-xl font-body text-sm text-wood-dark hover:bg-cream transition-colors"
                            >
                              {s.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-sand/30 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-bark hover:bg-cream transition-colors">
                        <FiUser /> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-bark hover:bg-cream transition-colors">
                        <FiPackage /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-body text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FiLogOut /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => dispatch(setMobileMenuOpen(false))} className="btn-outline w-full text-center block">Login</Link>
                      <Link to="/signup" onClick={() => dispatch(setMobileMenuOpen(false))} className="btn-primary w-full text-center block">Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(userDropdown || categoryDropdown) && (
        <div className="fixed inset-0 z-40" onClick={() => { setUserDropdown(false); setCategoryDropdown(false) }} />
      )}
    </>
  )
}
