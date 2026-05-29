'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaFire, FaLeaf, FaSearch, FaFilter } from 'react-icons/fa'

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials']
const experiences = ['All', 'Fine Dining', 'Fast Food', 'Cafe', 'Street Food', 'Cloud Kitchen']

const menuItems = [
  {
    id: 1,
    name: 'Truffle Risotto',
    description: 'Creamy Arborio rice with imported black truffle, aged Parmesan, and fresh herbs',
    price: 32.99,
    category: 'Main Course',
    experience: 'Fine Dining',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
    rating: 4.9,
    isSignature: true,
    isVeg: true
  },
  {
    id: 2,
    name: 'Wagyu Beef Burger',
    description: 'Premium Wagyu beef patty with caramelized onions, truffle aioli, and brioche bun',
    price: 24.99,
    category: 'Main Course',
    experience: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    rating: 4.8,
    isSignature: true,
    isVeg: false
  },
  {
    id: 3,
    name: 'Matcha Tiramisu',
    description: 'Japanese-Italian fusion dessert with organic matcha and mascarpone cream',
    price: 12.99,
    category: 'Desserts',
    experience: 'Cafe',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    rating: 4.7,
    isSignature: false,
    isVeg: true
  },
  {
    id: 4,
    name: 'Pad Thai Noodles',
    description: 'Authentic Thai rice noodles with prawns, tofu, crushed peanuts, and tamarind sauce',
    price: 15.99,
    category: 'Main Course',
    experience: 'Street Food',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    rating: 4.6,
    isSignature: false,
    isVeg: false
  },
  {
    id: 5,
    name: 'Lobster Bisque',
    description: 'Rich and creamy lobster soup with cognac, fresh cream, and herb oil',
    price: 18.99,
    category: 'Starters',
    experience: 'Fine Dining',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    rating: 4.9,
    isSignature: true,
    isVeg: false
  },
  {
    id: 6,
    name: 'Artisan Coffee',
    description: 'Single origin Ethiopian pour-over with notes of blueberry and dark chocolate',
    price: 6.99,
    category: 'Beverages',
    experience: 'Cafe',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    rating: 4.5,
    isSignature: false,
    isVeg: true
  },
  {
    id: 7,
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with lemon butter sauce, asparagus, and roasted potatoes',
    price: 28.99,
    category: 'Main Course',
    experience: 'Fine Dining',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    rating: 4.8,
    isSignature: false,
    isVeg: false
  },
  {
    id: 8,
    name: 'Crispy Chicken Wings',
    description: 'Double-fried wings with your choice of buffalo, BBQ, or garlic parmesan sauce',
    price: 13.99,
    category: 'Starters',
    experience: 'Fast Food',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
    rating: 4.7,
    isSignature: false,
    isVeg: false
  },
  {
    id: 9,
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
    price: 10.99,
    category: 'Desserts',
    experience: 'Fine Dining',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    rating: 4.9,
    isSignature: true,
    isVeg: true
  },
  {
    id: 10,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with house-made Caesar dressing, croutons, and Parmesan',
    price: 11.99,
    category: 'Starters',
    experience: 'Cafe',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    rating: 4.5,
    isSignature: false,
    isVeg: true
  },
  {
    id: 11,
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato-butter gravy with aromatic spices and cream',
    price: 17.99,
    category: 'Main Course',
    experience: 'Cloud Kitchen',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    rating: 4.8,
    isSignature: true,
    isVeg: false
  },
  {
    id: 12,
    name: 'Fresh Fruit Smoothie',
    description: 'Blend of seasonal fruits with Greek yogurt and honey',
    price: 7.99,
    category: 'Beverages',
    experience: 'Cafe',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
    rating: 4.6,
    isSignature: false,
    isVeg: true
  }
]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState(menuItems)
  const [addedItem, setAddedItem] = useState<string | null>(null)

  const handleAddToCart = (itemName: string) => {
    setAddedItem(itemName)
    setTimeout(() => setAddedItem(null), 2000)
  }

  useEffect(() => {
    let filtered = menuItems
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    if (selectedExperience !== 'All') {
      filtered = filtered.filter(item => item.experience === selectedExperience)
    }
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    setFilteredItems(filtered)
  }, [selectedCategory, selectedExperience, searchQuery])

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-charcoal via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 font-medium tracking-widest uppercase mb-4"
          >
            Culinary Excellence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Each dish tells a story of passion, precision, and the finest ingredients sourced from around the world
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">200+</p>
              <p className="text-gray-400 text-sm">Dishes</p>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">5</p>
              <p className="text-gray-400 text-sm">Experiences</p>
            </div>
            <div className="w-px h-12 bg-gray-600" />
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-400">100%</p>
              <p className="text-gray-400 text-sm">Fresh</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
              <FaFilter className="text-amber-500" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="bg-transparent focus:outline-none text-gray-700 font-medium"
              >
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + selectedExperience + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {item.isSignature && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <FaFire /> Chef's Special
                      </div>
                    )}
                    {item.isVeg && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                        <FaLeaf className="text-sm" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">{item.experience}</span>
                      <div className="flex items-center gap-1.5 text-amber-400 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <FaStar />
                        <span className="font-semibold">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-charcoal group-hover:text-amber-600 transition-colors">{item.name}</h3>
                        <span className="text-amber-600 text-xs font-medium uppercase tracking-wider">{item.category}</span>
                      </div>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">₹{item.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-5 line-clamp-2">{item.description}</p>

                    <button
                      onClick={() => handleAddToCart(item.name)}
                      className="w-full bg-gradient-to-r from-charcoal to-gray-800 hover:from-amber-500 hover:to-yellow-400 text-white hover:text-black py-3 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {addedItem && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <p className="font-bold">{addedItem}</p>
                <p className="text-sm text-white/80">Added to cart!</p>
              </div>
            </motion.div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSearch className="text-3xl text-gray-400" />
              </div>
              <p className="text-gray-600 text-xl font-medium">No dishes found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-charcoal to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-white mb-4">
            Can't Decide?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Let our sommelier and chef create a personalized tasting menu just for you
          </p>
          <a
            href="/reservation"
            className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
          >
            Book a Tasting Experience
          </a>
        </div>
      </section>
    </div>
  )
}
