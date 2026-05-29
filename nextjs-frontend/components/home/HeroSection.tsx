'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaPlay, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-preparing-a-plate-in-a-restaurant-43571-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-amber-400 text-sm" />
                ))}
              </div>
              <span className="text-white/80 text-sm">4.9 Rating • 2,500+ Reviews</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Where Every Meal
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                Becomes a Memory
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-lg md:text-xl mb-8 max-w-xl leading-relaxed"
            >
              Experience culinary artistry at its finest. Our Michelin-starred chefs create unforgettable dishes using locally sourced, seasonal ingredients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link
                href="/reservation"
                className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl inline-flex items-center justify-center gap-2"
              >
                Reserve a Table
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/menu"
                className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm inline-flex items-center justify-center gap-2"
              >
                <FaPlay className="text-sm" />
                View Our Menu
              </Link>
            </motion.div>

            {/* Info Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-6 text-white/70"
            >
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-amber-400" />
                <span className="text-sm">350 Fifth Avenue, NYC</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-amber-400" />
                <span className="text-sm">Open 5PM - 11PM Daily</span>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Featured Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-amber-400 font-semibold">Today's Special</span>
                  <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">Limited</span>
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"
                  alt="Featured Dish"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-2xl mb-6"
                />
                <h3 className="text-white text-2xl font-bold mb-2">Chef's Tasting Menu</h3>
                <p className="text-white/70 text-sm mb-4">
                  A 7-course journey through seasonal flavors, paired with premium wines
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white/50 text-sm line-through">₹14,999</span>
                    <span className="text-amber-400 text-2xl font-bold ml-2">₹12,499</span>
                    <span className="text-white/50 text-sm">/person</span>
                  </div>
                  <Link
                    href="/reservation"
                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-amber-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
