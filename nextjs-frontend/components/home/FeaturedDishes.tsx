'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FaStar, FaFire, FaShoppingCart, FaArrowRight } from 'react-icons/fa'

interface Dish {
  _id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  rating?: number
  isSignature?: boolean
}

const fallbackDishes: Dish[] = [
  { _id: '1', name: 'Truffle Risotto', price: 32.99, description: 'Creamy arborio rice with black truffle, aged Parmesan, and fresh herbs', category: 'Fine Dining', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500', rating: 4.9, isSignature: true },
  { _id: '2', name: 'Wagyu Beef Steak', price: 68.99, description: 'Premium A5 Wagyu with roasted vegetables and red wine reduction', category: 'Fine Dining', image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=500', rating: 4.9, isSignature: true },
  { _id: '3', name: 'Pan-Seared Salmon', price: 34.99, description: 'Atlantic salmon with lemon butter, asparagus, and fingerling potatoes', category: 'Seafood', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500', rating: 4.8, isSignature: false },
  { _id: '4', name: 'Lobster Thermidor', price: 54.99, description: 'Classic French preparation with cognac cream sauce and gruyère', category: 'Seafood', image: 'https://images.unsplash.com/photo-1553247407-23251ce81f59?w=500', rating: 4.9, isSignature: true },
  { _id: '5', name: 'Duck Confit', price: 38.99, description: 'Slow-cooked duck leg with cherry gastrique and wild rice', category: 'Fine Dining', image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=500', rating: 4.7, isSignature: false },
  { _id: '6', name: 'Chocolate Soufflé', price: 16.99, description: 'Warm dark chocolate soufflé with vanilla crème anglaise', category: 'Dessert', image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=500', rating: 4.8, isSignature: false }
]

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>(fallbackDishes)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 font-medium tracking-widest uppercase mb-4">
            Chef's Selection
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Signature Dishes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handcrafted creations that define our culinary philosophy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(dish._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={500}
                    height={256}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {dish.isSignature && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <FaFire /> Chef's Special
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-charcoal px-3 py-1 rounded-full text-xs font-medium">
                      {dish.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-charcoal group-hover:text-amber-600 transition-colors">
                      {dish.name}
                    </h3>
                    {dish.rating && (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                        <FaStar className="text-amber-500 text-sm" />
                        <span className="text-amber-700 text-sm font-medium">{dish.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{dish.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-2xl font-bold text-charcoal">₹{dish.price}</span>
                    <Link
                      href="/order"
                      className="flex items-center gap-2 bg-charcoal hover:bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-all group/btn"
                    >
                      <FaShoppingCart className="text-xs" />
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Explore Full Menu
            <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
