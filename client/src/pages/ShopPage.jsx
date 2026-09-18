import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  FiFilter,
  FiChevronDown,
} from 'react-icons/fi'

import ProductCard from '../components/product/ProductCard'

import { mockCategories } from '../utils/mockData'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'bestseller', label: 'Best Sellers' },
]

export default function ShopPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  )
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [search, setSearch] = useState(searchParams.get('search') || '')

  // FETCH PRODUCTS & CATEGORIES
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products?limit=100')
      setProducts(res.data.products || [])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      if (res.data.categories?.length > 0) {
        setCategories(res.data.categories)
      } else {
        setCategories(mockCategories)
      }
    } catch (error) {
      setCategories(mockCategories)
    }
  }

  // FILTER PRODUCTS
  const filtered = useMemo(() => {

    let filteredProducts = [...products]

    // Search
    if (search) {
      filteredProducts = filteredProducts.filter((p) =>
        p.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    // Categories
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        selectedCategories.includes(
          p.category?.slug
        )
      )
    }

    // Price
    if (priceRange.min) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.price >= Number(priceRange.min)
      )
    }

    if (priceRange.max) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.price <= Number(priceRange.max)
      )
    }

    // Featured
    if (searchParams.get('featured')) {
      filteredProducts = filteredProducts.filter(
        (p) => p.featured
      )
    }

    // Bestseller
    if (searchParams.get('bestseller')) {
      filteredProducts = filteredProducts.filter(
        (p) => p.bestseller
      )
    }

    // SORTING
    switch (sort) {

      case 'price_asc':
        filteredProducts.sort(
          (a, b) => a.price - b.price
        )
        break

      case 'price_desc':
        filteredProducts.sort(
          (a, b) => b.price - a.price
        )
        break

      case 'rating':
        filteredProducts.sort(
          (a, b) =>
            (b.ratings?.average || 0) -
            (a.ratings?.average || 0)
        )
        break

      case 'bestseller':
        filteredProducts.sort(
          (a, b) =>
            (b.bestseller ? 1 : 0) -
            (a.bestseller ? 1 : 0)
        )
        break

      default:
        break
    }

    return filteredProducts

  }, [
    products,
    search,
    selectedCategories,
    priceRange,
    sort,
    searchParams,
  ])

  // TOGGLE CATEGORY
  const toggleCategory = (slug) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    )
  }

  // CLEAR FILTERS
  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange({ min: '', max: '' })
    setSearch('')
    setSort('newest')
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">

      {/* HEADER */}
      <div className="bg-cream border-b border-sand/30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <h1 className="font-display text-4xl text-bark font-semibold mb-2">

            {search
              ? `Search: "${search}"`
              : 'All Products'}

          </h1>

          <p className="font-body text-sm text-sand">
            {filtered.length} products found
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* TOOLBAR */}
        <div className="flex items-center justify-between mb-6 gap-4">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setFiltersOpen(!filtersOpen)
              }
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sand/50 rounded-xl font-body text-sm text-bark hover:border-wood transition-colors"
            >

              <FiFilter className="w-4 h-4" />

              Filters

            </button>

            {/* CATEGORY CHIPS */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {(categories.length > 0 ? categories : mockCategories).map((cat) => (
                <button
                  key={cat._id || cat.slug}
                  onClick={() =>
                    toggleCategory(cat.slug)
                  }
                  className={`px-4 py-2 rounded-full font-body text-xs font-medium transition-all ${
                    selectedCategories.includes(cat.slug)
                      ? 'bg-bark text-cream'
                      : 'bg-white border border-sand/50 text-bark hover:border-wood'
                  }`}
                >

                  {cat.name}

                </button>

              ))}

            </div>

          </div>

          {/* SORT */}
          <div className="relative">

            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="appearance-none bg-white border border-sand/50 rounded-xl px-4 py-2.5 font-body text-sm text-bark focus:outline-none focus:border-wood pr-8"
            >

              {SORT_OPTIONS.map((o) => (

                <option
                  key={o.value}
                  value={o.value}
                >

                  {o.label}

                </option>

              ))}

            </select>

            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-sand pointer-events-none" />

          </div>

        </div>

        {/* FILTER PANEL */}
        {filtersOpen && (

          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            className="bg-white rounded-2xl p-6 mb-6 shadow-card"
          >

            <div className="flex items-center justify-between mb-5">

              <h3 className="font-display text-bark font-semibold">
                Filters
              </h3>

              <button
                onClick={clearFilters}
                className="font-body text-sm text-wood hover:text-wood-dark"
              >
                Clear all
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* SEARCH */}
              <div>

                <label className="font-body text-xs text-sand uppercase tracking-widest mb-2 block">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search products..."
                  className="input-luxury"
                />

              </div>

              {/* PRICE */}
              <div>

                <label className="font-body text-xs text-sand uppercase tracking-widest mb-2 block">
                  Price Range
                </label>

                <div className="flex gap-2 items-center">

                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        min: e.target.value,
                      }))
                    }
                    placeholder="Min"
                    className="input-luxury flex-1"
                  />

                  <span className="text-sand">
                    —
                  </span>

                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((p) => ({
                        ...p,
                        max: e.target.value,
                      }))
                    }
                    placeholder="Max"
                    className="input-luxury flex-1"
                  />

                </div>

              </div>

            </div>

          </motion.div>

        )}

        {/* PRODUCTS */}
        {filtered.length === 0 ? (

          <div className="text-center py-20">

            <div className="text-6xl mb-4">
              🔍
            </div>

            <h3 className="font-display text-2xl text-bark mb-2">
              No products found
            </h3>

            <p className="font-body text-sand mb-6">
              Try adjusting your filters
            </p>

            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filtered.map((p, i) => (

              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  )
}