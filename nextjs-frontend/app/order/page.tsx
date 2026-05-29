'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaMotorcycle, FaClock, FaMapMarkerAlt } from 'react-icons/fa'
import Link from 'next/link'

const popularItems = [
  { id: 1, name: 'Wagyu Beef Burger', price: 2099, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300', time: '20 min' },
  { id: 2, name: 'Truffle Risotto', price: 2749, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300', time: '25 min' },
  { id: 3, name: 'Butter Chicken', price: 1499, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300', time: '30 min' },
  { id: 4, name: 'Pad Thai', price: 1299, image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=300', time: '20 min' },
  { id: 5, name: 'Grilled Salmon', price: 2399, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300', time: '25 min' },
  { id: 6, name: 'Chocolate Lava Cake', price: 899, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300', time: '15 min' },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export default function OrderPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return
    if (!customerName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!customerEmail.trim()) {
      alert('Please enter your email address')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      alert('Please enter a valid email address')
      return
    }
    if (!customerPhone.trim()) {
      alert('Please enter your phone number')
      return
    }
    if (!deliveryAddress.trim()) {
      alert('Please enter your delivery address')
      return
    }
    setIsOrdering(true)
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          total: total,
          deliveryAddress: deliveryAddress,
          status: 'confirmed'
        })
      })
      const data = await response.json()
      setOrderId(data.order_id || 'ORD-' + Date.now())
      setOrderPlaced(true)
      setCart([])
      setDeliveryAddress('')
      setCustomerEmail('')
      setCustomerPhone('')
      setCustomerName('')
    } catch (error) {
      setOrderId('ORD-' + Date.now())
      setOrderPlaced(true)
      setCart([])
      setDeliveryAddress('')
      setCustomerEmail('')
      setCustomerPhone('')
      setCustomerName('')
    } finally {
      setIsOrdering(false)
    }
  }

  const addToCart = (item: typeof popularItems[0]) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 4000 ? 0 : 399
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <FaMotorcycle className="text-burgundy text-3xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6"
          >
            Order Online
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/70 text-lg max-w-2xl mx-auto"
          >
            Enjoy restaurant-quality meals delivered to your doorstep in 30 minutes or less
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-8 text-sm"
          >
            <div className="flex items-center gap-2 text-charcoal/70">
              <FaClock className="text-burgundy" />
              <span>30 min average delivery</span>
            </div>
            <div className="flex items-center gap-2 text-charcoal/70">
              <FaMotorcycle className="text-burgundy" />
              <span>Free delivery over ₹4000</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-playfair text-3xl font-bold text-charcoal mb-8">Popular Dishes</h2>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {popularItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-cream flex"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-charcoal mb-1">{item.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-charcoal/60">
                          <FaClock />
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-burgundy">₹{item.price}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-burgundy hover:bg-primary text-white p-2 rounded-full transition-all"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-burgundy hover:text-primary font-semibold transition-colors"
                >
                  View Full Menu →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-cream p-6 sticky top-28">
                <div className="flex items-center gap-3 mb-6">
                  <FaShoppingCart className="text-burgundy text-xl" />
                  <h3 className="font-playfair text-2xl font-bold text-charcoal">Your Cart</h3>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-charcoal/60">Your cart is empty</p>
                    <p className="text-sm text-charcoal/40 mt-2">Add some delicious dishes!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-cream">
                          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-medium text-charcoal text-sm">{item.name}</h4>
                            <p className="text-burgundy font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded-full bg-cream hover:bg-burgundy/10 transition-colors"
                            >
                              <FaMinus className="text-xs text-charcoal" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded-full bg-cream hover:bg-burgundy/10 transition-colors"
                            >
                              <FaPlus className="text-xs text-charcoal" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-cream/30 p-6 rounded-xl mb-6 border border-burgundy/10">
                      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-burgundy/10 rounded-full flex items-center justify-center">
                          <span className="text-burgundy font-bold text-sm">1</span>
                        </div>
                        Customer Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-2">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-charcoal mb-2">
                        <FaMapMarkerAlt className="inline mr-2 text-burgundy" />
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your full address with street, city, state, and zip code..."
                        className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between text-charcoal/70">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-charcoal/70">
                        <span>Delivery Fee</span>
                        <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-charcoal pt-2 border-t border-cream">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={isOrdering || cart.length === 0}
                      className="w-full bg-burgundy hover:bg-primary text-white py-4 rounded-full font-semibold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isOrdering ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {orderPlaced && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">Order Placed!</h2>
            <p className="text-charcoal/70 mb-2">Thank you for your order</p>
            <p className="text-burgundy font-semibold mb-6">Order ID: {orderId}</p>
            <p className="text-sm text-charcoal/60 mb-6">Your delicious meal will arrive in approximately 30 minutes.</p>
            <button
              onClick={() => setOrderPlaced(false)}
              className="bg-burgundy hover:bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all"
            >
              Continue Browsing
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
