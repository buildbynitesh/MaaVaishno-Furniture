import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []
    let l

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i)
    }

    if (range[0] > 2) rangeWithDots.push('...')
    rangeWithDots.unshift(1)
    rangeWithDots.push(...range)
    if (range[range.length - 1] < pages - 1) rangeWithDots.push('...')
    rangeWithDots.push(pages)

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-sand/50 text-bark hover:border-wood hover:text-wood disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft className="w-4 h-4" />
      </button>

      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center font-body text-sand">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl font-body text-sm font-medium transition-all ${
              page === p
                ? 'bg-bark text-cream shadow-sm'
                : 'border border-sand/50 text-bark hover:border-wood hover:text-wood'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-sand/50 text-bark hover:border-wood hover:text-wood disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
