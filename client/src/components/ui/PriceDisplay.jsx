import { formatPrice } from '../../utils/helpers'

export function PriceDisplay({ price, originalPrice, size = 'md' }) {
  const sizes = {
    sm: { price: 'text-base', old: 'text-sm' },
    md: { price: 'text-xl', old: 'text-base' },
    lg: { price: 'text-3xl', old: 'text-xl' },
    xl: { price: 'text-4xl', old: 'text-2xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-baseline gap-3">
      <span className={`font-display text-bark font-bold ${s.price}`}>{formatPrice(price)}</span>
      {originalPrice && originalPrice > price && (
        <span className={`font-body text-sand line-through ${s.old}`}>{formatPrice(originalPrice)}</span>
      )}
    </div>
  )
}

export function DiscountBadge({ discount, className = '' }) {
  if (!discount || discount <= 0) return null
  return (
    <span className={`inline-block bg-wood text-cream text-xs font-body font-semibold px-2.5 py-1 rounded-full ${className}`}>
      -{discount}%
    </span>
  )
}

export function BestsellerBadge({ className = '' }) {
  return (
    <span className={`inline-block bg-bark text-cream text-xs font-body font-semibold px-2.5 py-1 rounded-full ${className}`}>
      Bestseller
    </span>
  )
}

export function StockBadge({ stock }) {
  if (stock > 10) return <span className="font-body text-xs text-green-600 font-medium">✓ In Stock</span>
  if (stock > 0) return <span className="font-body text-xs text-amber-600 font-medium">⚡ Only {stock} left</span>
  return <span className="font-body text-xs text-red-500 font-medium">✗ Out of Stock</span>
}
