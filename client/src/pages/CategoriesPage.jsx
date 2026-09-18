import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { motion } from 'framer-motion'

export default function CategoriesPage() {

  const [categories, setCategories] =
    useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {

    try {

      const res = await api.get(
        '/categories'
      )

      setCategories(
        res.data.categories || []
      )

    } catch (error) {

      console.log(error)

    }
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center mb-14"
        >

          <span className="font-accent italic text-wood text-xl block mb-2">

            Explore our range

          </span>

          <h1 className="font-display text-5xl text-bark font-semibold">

            All Categories

          </h1>

        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {categories.map((cat, i) => (

            <motion.div
              key={cat._id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: i * 0.1,
              }}
            >

              <Link
                to={`/categories/${cat.slug}`}
                className="group relative block rounded-3xl overflow-hidden aspect-video bg-cream shadow-card hover:shadow-hover transition-all duration-400"
              >

                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-bark/70 to-transparent flex items-end p-8">

                  <div>

                    <h2 className="font-display text-3xl text-cream font-semibold mb-1">

                      {cat.name}

                    </h2>

                    <p className="font-body text-cream/70 text-sm">

                      Premium Furniture Collection

                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 bg-wood-light/20 backdrop-blur-sm border border-wood-light/40 text-wood-light px-4 py-2 rounded-full font-body text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">

                      Shop {cat.name} →

                    </div>

                  </div>

                </div>

              </Link>

            </motion.div>

          ))}

        </div>

      </div>

    </div>
  )
}