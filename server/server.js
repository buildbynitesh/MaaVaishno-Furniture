import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({
  path: path.resolve(__dirname, '.env')
})

import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

import connectDB from './config/db.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
// ── Security & Utility Middleware ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

app.use(cors({
  origin: [
    'https://maa-vaishno-furniture.vercel.app',
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: 'Too many requests from this IP. Please try again later.',
})
app.use('/api', limiter)

// Auth route rate limit (DDoS guard; client enforces 5 attempts/2min & 3 attempts/5min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: 'Too many requests. Please try again later.',
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Static files (uploaded images) ────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// ── API Routes ────────────────────────────────────────────────────────────
app.use('/api', routes)

// ── Health Check ──────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'maaVaishno Furniture API is running 🪑',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── Serve React App in Production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../client/dist')
  app.use(express.static(clientBuild))
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'))
  })
}

// ── Error Handler ────────────────────────────────────────────────────────
app.use(errorHandler)

// ── Start Server ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
🚀 Server running on http://localhost:${PORT}
🌿 Environment: ${process.env.NODE_ENV}
📦 API: http://localhost:${PORT}/api/health
    `)
  })
})

export default app
