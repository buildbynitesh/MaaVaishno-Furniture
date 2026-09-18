// Format currency in INR
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate discount percentage
export const calcDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// Truncate text
export const truncate = (text, maxLen = 80) => {
  if (!text) return ''
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}

// Star rating array
export const getStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return 'full'
    if (i < rating) return 'half'
    return 'empty'
  })
}

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Slugify
export const slugify = (str) => {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

// Get image URL (fallback to placeholder)
export const getImageUrl = (image) => {
  if (!image) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
  if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
    return image
  }
  const defaultApi =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://maavaishnofurniture.onrender.com/api' : '')
  const baseUrl = defaultApi.replace(/\/api\/?$/, '')
  const cleanImage = typeof image === 'string' ? image.replace(/^\/+/, '') : ''
  return baseUrl ? `${baseUrl}/uploads/${cleanImage}` : `/uploads/${cleanImage}`
}

export const SHIPPING_THRESHOLD = 5000
export const SHIPPING_CHARGE = 299
export const TAX_RATE = 0

