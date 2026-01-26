'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaHamburger, FaCoffee, FaWineGlassAlt, FaPizzaSlice, FaBox } from 'react-icons/fa'

const experiences = [
  {
    id: 'fast-food',
    name: 'Fast Food',
    icon: FaHamburger,
    description: 'Quick bites, bold flavors',
    color: 'from-terracotta to-secondary',
    image: '/images/fast-food.jpg'
  },
  {
    id: 'cafe',
    name: 'Cafe',
    icon: FaCoffee,
    description: 'Coffee & light bites',
    color: 'from-coffee to-primary',
    image: '/images/cafe.jpg'
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    icon: FaWineGlassAlt,
    description: 'Luxury culinary art',
    color: 'from-burgundy to-primary',
    image: '/images/fine-dining.jpg'
  },
  {
    id: 'street-food',
    name: 'Street Food',
    icon: FaPizzaSlice,
    description: 'Authentic local flavors',
    color: 'from-olive to-charcoal',
    image: '/images/street-food.jpg'
  },
  {
    id: 'cloud-kitchen',
    name: 'Cloud Kitchen',
    icon: FaBox,
    description: 'Delivery exclusive',
    color: 'from-accent to-secondary',
    image: '/images/cloud-kitchen.jpg'
  }
]

export default function ExperienceSelector() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-burgundy font-medium tracking-widest uppercase mb-4">
            Choose Your Experience
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Five Unique Culinary Journeys
          </h2>
          <p className="text-charcoal/70 text-lg max-w-2xl mx-auto">
            Select your mood and we will curate the perfect dining experience for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/menu?experience=${exp.id}`}>
                <div className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
                  
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                    <exp.icon className="text-5xl text-white mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-bold text-white mb-2">{exp.name}</h3>
                    <p className="text-white/80 text-sm">{exp.description}</p>
                  </div>

                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
