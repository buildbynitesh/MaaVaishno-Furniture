import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } })
}

const team = [
  { name: 'Vaishali Sharma', role: 'Founder & CEO', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Manoj Verma', role: 'Head of Design', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Priti Agarwal', role: 'Operations Director', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
]

export default function AboutPage() {
  return (
    <div className="pt-20 min-h-screen bg-linen">
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1600&q=85" alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-bark/65 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="font-accent italic text-wood-light text-xl block mb-3">Our Story</span>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold">About maaVaishno</h1>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:w-1/2">
              <span className="section-subtitle block mb-3">Who We Are</span>
              <h2 className="section-title mb-6">Furniture that tells your story</h2>
              <p className="font-body text-bark/70 leading-relaxed mb-4">
                Founded in 2009, maaVaishno Furniture was born from a simple belief: your home deserves furniture that's as unique as you are. We started as a small workshop in Noida and have grown into one of India's most trusted premium furniture brands.
              </p>
              <p className="font-body text-bark/70 leading-relaxed mb-4">
                Every piece we craft combines traditional Indian woodworking techniques with modern Scandinavian design sensibilities. We source our materials responsibly and work with skilled artisans who pour their heart into each creation.
              </p>
              <p className="font-body text-bark/70 leading-relaxed">
                From the living room sofa your family gathers around to the desk where you do your best work — we believe furniture shapes how we live, love, and create.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" alt="" className="rounded-2xl object-cover aspect-square" />
                <img src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80" alt="" className="rounded-2xl object-cover aspect-square mt-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-bark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '15+', label: 'Years of Excellence', icon: FiAward },
              { num: '10,000+', label: 'Happy Families', icon: FiHeart },
              { num: '500+', label: 'Products', icon: FiGlobe },
              { num: '50+', label: 'Master Craftsmen', icon: FiUsers },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <stat.icon className="w-8 h-8 text-wood-light mx-auto mb-3" />
                <div className="font-display text-4xl text-cream font-bold mb-1">{stat.num}</div>
                <div className="font-body text-cream/60 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="section-subtitle block mb-2">The people behind it</span>
            <h2 className="section-title">Meet Our Team</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <img src={member.image} alt={member.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-4 shadow-card" />
                <h3 className="font-display text-bark font-semibold text-lg">{member.name}</h3>
                <p className="font-body text-sand text-sm mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
