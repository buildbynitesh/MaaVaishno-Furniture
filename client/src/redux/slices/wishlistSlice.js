import { createSlice } from '@reduxjs/toolkit'

const loadWishlist = () => {
  try {
    const w = localStorage.getItem('maaVaishnoWishlist')
    return w ? JSON.parse(w) : []
  } catch { return [] }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const exists = state.items.find(i => i._id === action.payload._id)
      if (exists) {
        state.items = state.items.filter(i => i._id !== action.payload._id)
      } else {
        state.items.push(action.payload)
      }
      localStorage.setItem('maaVaishnoWishlist', JSON.stringify(state.items))
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload)
      localStorage.setItem('maaVaishnoWishlist', JSON.stringify(state.items))
    },
    clearWishlist: (state) => {
      state.items = []
      localStorage.removeItem('maaVaishnoWishlist')
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsWishlisted = (id) => (state) => state.wishlist.items.some(i => i._id === id)
export default wishlistSlice.reducer
