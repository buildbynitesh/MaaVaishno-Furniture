/**
 * Seed script — populates MongoDB with initial categories, products, admin user
 * Run: node seeder.js
 * Reset: node seeder.js --destroy
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

import mongoose from 'mongoose'
import { User, Category, Product, Coupon } from './models/index.js'

const categories = [
  { name: 'Bedroom', slug: 'bedroom', icon: '🛏️', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80' },
  { name: 'Living Room', slug: 'living-room', icon: '🛋️', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Dining', slug: 'dining', icon: '🪑', image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80' },
  { name: 'Office', slug: 'office', icon: '💼', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80' },
]

const coupons = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 2000 },
  { code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrderValue: 10000 },
  { code: 'MVF15', discountType: 'percentage', discountValue: 15, minOrderValue: 5000 },
]

const importData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MongoDB URI not found! Please set MONGO_URI or MONGODB_URI in server/.env')
    }
    await mongoose.connect(mongoUri)
    console.log('📦 Connected to MongoDB...')

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
    ])

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@maaVaishno.com',
      password: 'admin123',
      role: 'admin',
    })

    // Create demo user
    await User.create({
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'password123',
      role: 'user',
    })

    // Create categories
    const cats = await Category.insertMany(categories)
    const catMap = Object.fromEntries(cats.map(c => [c.slug, c._id]))

    // Create products
    const products = [
      {
        title: 'Zen King Bed Frame', slug: 'zen-king-bed-frame',
        description: 'Crafted from solid sheesham wood with a natural finish. The Zen bed frame brings timeless elegance to your bedroom with its clean lines and warm tones.',
        category: catMap['bedroom'],
        images: ['https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80'],
        price: 34999, originalPrice: 45999, discount: 24, stock: 10, featured: true, bestseller: true,
        ratings: { average: 4.8, count: 124 }, material: 'Solid Sheesham Wood',
      },
      {
        title: 'Oslo 3-Seater Sofa', slug: 'oslo-3-seater-sofa',
        description: 'Scandinavian-inspired sofa with premium fabric upholstery and solid beech wood legs. The perfect centrepiece for any modern living room.',
        category: catMap['living-room'],
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
        price: 52999, originalPrice: 69999, discount: 24, stock: 5, featured: true, bestseller: true,
        ratings: { average: 4.7, count: 89 },
      },
      {
        title: 'Maple Dining Table Set', slug: 'maple-dining-table-set',
        description: 'A stunning 6-seater dining table set in solid mango wood with a warm honey finish. Built to bring family together.',
        category: catMap['dining'],
        images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80'],
        price: 28999, originalPrice: 38000, discount: 24, stock: 8, featured: true, bestseller: false,
        ratings: { average: 4.6, count: 67 },
      },
      {
        title: 'Executive Work Desk', slug: 'executive-work-desk',
        description: 'Sleek and spacious executive desk with cable management and premium wood veneer. Designed for the modern professional.',
        category: catMap['office'],
        images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
        price: 18999, originalPrice: 24999, discount: 24, stock: 15, featured: true, bestseller: false,
        ratings: { average: 4.5, count: 43 },
      },
      {
        title: 'Velvet Accent Chair', slug: 'velvet-accent-chair',
        description: 'Luxuriously upholstered in premium velvet with solid walnut legs. A statement piece that elevates any room.',
        category: catMap['living-room'],
        images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80'],
        price: 12999, originalPrice: 18000, discount: 28, stock: 20, featured: true, bestseller: true,
        ratings: { average: 4.9, count: 201 },
      },
      {
        title: 'Sheesham Wood Wardrobe', slug: 'sheesham-wood-wardrobe',
        description: '4-door solid sheesham wardrobe with hanging space, shelves and drawers. A lifetime investment for your bedroom.',
        category: catMap['bedroom'],
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
        price: 42999, originalPrice: 55000, discount: 22, stock: 6, featured: false, bestseller: true,
        ratings: { average: 4.7, count: 95 },
      },
      {
        title: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair',
        description: 'Full lumbar support, adjustable armrests, breathable mesh back. Your spine will thank you.',
        category: catMap['office'],
        images: ['https://images.unsplash.com/photo-1589384267710-7a25bc5b4862?w=800&q=80'],
        price: 15999, originalPrice: 22000, discount: 27, stock: 25, featured: true, bestseller: true,
        ratings: { average: 4.8, count: 178 },
      },
    ]

    await Product.insertMany(products)
    await Coupon.insertMany(coupons)

    console.log(`
✅ Data seeded successfully!

👤 Admin:     admin@maaVaishno.com / admin123
👤 Demo User: user@demo.com / password123
📦 ${products.length} products created
🏷️  ${categories.length} categories created
🎟️  ${coupons.length} coupons created
    `)

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error('MongoDB URI not found! Please set MONGO_URI or MONGODB_URI in server/.env')
    }
    await mongoose.connect(mongoUri)
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
    ])
    console.log('🗑️  All data destroyed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Destroy failed:', err)
    process.exit(1)
  }
}

if (process.argv[2] === '--destroy') {
  destroyData()
} else {
  importData()
}
