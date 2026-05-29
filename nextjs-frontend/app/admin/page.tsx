'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaUtensils, FaCalendarAlt, FaShoppingBag, FaEnvelope, FaChartLine, FaUsers, FaClock } from 'react-icons/fa'

interface Stats {
  totalOrders: number
  totalReservations: number
  totalRevenue: number
  pendingOrders: number
  todayReservations: number
  newMessages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalReservations:0,
    totalRevenue: 0,
    pendingOrders:0,
    todayReservations:0,
    newMessages:0
  })

  const menuItems = [
    { title: 'Reservations', icon: FaCalendarAlt, href: '/admin/reservations', count: stats.todayReservations, color: 'bg-blue-500' },
    { title: 'Orders', icon: FaShoppingBag, href: '/admin/orders', count: stats.pendingOrders, color: 'bg-green-500' },
    { title: 'Menu Manager', icon: FaUtensils, href: '/admin/menu', count: null, color: 'bg-orange-500' },
    { title: 'Messages', icon: FaEnvelope, href: '/admin/messages', count: stats.newMessages, color: 'bg-purple-500' },
  ]

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: FaChartLine, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: FaShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Reservations', value: stats.totalReservations, icon: FaCalendarAlt, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: FaClock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUtensils className="text-burgundy text-2xl" />
            <span className="font-playfair text-xl font-bold">Gastronome Admin</span>
          </div>
          <Link href="/" className="text-sm hover:text-burgundy transition-colors">
            ← Back to Website
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-charcoal mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`text-xl ${stat.color}`} />
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-charcoal">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-charcoal mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Link href={item.href}>
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="text-white text-2xl" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-charcoal">{item.title}</h3>
                    {item.count !== null && (
                      <span className="bg-burgundy text-white text-xs px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-charcoal mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {[
                { id: 'ORD-1045', customer: 'John Doe', total: 57.98, status: 'Preparing' },
                { id: 'ORD-1044', customer: 'Jane Smith', total: 32.99, status: 'Delivered' },
                { id: 'ORD-1043', customer: 'Mike Brown', total: 45.50, status: 'Delivered' },
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-charcoal">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-burgundy">₹{order.total}</p>
                    <p className={`text-xs ${order.status === 'Preparing' ? 'text-orange-500' : 'text-green-500'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-charcoal mb-4">Today's Reservations</h3>
            <div className="space-y-3">
              {[
                { name: 'Kumar Yash', time: '7:00 PM', guests: 4, experience: 'Fine Dining' },
                { name: 'Sarah Wilson', time: '7:30 PM', guests: 2, experience: 'Cafe' },
                { name: 'Robert Chen', time: '8:00 PM', guests: 6, experience: 'Fine Dining' },
              ].map((res, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-charcoal">{res.name}</p>
                    <p className="text-sm text-gray-500">{res.experience}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-burgundy">{res.time}</p>
                    <p className="text-xs text-gray-500">{res.guests} guests</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
