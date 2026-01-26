'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaStar, FaFire } from 'react-icons/fa'
import api from '@/lib/api'

interface Dish {
  _id: string
  name: string
  price: number
  description: string
  category: string
  image?: string
  rating?: number
  isSignature?: boolean
}

const fallbackDishes: Dish[] = [
  { _id: '1', name: 'Truffle Risotto', price: 32.99, description: 'Creamy arborio rice with black truffle', category: 'Fine Dining', rating: 4.9, isSignature: true },
  { _id: '2', name: 'Wagyu Burger', price: 24.99, description: 'Premium wagyu beef with special sauce', category: 'Fast Food', rating: 4.8, isSignature: true },
  { _id: '3', name: 'Matcha Tiramisu', price: 12.99, description: 'Japanese-Italian fusion dessert', category: 'Cafe', rating: 4.7 },
  { _id: '4', name: 'Spicy Thai Noodles', price: 15.99, description: 'Authentic street-style noodles', category: 'Street Food', rating: 4.6 },
  { _id: '5', name: 'Lobster Roll', price: 28.99, description: 'Fresh Maine lobster in butter', category: 'Fine Dining', rating: 4.9 },
  { _id: '6', name: 'Artisan Coffee', price: 6.99, description: 'Single origin pour-over', category: 'Cafe', rating: 4.5 }
]

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>(fallbackDishes)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await api.get('/menu')
        if (response.data && response.data.length > 0) {
          setDishes(response.data.slice(0, 6))
        }
      } catch (error) {
        console.log('Using fallback dishes')
      } finally {
        setLoading(false)
      }
    }
    fetchDishes()
  }, [])

  return (
    <section className="py-24 bg-warmWhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-burgundy font-medium tracking-widest uppercase mb-4">
            Chef Recommends
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Featured Dishes
          </h2>
          <p className="text-charcoal/70 text-lg max-w-2xl mx-auto">
            Our most loved dishes handpicked by our executive chef
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
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-cream hover:border-burgundy/50 transition-all shadow-md hover:shadow-xl">
                <div className="relative h-48 bg-gradient-to-br from-burgundy/20 to-accent/20 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                  {dish.isSignature && (
                    <div className="absolute top-4 left-4 bg-burgundy text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaFire /> Signature
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-burgundy text-sm font-medium">{dish.category}</span>
                    {dish.rating && (
                      <div className="flex items-center gap-1 text-accent text-sm">
                        <FaStar />
                        <span>{dish.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-charcoal mb-2">{dish.name}</h3>
                  <p className="text-charcoal/60 text-sm mb-4">{dish.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-burgundy">${dish.price}</span>
                    <Link
                      href="/menu"
                      className="bg-cream hover:bg-burgundy text-charcoal hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
                    >
                      View Details
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
            className="inline-flex items-center gap-2 border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            View Full Menu
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
