import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  }

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-bark/40 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`relative bg-linen rounded-3xl shadow-luxury w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
            onClick={e => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-sand/20">
                <h2 className="font-display text-xl text-bark font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bark hover:bg-sand/40 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
            {!title && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bark hover:bg-sand/40 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
            <div className={title ? 'p-6' : 'p-0'}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
