import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  FiTruck,
  FiAward,
  FiShield,
  FiHeadphones,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi'

import Hero from '../components/hero/Hero'
import ProductCard from '../components/product/ProductCard'
import { getImageUrl } from '../utils/helpers'

import {
  mockCategories,
  mockTestimonials,
} from '../utils/mockData'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },

  visible: (i = 0) => ({
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

const features = [
  {
    icon: FiTruck,
    title: 'Free Delivery',
    desc: 'On all orders above ₹5,000. Fast & safe shipping.',
  },

  {
    icon: FiAward,
    title: 'Premium Quality',
    desc: 'Solid wood & premium materials. Built to last.',
  },

  {
    icon: FiShield,
    title: 'Secure Payment',
    desc: 'Razorpay, UPI, Cards — 100% secure checkout.',
  },

  {
    icon: FiHeadphones,
    title: '24/7 Support',
    desc: 'Dedicated support whenever you need us.',
  },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const featured = products.filter((p) => p.featured)
  const bestsellers = products.filter((p) => p.bestseller)

  // FETCH PRODUCTS & CATEGORIES
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data.products || [])
    } catch (error) {
      console.log(error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      if (res.data.categories?.length > 0) {
        setCategories(res.data.categories)
      } else {
        setCategories(mockCategories)
      }
    } catch (error) {
      setCategories(mockCategories)
    }
  }

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <Hero />

      {/* FEATURES */}
      <section className="py-16 bg-cream border-y border-sand/30">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((f, i) => (

              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
              >

                <div className="w-12 h-12 bg-wood/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-wood" />
                </div>

                <div>
                  <h3 className="font-display text-bark font-semibold text-base">
                    {f.title}
                  </h3>

                  <p className="font-body text-xs text-sand mt-1 leading-relaxed hidden sm:block">
                    {f.desc}
                  </p>
                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <section className="py-20 bg-linen">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >

            <span className="section-subtitle block mb-2">
              Explore our range
            </span>

            <h2 className="section-title">
              Shop by Category
            </h2>

          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {(categories.length > 0 ? categories : mockCategories).map((cat, i) => (
              <motion.div
                key={cat._id || cat.slug || i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={`/categories/${cat.slug}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[3/4] bg-cream"
                >
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-bark/70 via-bark/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">

                    <h3 className="font-display text-cream text-xl font-semibold">
                      {cat.name}
                    </h3>

                    <p className="font-body text-cream/70 text-sm mt-1">
                      {cat.count} products
                    </p>

                  </div>

                </Link>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-cream">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-end justify-between mb-12"
          >

            <div>
              <span className="section-subtitle block mb-2">
                Handpicked for you
              </span>

              <h2 className="section-title">
                Featured Products
              </h2>
            </div>

          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {featured.slice(0, 8).map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />
            ))}

          </div>

        </div>

      </section>

      {/* BESTSELLERS */}
      <section className="py-20 bg-linen">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="flex items-end justify-between mb-12"
          >

            <div>

              <span className="section-subtitle block mb-2">
                Most loved
              </span>

              <h2 className="section-title">
                Best Sellers
              </h2>

            </div>

          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {bestsellers.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />
            ))}

          </div>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cream">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >

            <span className="section-subtitle block mb-2">
              Customer Stories
            </span>

            <h2 className="section-title">
              What Our Customers Say
            </h2>

          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {mockTestimonials.map((t, i) => (

              <motion.div
                key={t._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-7 shadow-card"
              >

                <div className="flex items-center gap-1 mb-4">

                  {Array.from(
                    { length: t.rating },
                    (_, i) => (
                      <FiStar
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-current"
                      />
                    )
                  )}

                </div>

                <p className="font-body text-bark/80 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-3">

                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>

                    <p className="font-display text-bark font-semibold text-sm">
                      {t.name}
                    </p>

                    <p className="font-body text-sand text-xs">
                      {t.location} · {t.product}
                    </p>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

    </div>
  )
}