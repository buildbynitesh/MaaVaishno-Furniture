import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi'

const slides = [
  {
    id: 1,
    tag: 'New Collection 2026',
    title: 'Crafted for\nLiving Well',
    subtitle: 'Discover furniture that tells your story — where premium materials meet timeless design.',
    cta: 'Explore Collection',
    link: '/shop',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=90',
    accent: 'Bedroom',
  },
  {
    id: 2,
    tag: 'Bestseller',
    title: 'Where Comfort\nMeets Craft',
    subtitle: 'Handpicked pieces in solid wood and premium upholstery, built for generations.',
    cta: 'Shop Now',
    link: '/shop',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&q=90',
    accent: 'Living Room',
  },
  {
    id: 3,
    tag: 'Office Collection',
    title: 'Your Space,\nRefined',
    subtitle: 'Transform every room into a sanctuary with our curated furniture collections.',
    cta: 'View Office Range',
    link: '/categories/office',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=90',
    accent: 'Office',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent(c => (c - 1 + slides.length) % slides.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent(c => (c + 1) % slides.length)
  }

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 100 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bark/70 via-bark/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-bark/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                {/* Tag */}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block font-accent italic text-wood-light text-lg mb-4"
                >
                  — {slide.tag}
                </motion.span>

                {/* Title */}
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream font-bold leading-tight mb-6 whitespace-pre-line">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="font-body text-cream/80 text-lg mb-10 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    to={slide.link}
                    className="inline-flex items-center gap-2 bg-wood-light text-bark px-8 py-4 rounded-full font-body font-semibold text-sm tracking-wide hover:bg-cream transition-all duration-300 hover:shadow-hover hover:-translate-y-0.5 group"
                  >
                    {slide.cta}
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 border border-cream/60 text-cream px-8 py-4 rounded-full font-body text-sm font-medium tracking-wide hover:bg-cream/10 transition-all duration-300"
                  >
                    View Categories
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-0 right-0 flex justify-between px-4 z-20 pointer-events-none">
        <button
          onClick={prev}
          className="pointer-events-auto w-11 h-11 bg-cream/20 backdrop-blur-sm border border-cream/30 rounded-full flex items-center justify-center text-cream hover:bg-cream/30 transition-colors ml-2"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="pointer-events-auto w-11 h-11 bg-cream/20 backdrop-blur-sm border border-cream/30 rounded-full flex items-center justify-center text-cream hover:bg-cream/30 transition-colors mr-2"
        >
          <FiArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'bg-wood-light w-8' : 'bg-cream/40 w-3 hover:bg-cream/70'
              }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 right-8 z-20 hidden md:flex flex-col items-center gap-2 text-cream/60"
      >
        <span className="font-body text-xs tracking-widest uppercase rotate-90 origin-center translate-y-4">Scroll</span>
        <div className="w-px h-10 bg-cream/30" />
      </motion.div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-bark/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-8 sm:gap-16">
          {[
            { num: '10,000+', label: 'Happy Customers' },
            { num: '500+', label: 'Products' },
            { num: '4.9★', label: 'Average Rating' },
            { num: '15+', label: 'Years Experience' },
          ].map((stat, i) => (
            <div key={i} className="text-center hidden sm:block">
              <div className="font-display text-wood-light text-xl font-semibold">{stat.num}</div>
              <div className="font-body text-cream/60 text-xs">{stat.label}</div>
            </div>
          ))}
          <div className="sm:hidden flex gap-6">
            <div className="text-center">
              <div className="font-display text-wood-light text-lg font-semibold">10K+</div>
              <div className="font-body text-cream/60 text-xs">Customers</div>
            </div>
            <div className="text-center">
              <div className="font-display text-wood-light text-lg font-semibold">4.9★</div>
              <div className="font-body text-cream/60 text-xs">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
