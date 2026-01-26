'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaPlay, FaShieldAlt, FaLeaf, FaUserTie } from 'react-icons/fa'

const badges = [
  { icon: FaShieldAlt, text: 'FSSAI Certified' },
  { icon: FaLeaf, text: 'Organic Ingredients' },
  { icon: FaUserTie, text: 'Expert Chefs' }
]

export default function LiveKitchenPreview() {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[400px] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-burgundy/20 border border-burgundy/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-burgundy w-20 h-20 rounded-full flex items-center justify-center cursor-pointer shadow-lg shadow-burgundy/30"
                >
                  <FaPlay className="text-white text-2xl ml-1" />
                </motion.div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.text}
                    className="bg-charcoal/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm"
                  >
                    <badge.icon className="text-accent" />
                    <span className="text-cream">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-medium tracking-widest uppercase mb-4">
              Transparency & Trust
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-cream mb-6">
              Watch Our Live Kitchen
            </h2>
            <p className="text-cream/80 text-lg mb-8 leading-relaxed">
              Experience complete transparency with our live kitchen feed. Watch our expert 
              chefs prepare your meals with the freshest ingredients and highest hygiene standards.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live kitchen cameras 24/7</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Today's fresh ingredients sourced this morning</span>
              </div>
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Meet our award-winning chef team</span>
              </div>
            </div>

            <Link
              href="/live-kitchen"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-neutral-900 px-8 py-4 rounded-full font-bold transition-all"
            >
              <FaPlay className="text-sm" />
              Watch Live Kitchen
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
