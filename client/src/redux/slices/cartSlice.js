import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  try {
    const cart = localStorage.getItem('maaVaishnoCart')
    return cart ? JSON.parse(cart) : []
  } catch { return [] }
}

const saveCart = (items) => {
  try {
    localStorage.setItem('maaVaishnoCart', JSON.stringify(items))
  } catch {}
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    coupon: null,
    couponDiscount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const addedQty = Math.max(1, action.payload.quantity || 1)
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        existing.quantity = Math.min(existing.quantity + addedQty, existing.stock || 99)
      } else {
        state.items.push({ ...action.payload, quantity: addedQty })
      }
      saveCart(state.items)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
      saveCart(state.items)
    },
    increaseQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload)
      if (item) item.quantity = Math.min(item.quantity + 1, item.stock || 99)
      saveCart(state.items)
    },
    decreaseQty: (state, action) => {
      const item = state.items.find(i => i._id === action.payload)
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter(i => i._id !== action.payload)
        } else {
          item.quantity -= 1
        }
      }
      saveCart(state.items)
    },
    clearCart: (state) => {
      state.items = []
      state.coupon = null
      state.couponDiscount = 0
      localStorage.removeItem('maaVaishnoCart')
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.code
      state.couponDiscount = action.payload.discount
    },
    removeCoupon: (state) => {
      state.coupon = null
      state.couponDiscount = 0
    },
  },
})

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart, applyCoupon, removeCoupon } = cartSlice.actions

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartSubtotal = (state) => state.cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state)
  const shipping = subtotal > 5000 ? 0 : 299
  const discount = state.cart.couponDiscount || 0
  return { subtotal, shipping, tax: 0, discount, total: Math.max(0, subtotal + shipping - discount) }
}

export default cartSlice.reducer
