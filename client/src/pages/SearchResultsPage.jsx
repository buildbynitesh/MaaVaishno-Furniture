import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import api from '../api/axios'

import { motion } from 'framer-motion'

import { FiSearch } from 'react-icons/fi'

import ProductCard from '../components/product/ProductCard'

import { Link } from 'react-router-dom'

export default function SearchResultsPage() {

  const [searchParams] =
    useSearchParams()

  const query =
    searchParams.get('q') || ''

  const [results, setResults] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  // FETCH SEARCH RESULTS
  useEffect(() => {

    fetchResults()

  }, [query])

  const fetchResults = async () => {

    try {

      setLoading(true)

      const res = await api.get(
        `/products?search=${query}`
      )

      setResults(
        res.data.products || []
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="pt-20 min-h-screen bg-linen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-10"
        >

          <div className="flex items-center gap-3 mb-2">

            <FiSearch className="w-6 h-6 text-sand" />

            <h1 className="font-display text-4xl text-bark font-semibold">

              {query
                ? `"${query}"`
                : 'Search Results'}

            </h1>

          </div>

          <p className="font-body text-sand ml-9">

            {results.length}{' '}

            {results.length === 1
              ? 'result'
              : 'results'}{' '}

            found

          </p>

        </motion.div>

        {/* LOADING */}
        {loading ? (

          <div className="text-center py-20">

            <h2 className="font-display text-3xl text-bark">

              Searching...

            </h2>

          </div>

        ) : results.length === 0 ? (

          // NO RESULTS
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-20"
          >

            <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">

              <FiSearch className="w-10 h-10 text-sand" />

            </div>

            <h2 className="font-display text-2xl text-bark font-semibold mb-3">

              No results found

            </h2>

            <p className="font-body text-sand mb-8 max-w-md mx-auto leading-relaxed">

              We couldn't find anything
              for{' '}

              <span className="text-bark font-medium">

                "{query}"

              </span>

              . Try different keywords or
              browse our categories.

            </p>

            <div className="flex gap-4 justify-center flex-wrap">

              <Link
                to="/shop"
                className="btn-primary"
              >

                Browse All Products

              </Link>

              <Link
                to="/categories"
                className="btn-outline"
              >

                View Categories

              </Link>

            </div>

          </motion.div>

        ) : (

          // RESULTS
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {results.map((p, i) => (

              <ProductCard
                key={p._id}
                product={p}
                index={i}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  )
}