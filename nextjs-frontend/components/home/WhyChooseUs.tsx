'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaLeaf, FaAward, FaClock, FaHeart, FaShieldAlt, FaTruck, FaCheck } from 'react-icons/fa'

const features = [
  {
    icon: FaLeaf,
    title: 'Farm to Table',
    description: 'Fresh ingredients sourced daily from local organic farms'
  },
  {
    icon: FaAward,
    title: '3 Michelin Stars',
    description: 'Recognized globally for culinary excellence'
  },
  {
    icon: FaClock,
    title: 'Impeccable Service',
    description: 'Attentive hospitality without intrusion'
  },
  {
    icon: FaHeart,
    title: 'Crafted with Passion',
    description: 'Every dish is a labor of love and artistry'
  }
]

const highlights = [
  'Seasonal tasting menus',
  'Private dining rooms',
  'Sommelier curated wines',
  'Dietary accommodations'
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-charcoal relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-amber-500 font-medium tracking-widest uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
              A Legacy of 
              <span className="block text-amber-500">Culinary Excellence</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              For over 15 years, we've been crafting unforgettable dining experiences 
              that blend tradition with innovation. Our commitment to excellence shows 
              in every carefully prepared dish and every moment of your visit.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-5 rounded-xl border border-white/10 hover:border-amber-500/50 transition-colors"
                >
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-lg w-fit mb-4">
                    <feature.icon className="text-black text-xl" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {highlights.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                  <FaCheck className="text-amber-500" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800"
                alt="Chef preparing dish"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
            </div>
            
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 left-6 right-6 bg-white p-6 rounded-2xl shadow-2xl"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-charcoal">15+</p>
                  <p className="text-gray-500 text-sm">Years</p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="text-3xl font-bold text-amber-500">3</p>
                  <p className="text-gray-500 text-sm">Michelin Stars</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-charcoal">50K+</p>
                  <p className="text-gray-500 text-sm">Happy Guests</p>
                </div>
              </div>
            </motion.div>
            
            {/* Award Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-black p-4 rounded-full shadow-lg"
            >
              <FaAward className="text-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
