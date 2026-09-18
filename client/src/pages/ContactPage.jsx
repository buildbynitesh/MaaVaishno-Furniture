import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await api.post('/contact', form)

      toast.success(res.data.message || 'Message sent successfully!', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })

      setForm({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.', {
        style: {
          background: '#3D2B1F',
          color: '#F5F0E8',
          fontFamily: 'DM Sans',
          borderRadius: '12px',
        },
      })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="pt-20 min-h-screen bg-linen">
      {/* Hero */}
      <div className="bg-bark py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="font-accent italic text-wood-light text-xl block mb-3">Get in touch</span>
          <h1 className="font-display text-5xl text-cream font-semibold">Contact Us</h1>
          <p className="font-body text-cream/60 mt-3">We'd love to hear from you. How can we help?</p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Contact Info */}
          <div className="lg:w-2/5 space-y-5">
            {[
              { icon: FiPhone, title: 'Call Us', lines: ['+91 88001 23456', '+91 88001 23457'], sub: 'Mon–Sat 10am–7pm' },
              { icon: FiMail, title: 'Email Us', lines: ['niteshgupta919843@gmail.com', 'buildbynitesh@gmail.com'], sub: 'Reply within 24 hours' },
              { icon: FiMapPin, title: 'Visit Us', lines: ['42 Furniture Avenue, Sector 18', 'Noida, UP 201301'], sub: 'Showroom open 7 days a week' },
              { icon: FiClock, title: 'Working Hours', lines: ['Mon–Sat: 10am – 7pm', 'Sunday: 11am – 5pm'], sub: '' },
            ].map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 bg-white rounded-2xl p-5 shadow-card"
              >
                <div className="w-11 h-11 bg-wood/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-5 h-5 text-wood" />
                </div>
                <div>
                  <h3 className="font-display text-bark font-semibold">{info.title}</h3>
                  {info.lines.map(l => <p key={l} className="font-body text-sm text-bark/70">{l}</p>)}
                  {info.sub && <p className="font-body text-xs text-sand mt-1">{info.sub}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:flex-1 bg-white rounded-2xl shadow-card p-8"
          >
            <h2 className="font-display text-2xl text-bark font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Your Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input-luxury" placeholder="Priya Sharma" />
                </div>
                <div>
                  <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required className="input-luxury" placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-luxury" placeholder="you@example.com (optional)" />
                </div>
                <div>
                  <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Subject *</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="input-luxury" placeholder="Product inquiry, delivery question..." />
                </div>
              </div>

              <div>
                <label className="font-body text-xs text-bark/60 uppercase tracking-widest mb-1.5 block">Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={5} className="input-luxury resize-none" placeholder="Tell us how we can help you... (optional)" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-cream/40 border-t-cream rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><FiSend className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
