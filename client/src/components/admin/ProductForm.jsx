import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiUpload,
  FiX,
  FiSave,
  FiArrowLeft,
} from 'react-icons/fi'

import api from '../../api/axios'
import toast from 'react-hot-toast'

const INITIAL = {
  title: '',
  slug: '',
  description: '',
  category: '',
  price: '',
  originalPrice: '',
  stock: '',
  discount: '',
  featured: false,
  bestseller: false,
  material: '',
  color: '',
  tags: '',
  images: [],
}

export default function ProductForm({
  product = null,
  onSave,
  onCancel,
}) {

  const [form, setForm] = useState(
    product
      ? {
          ...product,
          tags:
            product.tags?.join(', ') || '',
          category:
            product.category?.name?._id ||
            product.category?.name ||
            product.category?._id ||
            product.category ||
            '',
        }
      : INITIAL
  )

  const [previews, setPreviews] = useState(
    product?.images || []
  )

  const [loading, setLoading] =
    useState(false)

  const set = (key, val) =>
    setForm((f) => ({
      ...f,
      [key]: val,
    }))

  // AUTO SLUG
  const handleTitleChange = (val) => {
    set('title', val)
    if (!product) {
      set(
        'slug',
        val
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
      )
    }
  }

  // AUTO DISCOUNT
  const handlePriceChange = (
    key,
    val
  ) => {
    const newForm = {
      ...form,
      [key]: val,
    }

    if (
      newForm.price &&
      newForm.originalPrice &&
      Number(newForm.originalPrice) >
        Number(newForm.price)
    ) {
      newForm.discount = Math.round(
        ((newForm.originalPrice -
          newForm.price) /
          newForm.originalPrice) *
          100
      )
    }

    setForm(newForm)
  }

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const files = Array.from(
      e.target.files
    )

    if (
      files.length + previews.length >
      6
    ) {
      toast.error(
        'Maximum 6 images allowed'
      )
      return
    }

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews((prev) => [
          ...prev,
          ev.target.result,
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  // REMOVE IMAGE
  const removeImage = (idx) => {
    setPreviews((prev) =>
      prev.filter((_, i) => i !== idx)
    )
  }

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !form.title ||
      !form.price ||
      !form.category
    ) {
      toast.error(
        'Please fill required fields'
      )
      return
    }

    try {
      setLoading(true)

      const payload = {
        ...form,
        images: previews,
        tags:
          typeof form.tags === 'string'
            ? form.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : form.tags,
      }

      if (onSave) {
        await onSave(payload)
      } else {
        if (product?._id) {
          await api.put(`/products/${product._id}`, payload)
        } else {
          await api.post('/products', payload)
        }
      }

      toast.success(
        product
          ? 'Product updated successfully!'
          : 'Product created successfully!',
        {
          style: {
            background: '#3D2B1F',
            color: '#F5F0E8',
            fontFamily: 'DM Sans',
            borderRadius: '12px',
          },
        }
      )

    } catch (error) {

      console.log(error)

      toast.error(
        error.response?.data?.message ||
          'Something went wrong'
      )

    } finally {

      setLoading(false)

    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl shadow-card overflow-hidden"
    >

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-sand/20 bg-cream/30">

        <div className="flex items-center gap-3">

          {onCancel && (

            <button
              onClick={onCancel}
              className="p-2 rounded-xl hover:bg-sand/30 text-bark transition-colors"
            >

              <FiArrowLeft className="w-4 h-4" />

            </button>

          )}

          <h2 className="font-display text-xl text-bark font-semibold">

            {product
              ? 'Edit Product'
              : 'Add New Product'}

          </h2>

        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary flex items-center gap-2 text-sm py-2.5 disabled:opacity-60"
        >

          {loading ? (

            <span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" />

          ) : (

            <FiSave className="w-4 h-4" />

          )}

          {product
            ? 'Update'
            : 'Create'}{' '}
          Product

        </button>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="p-6"
      >

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-5">

            {/* TITLE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="sm:col-span-2">

                <label className="admin-label">
                  Product Title *
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    handleTitleChange(
                      e.target.value
                    )
                  }
                  className="input-luxury"
                  placeholder="Luxury Sofa"
                  required
                />

              </div>

              {/* SLUG */}
              <div>

                <label className="admin-label">
                  URL Slug *
                </label>

                <input
                  value={form.slug}
                  onChange={(e) =>
                    set(
                      'slug',
                      e.target.value
                    )
                  }
                  className="input-luxury"
                  required
                />

              </div>

              {/* CATEGORY */}
              <div>

                <label className="admin-label">
                  Category *
                </label>

                <input
                  value={form.category}
                  onChange={(e) =>
                    set(
                      'category',
                      e.target.value
                    )
                  }
                  className="input-luxury"
                  placeholder="Beds"
                  required
                />

              </div>

            </div>

            {/* DESCRIPTION */}
            <div>

              <label className="admin-label">
                Description *
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  set(
                    'description',
                    e.target.value
                  )
                }
                className="input-luxury resize-none"
                rows={4}
                required
              />

            </div>

            {/* PRICING */}
            <div className="bg-cream/50 rounded-2xl p-4">

              <h3 className="font-display text-bark font-semibold mb-4">

                Pricing & Inventory

              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                <div>

                  <label className="admin-label">
                    Sale Price *
                  </label>

                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      handlePriceChange(
                        'price',
                        e.target.value
                      )
                    }
                    className="input-luxury"
                    required
                  />

                </div>

                <div>

                  <label className="admin-label">
                    Old Price
                  </label>

                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) =>
                      handlePriceChange(
                        'originalPrice',
                        e.target.value
                      )
                    }
                    className="input-luxury"
                  />

                </div>

                <div>

                  <label className="admin-label">
                    Discount %
                  </label>

                  <input
                    type="number"
                    value={form.discount}
                    className="input-luxury bg-sand/20"
                    readOnly
                  />

                </div>

                <div>

                  <label className="admin-label">
                    Stock *
                  </label>

                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      set(
                        'stock',
                        e.target.value
                      )
                    }
                    className="input-luxury"
                    required
                  />

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div>

            <label className="admin-label">
              Product Images
            </label>

            <div className="border-2 border-dashed border-sand rounded-2xl p-6 text-center hover:border-wood transition-colors bg-cream/30">

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="product-images"
              />

              <label
                htmlFor="product-images"
                className="cursor-pointer block"
              >

                <FiUpload className="w-8 h-8 text-sand mx-auto mb-3" />

                <p className="font-body text-sm text-bark font-medium">

                  Upload Images

                </p>

              </label>

            </div>

            {/* PREVIEW */}
            {previews.length > 0 && (

              <div className="grid grid-cols-2 gap-3 mt-4">

                {previews.map((src, i) => (

                  <div
                    key={i}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-cream"
                  >

                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(i)
                      }
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >

                      <FiX className="w-3 h-3" />

                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </form>

      <style>{`
        .admin-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(61,43,31,0.6);
          margin-bottom: 0.375rem;
        }
      `}</style>

    </motion.div>
  )
}