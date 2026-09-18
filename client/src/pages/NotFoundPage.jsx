import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="font-display text-[160px] leading-none text-sand/50 font-bold select-none mb-4">
          404
        </div>
        <h1 className="font-display text-3xl text-bark font-semibold mb-3">Page Not Found</h1>
        <p className="font-body text-sand leading-relaxed mb-10">
          The page you're looking for seems to have wandered off — much like a furniture piece that found a new home.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/shop" className="btn-outline">Browse Products</Link>
        </div>
      </motion.div>
    </div>
  )
}
