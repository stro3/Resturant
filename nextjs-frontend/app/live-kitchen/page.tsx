'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPlay, FaPause, FaExpand, FaShieldAlt, FaLeaf, FaUserTie, FaAward, FaCertificate, FaVideo } from 'react-icons/fa'

const chefs = [
  {
    name: 'Chef Marco Rossi',
    title: 'Executive Chef',
    specialty: 'Italian & French Cuisine',
    experience: '20+ years',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400'
  },
  {
    name: 'Chef Yuki Tanaka',
    title: 'Head Sushi Chef',
    specialty: 'Japanese Cuisine',
    experience: '15+ years',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400'
  },
  {
    name: 'Chef Sarah Mitchell',
    title: 'Pastry Chef',
    specialty: 'Desserts & Baking',
    experience: '12+ years',
    image: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400'
  }
]

const certifications = [
  { icon: FaShieldAlt, title: 'FSSAI Certified', description: 'Food Safety and Standards Authority approved' },
  { icon: FaLeaf, title: 'Organic Certified', description: '80% of ingredients from certified organic farms' },
  { icon: FaAward, title: 'ISO 22000', description: 'International food safety management certified' },
  { icon: FaCertificate, title: 'HACCP Compliant', description: 'Hazard analysis and critical control points' }
]

export default function LiveKitchenPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoContainerRef = useRef<HTMLDivElement>(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoContainerRef.current) {
      videoContainerRef.current.requestFullscreen()
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
  }

  return (
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-charcoal text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <FaVideo className="text-accent text-3xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl font-bold mb-6"
          >
            Live Kitchen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-cream/80 text-lg max-w-2xl mx-auto"
          >
            Watch our chefs prepare your meal in real-time. Complete transparency, absolute trust.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={videoContainerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal to-black border border-cream/20"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200"
                alt="Kitchen"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-10 bg-burgundy hover:bg-primary w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-2xl"
              >
                {isPlaying ? (
                  <FaPause className="text-white text-3xl" />
                ) : (
                  <FaPlay className="text-white text-3xl ml-2" />
                )}
              </button>
            </div>

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </div>
                <span className="text-cream/80 text-sm">Main Kitchen - Station 1</span>
              </div>
              <button onClick={toggleFullscreen} className="text-cream/80 hover:text-cream p-2 transition-colors">
                <FaExpand className="text-xl" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {['Main Kitchen', 'Grill Station', 'Pastry Section', 'Sushi Bar'].map((camera, index) => (
              <motion.button
                key={camera}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative aspect-video rounded-lg overflow-hidden bg-charcoal/50 border border-cream/20 group"
              >
                <img
                  src={`https://images.unsplash.com/photo-155691010${index + 3}-1c02745aae4d?w=400`}
                  alt={camera}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-2 left-2 text-cream text-sm font-medium">{camera}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Meet Our Chefs</h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              Our culinary team brings decades of combined experience from the world's finest kitchens
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-playfair text-xl font-bold text-charcoal mb-1">{chef.name}</h3>
                  <p className="text-burgundy font-medium mb-3">{chef.title}</p>
                  <div className="space-y-2 text-sm text-charcoal/70">
                    <p><span className="font-medium">Specialty:</span> {chef.specialty}</p>
                    <p><span className="font-medium">Experience:</span> {chef.experience}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-warmWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Our Certifications</h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              We maintain the highest standards of food safety and quality
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md text-center"
              >
                <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <cert.icon className="text-burgundy text-2xl" />
                </div>
                <h3 className="font-bold text-charcoal mb-2">{cert.title}</h3>
                <p className="text-sm text-charcoal/60">{cert.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
