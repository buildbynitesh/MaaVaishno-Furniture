import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'

import ProductCard from '../components/product/ProductCard'

export default function CategoryPage() {

  const { slug } = useParams()

  const [category, setCategory] =
    useState(null)

  const [products, setProducts] =
    useState([])

  const [otherCategories, setOtherCategories] =
    useState([])

  // FETCH DATA
  useEffect(() => {
    fetchCategoryData()
  }, [slug])

  const fetchCategoryData = async () => {

    try {

      // CATEGORY
      const categoryRes =
        await axios.get(
          '/api/categories'
        )

      const foundCategory =
        categoryRes.data.categories.find(
          (c) => c.slug === slug
        )

      setCategory(foundCategory)

      setOtherCategories(
        categoryRes.data.categories.filter(
          (c) => c.slug !== slug
        )
      )

      // PRODUCTS
      const productRes =
        await axios.get(
          '/api/products'
        )

      const filteredProducts =
        productRes.data.products.filter(
          (p) =>
            p.category?.slug === slug
        )

      setProducts(filteredProducts)

    } catch (error) {

      console.log(error)

    }
  }

  // NOT FOUND
  if (!category) {

    return (
      <div className="pt-24 min-h-screen bg-linen flex items-center justify-center">

        <div className="text-center">

          <h2 className="font-display text-3xl text-bark mb-4">

            Category Not Found

          </h2>

          <Link
            to="/categories"
            className="btn-primary inline-block"
          >

            All Categories

          </Link>

        </div>

      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">

      {/* HERO */}
      <div className="relative h-56 md:h-72 overflow-hidden">

        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-bark/60 flex items-center">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >

              <Link
                to="/categories"
                className="flex items-center gap-2 text-cream/70 font-body text-sm mb-3 hover:text-cream transition-colors"
              >

                <FiArrowLeft className="w-4 h-4" />

                All Categories

              </Link>

              <h1 className="font-display text-4xl md:text-5xl text-cream font-semibold">

                {category.name}

              </h1>

              <p className="font-body text-cream/70 mt-2">

                {products.length} products

              </p>

            </motion.div>

          </div>

        </div>

      </div>

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {products.length === 0 ? (

          <div className="text-center py-20">

            <p className="font-display text-2xl text-bark mb-4">

              No products in this category yet

            </p>

            <Link
              to="/shop"
              className="btn-primary inline-block"
            >

              Browse All Products

            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((p, i) => (

              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />

            ))}

          </div>

        )}

        {/* OTHER CATEGORIES */}
        <div className="mt-16">

          <h2 className="font-display text-2xl text-bark font-semibold mb-6">

            Other Categories

          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            {otherCategories.map(
              (cat, i) => (

                <motion.div
                  key={cat._id}
                  initial={{
                    opacity: 0,
                    y: 10,
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
                    className="group relative rounded-2xl overflow-hidden aspect-video block bg-cream"
                  >

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-bark/50 flex items-center justify-center">

                      <span className="font-display text-cream text-xl font-semibold group-hover:text-wood-light transition-colors">

                        {cat.name}

                      </span>

                    </div>

                  </Link>

                </motion.div>

              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}