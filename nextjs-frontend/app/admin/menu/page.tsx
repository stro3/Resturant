'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable: boolean
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Truffle Risotto', description: 'Creamy Arborio rice with black truffle', price: 32.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200', isAvailable: true },
    { id: 2, name: 'Wagyu Beef Burger', description: 'Premium Wagyu beef patty with truffle aioli', price: 24.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', isAvailable: true },
    { id: 3, name: 'Matcha Tiramisu', description: 'Japanese-Italian fusion dessert', price: 12.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200', isAvailable: true },
    { id: 4, name: 'Grilled Salmon', description: 'Atlantic salmon with lemon butter sauce', price: 28.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200', isAvailable: false },
    { id: 5, name: 'Butter Chicken', description: 'Tender chicken in rich tomato-butter gravy', price: 17.99, category: 'Main Course', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200', isAvailable: true },
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Main Course', image: '' })

  const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials']

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return
    const item: MenuItem = {
      id: Date.now(),
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
      isAvailable: true
    }
    setMenuItems(prev => [...prev, item])
    setNewItem({ name: '', description: '', price: '', category: 'Main Course', image: '' })
    setIsAdding(false)
  }

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const toggleAvailability = (id: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-burgundy transition-colors">
              <FaArrowLeft />
            </Link>
            <span className="font-playfair text-xl font-bold">Menu Manager</span>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-burgundy hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <FaPlus /> Add Item
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <h3 className="font-bold text-charcoal mb-4">Add New Menu Item</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <textarea
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              />
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy md:col-span-2"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddItem}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <FaSave /> Save Item
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-gray-200 hover:bg-gray-300 text-charcoal px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid gap-4">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl shadow-md p-4 flex items-center gap-4 ${!item.isAvailable ? 'opacity-60' : ''}`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-charcoal">{item.name}</h3>
                  <span className="text-xs bg-cream px-2 py-1 rounded">{item.category}</span>
                  {!item.isAvailable && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Unavailable</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{item.description}</p>
                <p className="text-lg font-bold text-burgundy">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.isAvailable 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
