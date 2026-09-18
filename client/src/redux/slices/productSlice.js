import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products')
  }
})

export const fetchProductBySlug = createAsyncThunk('products/fetchOne', async (slug, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${slug}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Product not found')
  }
})

export const fetchFeaturedProducts = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products?featured=true&limit=8')
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    featured: [],
    current: null,
    total: 0,
    page: 1,
    pages: 1,
    isLoading: false,
    error: null,
    filters: {
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = { category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '' }
    },
    clearCurrent: (state) => {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.isLoading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchProductBySlug.pending, (state) => { state.isLoading = true })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.isLoading = false
        state.current = action.payload.product
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload.products
      })
  },
})

export const { setFilters, clearFilters, clearCurrent } = productSlice.actions
export default productSlice.reducer
