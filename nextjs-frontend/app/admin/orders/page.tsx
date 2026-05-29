'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaArrowLeft, FaCheck, FaClock, FaTruck, FaBoxOpen } from 'react-icons/fa'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  items: OrderItem[]
  total: number
  status: string
  address: string
  time: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([
    { 
      id: 'ORD-1045', 
      customer: 'John Doe', 
      items: [
        { name: 'Wagyu Beef Burger', quantity: 2, price: 24.99 },
        { name: 'Truffle Risotto', quantity: 1, price: 32.99 }
      ],
      total: 82.97,
      status: 'preparing',
      address: '123 Main St, Downtown',
      time: '10 mins ago'
    },
    { 
      id: 'ORD-1044', 
      customer: 'Jane Smith', 
      items: [
        { name: 'Grilled Salmon', quantity: 1, price: 28.99 }
      ],
      total: 28.99,
      status: 'ready',
      address: '456 Oak Ave, Midtown',
      time: '25 mins ago'
    },
    { 
      id: 'ORD-1043', 
      customer: 'Mike Brown', 
      items: [
        { name: 'Butter Chicken', quantity: 2, price: 17.99 },
        { name: 'Chocolate Lava Cake', quantity: 1, price: 10.99 }
      ],
      total: 46.97,
      status: 'delivered',
      address: '789 Pine Rd, Uptown',
      time: '1 hour ago'
    },
    { 
      id: 'ORD-1042', 
      customer: 'Lisa Wong', 
      items: [
        { name: 'Pad Thai', quantity: 1, price: 15.99 }
      ],
      total: 15.99,
      status: 'delivered',
      address: '321 Elm St, Suburb',
      time: '2 hours ago'
    },
  ])

  const [filter, setFilter] = useState('all')

  const statusSteps = ['preparing', 'ready', 'delivering', 'delivered']

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const updateStatus = (id: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === id) {
        const currentIndex = statusSteps.indexOf(order.status)
        if (currentIndex < statusSteps.length - 1) {
          return { ...order, status: statusSteps[currentIndex + 1] }
        }
      }
      return order
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <FaClock className="text-yellow-500" />
      case 'ready': return <FaBoxOpen className="text-blue-500" />
      case 'delivering': return <FaTruck className="text-purple-500" />
      case 'delivered': return <FaCheck className="text-green-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-700'
      case 'ready': return 'bg-blue-100 text-blue-700'
      case 'delivering': return 'bg-purple-100 text-purple-700'
      case 'delivered': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-burgundy transition-colors">
              <FaArrowLeft />
            </Link>
            <span className="font-playfair text-xl font-bold">Orders</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          {['all', 'preparing', 'ready', 'delivering', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                filter === status
                  ? 'bg-burgundy text-white'
                  : 'bg-white text-charcoal hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-charcoal text-lg">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{order.customer} • {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-burgundy">₹{order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-2">Items:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm py-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Delivery:</span> {order.address}
                </div>
                {order.status !== 'delivered' && (
                  <button
                    onClick={() => updateStatus(order.id)}
                    className="bg-burgundy hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {order.status === 'preparing' && 'Mark Ready'}
                    {order.status === 'ready' && 'Start Delivery'}
                    {order.status === 'delivering' && 'Mark Delivered'}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  )
}
