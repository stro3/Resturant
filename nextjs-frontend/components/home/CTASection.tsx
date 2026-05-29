'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaCalendarAlt, FaPhone, FaGift, FaEnvelope } from 'react-icons/fa'

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920"
          alt="Restaurant interior"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500 font-medium tracking-widest uppercase mb-4">
              Reserve Your Table
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
              An Unforgettable 
              <span className="block text-amber-500">Evening Awaits</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Join us for an extraordinary culinary journey. From intimate dinners 
              to special celebrations, we create moments that last a lifetime.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/reservation"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-8 py-4 rounded-full font-bold text-lg transition-all hover:shadow-lg hover:shadow-amber-500/25"
                >
                  <FaCalendarAlt />
                  Book a Table
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="tel:+1234567890"
                  className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/20"
                >
                  <FaPhone />
                  Call Us
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 col-span-2">
              <h3 className="text-white font-bold text-lg mb-2">Opening Hours</h3>
              <div className="grid grid-cols-2 gap-4 text-gray-400">
                <div>
                  <p className="text-white font-medium">Lunch</p>
                  <p className="text-sm">Mon-Sun: 12:00 - 15:00</p>
                </div>
                <div>
                  <p className="text-white font-medium">Dinner</p>
                  <p className="text-sm">Mon-Sun: 18:00 - 23:00</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <FaGift className="text-amber-500 text-2xl mb-3" />
              <h3 className="text-white font-bold mb-1">Gift Cards</h3>
              <p className="text-gray-500 text-sm">The perfect present for food lovers</p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <FaEnvelope className="text-amber-500 text-2xl mb-3" />
              <h3 className="text-white font-bold mb-1">Private Events</h3>
              <p className="text-gray-500 text-sm">Tailored experiences for your occasion</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
