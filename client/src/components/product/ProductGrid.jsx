import { motion } from 'framer-motion'
import ProductCard from '../product/ProductCard'
import { ProductGridSkeleton } from '../ui/Skeletons'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

/**
 * ProductGrid
 * Smart wrapper around a grid of ProductCards.
 *
 * Props:
 *   products   – array of product objects
 *   loading    – show skeleton loaders
 *   cols       – grid columns config (default: responsive 4-col)
 *   skeletonCount – how many skeletons to show (default 8)
 *   emptyTitle – heading when no products
 *   emptyText  – body when no products
 *   emptyAction – { label, to } CTA when no products
 */
export default function ProductGrid({
  products = [],
  loading = false,
  cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  skeletonCount = 8,
  emptyTitle = 'No products found',
  emptyText  = 'Try adjusting your filters or check back later.',
  emptyAction = { label: 'Browse All', to: '/shop' },
}) {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 col-span-full"
      >
        <FiShoppingBag className="w-16 h-16 text-sand mx-auto mb-4" />
        <h3 className="font-display text-2xl text-bark font-semibold mb-2">{emptyTitle}</h3>
        <p className="font-body text-sand mb-6 max-w-sm mx-auto">{emptyText}</p>
        {emptyAction && (
          <Link to={emptyAction.to} className="btn-primary inline-block">{emptyAction.label}</Link>
        )}
      </motion.div>
    )
  }

  return (
    <div className={`grid ${cols} gap-6`}>
      {products.map((p, i) => (
        <ProductCard key={p._id} product={p} index={i} />
      ))}
    </div>
  )
}
