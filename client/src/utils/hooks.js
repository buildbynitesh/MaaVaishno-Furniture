import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import toast from 'react-hot-toast'

// ─── useCart ──────────────────────────────────────────────────────────────────
import {
  addToCart as addToCartAction,
  removeFromCart as removeAction,
  increaseQty,
  decreaseQty,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartTotal,
} from '../redux/slices/cartSlice'

export function useCart() {
  const dispatch = useDispatch()
  const items    = useSelector(selectCartItems)
  const count    = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const totals   = useSelector(s => selectCartTotal(s))

  const addToCart = useCallback((product, qty = 1) => {
    for (let i = 0; i < qty; i++) dispatch(addToCartAction(product))
    toast.success(`${product.title} added to cart!`, {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      iconTheme: { primary: '#C4A35A', secondary: '#F5F0E8' },
    })
  }, [dispatch])

  const removeFromCart = useCallback((id) => {
    dispatch(removeAction(id))
  }, [dispatch])

  const clearCart = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  const isInCart = useCallback((id) => {
    return items.some(i => i._id === id)
  }, [items])

  const getQuantity = useCallback((id) => {
    return items.find(i => i._id === id)?.quantity || 0
  }, [items])

  return {
    items, count, subtotal, ...totals,
    addToCart, removeFromCart, clearCart,
    increaseQty: (id) => dispatch(increaseQty(id)),
    decreaseQty: (id) => dispatch(decreaseQty(id)),
    isInCart, getQuantity,
  }
}

// ─── useWishlist ──────────────────────────────────────────────────────────────
import {
  toggleWishlist as toggleAction,
  removeFromWishlist as removeWishlistAction,
  clearWishlist as clearWishlistAction,
  selectWishlistItems,
  selectIsWishlisted,
} from '../redux/slices/wishlistSlice'

export function useWishlist() {
  const dispatch = useDispatch()
  const items    = useSelector(selectWishlistItems)

  const toggle = useCallback((product) => {
    dispatch(toggleAction(product))
    const already = items.some(i => i._id === product._id)
    toast.success(already ? 'Removed from wishlist' : 'Added to wishlist!', {
      style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
    })
  }, [dispatch, items])

  const isWishlisted = useCallback((id) => {
    return items.some(i => i._id === id)
  }, [items])

  return {
    items,
    count: items.length,
    toggle,
    remove: (id) => dispatch(removeWishlistAction(id)),
    clear:  ()   => dispatch(clearWishlistAction()),
    isWishlisted,
  }
}

// ─── useAuth ──────────────────────────────────────────────────────────────────
export function useAuth() {
  const { user, isAuthenticated, isLoading, error } = useSelector(s => s.auth)
  return { user, isAuthenticated, isLoading, error, isAdmin: user?.role === 'admin' }
}

// ─── useMediaQuery ────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

export const useMobile  = () => useMediaQuery('(max-width: 767px)')
export const useTablet  = () => useMediaQuery('(max-width: 1023px)')
export const useDesktop = () => useMediaQuery('(min-width: 1024px)')

// ─── useLocalStorage ──────────────────────────────────────────────────────────
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setValue = (value) => {
    try {
      const val = value instanceof Function ? value(storedValue) : value
      setStoredValue(val)
      window.localStorage.setItem(key, JSON.stringify(val))
    } catch (e) { console.error(e) }
  }

  return [storedValue, setValue]
}

// ─── useDebounce ──────────────────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// ─── useScrollLock ────────────────────────────────────────────────────────────
export function useScrollLock(locked) {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [locked])
}

// ─── useOutsideClick ─────────────────────────────────────────────────────────
import { useRef } from 'react'

export function useOutsideClick(callback) {
  const ref = useRef(null)
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [callback])
  return ref
}
