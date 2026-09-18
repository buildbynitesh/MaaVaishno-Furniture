import { motion } from 'framer-motion'

/**
 * SectionWrapper
 * Wraps any section with fade-up animation on scroll into view.
 * Props:
 *   className  – additional classes for the <section> element
 *   title      – optional section heading
 *   subtitle   – optional italic accent sub-heading
 *   titleRight – optional node rendered to the right of the title (e.g. "View All" link)
 *   bg         – background class override (default: 'bg-linen')
 *   py         – vertical padding class (default: 'py-20')
 *   children   – section content
 */
export default function SectionWrapper({
  children,
  className = '',
  title,
  subtitle,
  titleRight,
  bg = 'bg-linen',
  py = 'py-20',
}) {
  return (
    <section className={`${bg} ${py} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(title || subtitle || titleRight) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
          >
            <div>
              {subtitle && (
                <span className="font-accent italic text-wood text-lg block mb-1">{subtitle}</span>
              )}
              {title && (
                <h2 className="font-display text-4xl md:text-5xl text-bark font-semibold">{title}</h2>
              )}
            </div>
            {titleRight && <div className="flex-shrink-0">{titleRight}</div>}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
