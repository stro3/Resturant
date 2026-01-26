'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-charcoal/90 z-10" />
      
      <img
        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920"
        alt="Restaurant Interior"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent font-medium tracking-widest uppercase mb-4"
        >
          Multi-Experience Food Destination
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          From Street Cravings to
          <span className="text-accent"> Fine Dining</span> Excellence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-cream text-lg md:text-xl mb-10 max-w-2xl mx-auto"
        >
          Discover five unique culinary experiences under one roof. Fast food, fine dining, cafe, street food, and cloud kitchen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/order"
            className="bg-burgundy hover:bg-primary text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Order Online
          </Link>
          <Link
            href="/reservation"
            className="border-2 border-cream text-cream hover:bg-cream hover:text-charcoal px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            Reserve a Table
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-accent rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
