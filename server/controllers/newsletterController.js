import mongoose from 'mongoose'

// Inline schema — no need for a separate file
const newsletterSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  active:   { type: Boolean, default: true },
  source:   { type: String, default: 'website' },
}, { timestamps: true })

const Newsletter = mongoose.model('Newsletter', newsletterSchema)

// @desc  Subscribe to newsletter
// @route POST /api/newsletter/subscribe
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

    const existing = await Newsletter.findOne({ email })
    if (existing) {
      if (existing.active) {
        return res.json({ success: true, message: 'Already subscribed!' })
      }
      existing.active = true
      await existing.save()
      return res.json({ success: true, message: 'You\'ve been re-subscribed. Welcome back!' })
    }

    await Newsletter.create({ email })
    res.status(201).json({ success: true, message: 'Subscribed successfully! Welcome to maaVaishno.' })
  } catch (err) {
    next(err)
  }
}

// @desc  Unsubscribe
// @route POST /api/newsletter/unsubscribe
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body
    await Newsletter.findOneAndUpdate({ email }, { active: false })
    res.json({ success: true, message: 'Unsubscribed successfully.' })
  } catch (err) {
    next(err)
  }
}

// @desc  Get all subscribers (admin)
// @route GET /api/newsletter
export const getAllSubscribers = async (req, res, next) => {
  try {
    const count  = await Newsletter.countDocuments({ active: true })
    const emails = await Newsletter.find({ active: true }).select('email createdAt').sort({ createdAt: -1 })
    res.json({ success: true, count, emails })
  } catch (err) {
    next(err)
  }
}
