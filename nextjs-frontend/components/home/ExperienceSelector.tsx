'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaUtensils, FaCoffee, FaWineGlassAlt, FaConciergeBell, FaGlassCheers } from 'react-icons/fa'

const experiences = [
  {
    id: 'tasting-menu',
    name: 'Tasting Menu',
    icon: FaUtensils,
    description: '7-course chef\'s selection',
    price: 'From ₹12,499/person',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
  },
  {
    id: 'wine-pairing',
    name: 'Wine Pairing',
    icon: FaWineGlassAlt,
    description: 'Sommelier curated selection',
    price: 'Add ₹6,249/person',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600'
  },
  {
    id: 'private-dining',
    name: 'Private Dining',
    icon: FaConciergeBell,
    description: 'Exclusive chef\'s table experience',
    price: 'Starting ₹2,00,000',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
  },
  {
    id: 'brunch',
    name: 'Weekend Brunch',
    icon: FaCoffee,
    description: 'Leisurely weekend indulgence',
    price: 'From ₹5,399/person',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'
  },
  {
    id: 'cocktails',
    name: 'Bar & Lounge',
    icon: FaGlassCheers,
    description: 'Craft cocktails & small plates',
    price: 'Walk-ins welcome',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600'
  }
]

export default function ExperienceSelector() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">
            Curated Experiences
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Choose Your Journey
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Every visit offers a unique opportunity to explore our culinary artistry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/menu?experience=${exp.id}`}>
                <div className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all">
                  <Image
                    src={exp.image}
                    alt={exp.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-end p-5">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 w-fit mb-3">
                      <exp.icon className="text-2xl text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{exp.name}</h3>
                    <p className="text-white/70 text-sm mb-2">{exp.description}</p>
                    <p className="text-amber-400 text-sm font-medium">{exp.price}</p>
                  </div>

                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-amber-500/50 rounded-2xl transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
