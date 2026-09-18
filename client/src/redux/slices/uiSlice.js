import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') === 'true',
    searchOpen: false,
    mobileMenuOpen: false,
    quickViewProduct: null,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
      if (state.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setSearchOpen: (state, action) => { state.searchOpen = action.payload },
    setMobileMenuOpen: (state, action) => { state.mobileMenuOpen = action.payload },
    setQuickViewProduct: (state, action) => { state.quickViewProduct = action.payload },
  },
})

export const { toggleDarkMode, setSearchOpen, setMobileMenuOpen, setQuickViewProduct } = uiSlice.actions
export default uiSlice.reducer
