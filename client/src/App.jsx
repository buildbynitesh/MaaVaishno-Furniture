import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout        from './layouts/MainLayout'
import { Toaster } from 'react-hot-toast'
import HomePage          from './pages/HomePage'
import ShopPage          from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoriesPage    from './pages/CategoriesPage'
import CategoryPage      from './pages/CategoryPage'
import CartPage          from './pages/CartPage'
import CheckoutPage      from './pages/CheckoutPage'
import OrderSuccessPage  from './pages/OrderSuccessPage'
import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import WishlistPage      from './pages/WishlistPage'
import OrdersPage        from './pages/OrdersPage'
import ProfilePage       from './pages/ProfilePage'
import ContactPage       from './pages/ContactPage'
import AboutPage         from './pages/AboutPage'
import SearchResultsPage from './pages/SearchResultsPage'
import NotFoundPage      from './pages/NotFoundPage'
import AdminDashboard    from './pages/admin/AdminDashboard'
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute'

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth pages (no nav/footer) ────────────────────── */}
        <Route path="/login"                  element={<LoginPage />} />
        <Route path="/signup"                 element={<SignupPage />} />
        <Route path="/forgot-password"        element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token"  element={<ResetPasswordPage />} />
        <Route path="/reset-password"         element={<ResetPasswordPage />} />

        {/* ── Main layout ───────────────────────────────────── */}
        <Route element={<MainLayout />}>
          {/* Public */}
          <Route path="/"                    element={<HomePage />} />
          <Route path="/shop"                element={<ShopPage />} />
          <Route path="/product/:slug"       element={<ProductDetailPage />} />
          <Route path="/categories"          element={<CategoriesPage />} />
          <Route path="/categories/:slug"    element={<CategoryPage />} />
          <Route path="/cart"                element={<CartPage />} />
          <Route path="/wishlist"            element={<WishlistPage />} />
          <Route path="/about"               element={<AboutPage />} />
          <Route path="/contact"             element={<ContactPage />} />
          <Route path="/search"              element={<SearchResultsPage />} />

          {/* Protected (login required) */}
          <Route path="/checkout" element={
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute><OrderSuccessPage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><OrdersPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Standalone Dedicated Admin Portal (No customer navbar/footer) ── */}
        <Route path="/admin"   element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '12px 20px',
            boxShadow: '0 8px 30px rgba(61,43,31,0.12)',
          },
        }}
      />
    </BrowserRouter>
  )
}
