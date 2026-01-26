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
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-charcoal/70 text-lg max-w-2xl mx-auto"
          >
            Explore our diverse selection of dishes crafted with passion and the finest ingredients
          </motion.p>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-cream sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-cream rounded-full focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-burgundy text-white'
                      : 'bg-cream text-charcoal hover:bg-burgundy/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <FaFilter className="text-charcoal/60" />
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="px-4 py-2 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
              >
                {experiences.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
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
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-cream group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.isSignature && (
                      <div className="absolute top-4 left-4 bg-burgundy text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <FaFire /> Signature
                      </div>
                    )}
                    {item.isVeg && (
                      <div className="absolute top-4 right-4 bg-olive text-white p-2 rounded-full">
                        <FaLeaf className="text-xs" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-burgundy text-sm font-medium">{item.experience}</span>
                      <div className="flex items-center gap-1 text-accent text-sm">
                        <FaStar />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal mb-2">{item.name}</h3>
                    <p className="text-charcoal/60 text-sm mb-4 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-burgundy">${item.price}</span>
                      <button
                        onClick={() => handleAddToCart(item.name)}
                        className="bg-burgundy hover:bg-primary text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
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
              className="fixed bottom-8 right-8 bg-burgundy text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
            >
              <span className="text-2xl">✓</span>
              <div>
                <p className="font-semibold">{addedItem}</p>
                <p className="text-sm text-white/80">Added to cart! Go to Order Online page.</p>
              </div>
            </motion.div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-charcoal/60 text-lg">No dishes found matching your criteria</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
