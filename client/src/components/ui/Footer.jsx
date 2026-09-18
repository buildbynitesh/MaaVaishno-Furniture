import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      toast.success('Subscribed successfully! Welcome to maaVaishno.', {
        style: { background: '#3D2B1F', color: '#F5F0E8', fontFamily: 'DM Sans', borderRadius: '12px' },
      })
      setEmail('')
    }
  }

  return (
    <footer className="bg-bark text-cream/80">
      {/* Newsletter */}
      <div className="bg-wood/20 border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-cream font-semibold mb-1">Stay Inspired</h3>
            <p className="font-body text-cream/60 text-sm">Subscribe for exclusive deals, new arrivals & interior inspiration.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 md:w-72 px-5 py-3 bg-cream/10 border border-cream/20 rounded-full text-cream placeholder-cream/40 font-body text-sm focus:outline-none focus:border-wood-light"
            />
            <button type="submit" className="px-6 py-3 bg-wood-light text-bark rounded-full font-body font-semibold text-sm hover:bg-cream transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-3xl font-bold text-cream">
                maa<span className="text-wood-light">Vaishno</span>
              </span>
              <div className="font-accent text-xs text-wood-light italic tracking-widest">FURNITURE</div>
            </Link>
            <p className="font-body text-sm text-cream/60 leading-relaxed mb-6">
              Crafting premium furniture with love and precision since 2009. Every piece tells a story of quality craftsmanship.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FiInstagram, href: '#', label: 'Instagram' },
                { icon: FiFacebook, href: '#', label: 'Facebook' },
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FiYoutube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-cream/10 rounded-full flex items-center justify-center hover:bg-wood-light hover:text-bark transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-cream font-semibold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop All', to: '/shop' },
                { label: 'New Arrivals', to: '/shop?sort=newest' },
                { label: 'Best Sellers', to: '/shop?bestseller=true' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-sm text-cream/60 hover:text-wood-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-cream font-semibold text-lg mb-5">Categories</h4>
            <ul className="space-y-3">
              {[
                { label: 'Bedroom Furniture', to: '/categories/bedroom' },
                { label: 'Living Room', to: '/categories/living-room' },
                { label: 'Dining Room', to: '/categories/dining' },
                { label: 'Office Furniture', to: '/categories/office' },
                { label: 'Sofas & Couches', to: '/shop?category=sofa' },
                { label: 'Storage & Wardrobes', to: '/shop?category=storage' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-sm text-cream/60 hover:text-wood-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-cream font-semibold text-lg mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-4 h-4 text-wood-light mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-cream/60 leading-relaxed">
                  42 Furniture Avenue, Sector 18,<br />Noida, UP 201301
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-wood-light flex-shrink-0" />
                <a href="tel:+918800123456" className="font-body text-sm text-cream/60 hover:text-wood-light transition-colors">
                  +91 88001 23456
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-wood-light flex-shrink-0" />
                <a href="mailto:niteshgupta919843@gmail.com" className="font-body text-sm text-cream/60 hover:text-wood-light transition-colors">
                  niteshgupta919843@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-cream/5 rounded-xl">
              <p className="font-body text-xs text-cream/50 mb-1">Working Hours</p>
              <p className="font-body text-sm text-cream/70">Mon – Sat: 10am – 7pm</p>
              <p className="font-body text-sm text-cream/70">Sun: 11am – 5pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream/40 text-center sm:text-left">
            © 2026 MaaVaishno Furniture. All rights reserved. Designed & Developed by Nitesh Gupta.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(p => (
              <Link key={p} to="#" className="font-body text-xs text-cream/40 hover:text-wood-light transition-colors">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
