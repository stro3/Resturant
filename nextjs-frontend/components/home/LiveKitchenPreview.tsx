'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaPlay, FaAward, FaLeaf, FaUtensils } from 'react-icons/fa'

const chefs = [
  {
    name: 'Chef Marcus',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    specialty: 'French Cuisine'
  },
  {
    name: 'Chef Elena',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1583394293214-28ez9e9c0e6a?w=400',
    specialty: 'Desserts'
  },
  {
    name: 'Chef Kenji',
    role: 'Sous Chef',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400',
    specialty: 'Asian Fusion'
  }
]

export default function LiveKitchenPreview() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Video Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
                alt="Kitchen in action"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/90 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center cursor-pointer shadow-xl"
                >
                  <FaPlay className="text-charcoal text-2xl ml-1" />
                </motion.div>
              </div>
              
              {/* Live Badge */}
              <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Floating Chef Cards */}
            <div className="absolute -right-4 top-1/4 hidden lg:block">
              {chefs.slice(0, 2).map((chef, i) => (
                <motion.div
                  key={chef.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white p-3 rounded-xl shadow-lg mb-3 flex items-center gap-3"
                >
                  <Image src={chef.image} alt={chef.name} width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="text-charcoal font-semibold text-sm">{chef.name}</p>
                    <p className="text-gray-500 text-xs">{chef.specialty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">
              Behind The Scenes
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
              Meet Our 
              <span className="block text-amber-600">Culinary Artists</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Our team of world-class chefs brings decades of combined experience 
              from Michelin-starred kitchens around the globe. Watch them craft 
              your meal with precision and passion.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaAward className="text-amber-600 text-xl" />
                </div>
                <p className="font-bold text-charcoal">15+</p>
                <p className="text-gray-500 text-sm">Awards</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaUtensils className="text-amber-600 text-xl" />
                </div>
                <p className="font-bold text-charcoal">8</p>
                <p className="text-gray-500 text-sm">Master Chefs</p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaLeaf className="text-amber-600 text-xl" />
                </div>
                <p className="font-bold text-charcoal">100%</p>
                <p className="text-gray-500 text-sm">Fresh Daily</p>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-charcoal hover:bg-charcoal/90 text-white px-8 py-4 rounded-full font-bold transition-all"
            >
              <FaPlay className="text-sm" />
              Watch Kitchen Tour
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
