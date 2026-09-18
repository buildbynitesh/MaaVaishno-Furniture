import { FiStar } from 'react-icons/fi'

export default function RatingStars({ rating = 0, count = 0, size = 'sm', showCount = true }) {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.floor(rating)
          const half = !filled && i < rating
          return (
            <FiStar
              key={i}
              className={`${sizes[size]} ${
                filled ? 'text-amber-400 fill-current' :
                half ? 'text-amber-300 fill-current opacity-60' :
                'text-sand'
              }`}
            />
          )
        })}
      </div>
      {showCount && (
        <span className="font-body text-xs text-sand">
          {rating > 0 ? rating.toFixed(1) : ''}
          {count > 0 && ` (${count})`}
        </span>
      )}
    </div>
  )
}
