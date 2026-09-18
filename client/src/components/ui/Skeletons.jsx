// Skeleton loading components for the maaVaishno Furniture app

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 skeleton rounded-full w-1/3" />
        <div className="h-4 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 skeleton rounded-full w-1/3" />
          <div className="h-3 skeleton rounded-full w-1/4" />
        </div>
      </div>
    </div>
  )
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10 animate-pulse">
          <div className="lg:w-1/2 space-y-4">
            <div className="aspect-square skeleton rounded-3xl" />
            <div className="flex gap-3">
              {[1,2,3].map(i => <div key={i} className="flex-1 aspect-square skeleton rounded-xl" />)}
            </div>
          </div>
          <div className="lg:w-1/2 space-y-4">
            <div className="h-3 skeleton rounded-full w-1/4" />
            <div className="h-8 skeleton rounded-xl w-3/4" />
            <div className="h-8 skeleton rounded-xl w-1/2" />
            <div className="h-4 skeleton rounded-full w-1/3" />
            <div className="h-10 skeleton rounded-xl w-1/2" />
            <div className="space-y-2">
              <div className="h-3 skeleton rounded-full" />
              <div className="h-3 skeleton rounded-full" />
              <div className="h-3 skeleton rounded-full w-2/3" />
            </div>
            <div className="flex gap-4">
              <div className="h-12 skeleton rounded-full flex-1" />
              <div className="h-12 w-12 skeleton rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Card Skeleton
export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
      <div className="px-6 py-4 border-b border-sand/20 flex justify-between">
        <div className="space-y-2">
          <div className="h-3 skeleton rounded-full w-24" />
          <div className="h-4 skeleton rounded-full w-32" />
        </div>
        <div className="h-7 skeleton rounded-full w-20" />
      </div>
      <div className="px-6 py-4 space-y-3">
        {[1,2].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-14 h-14 skeleton rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 skeleton rounded-full w-1/2" />
              <div className="h-3 skeleton rounded-full w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 skeleton rounded-full" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  )
}

// Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="h-screen skeleton" />
  )
}
