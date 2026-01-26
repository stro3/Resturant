'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaCalendarAlt, FaMotorcycle } from 'react-icons/fa'

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-burgundy to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cream rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cream rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-cream mb-6">
            Ready to Experience Something Special?
          </h2>
          <p className="text-cream/90 text-lg mb-10 max-w-2xl mx-auto">
            Whether you want to dine with us or enjoy our food at home, we are here to serve you the best culinary experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/reservation"
                className="flex items-center justify-center gap-3 bg-charcoal text-cream px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-charcoal/90"
              >
                <FaCalendarAlt />
                Reserve a Table
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/order"
                className="flex items-center justify-center gap-3 bg-cream text-charcoal px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-warmWhite"
              >
                <FaMotorcycle />
                Order Delivery
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <p className="text-4xl md:text-5xl font-bold text-cream">5</p>
            <p className="text-cream/80 font-medium">Dining Experiences</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-cream">200+</p>
            <p className="text-cream/80 font-medium">Menu Items</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-cream">15+</p>
            <p className="text-cream/80 font-medium">Expert Chefs</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold text-neutral-900">4.9</p>
            <p className="text-neutral-800 font-medium">Customer Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
