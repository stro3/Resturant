'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FaUtensils, 
  FaChartLine, 
  FaUsers, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt,
  FaStar,
  FaEye,
  FaClock
} from 'react-icons/fa'

interface User {
  name: string
  email: string
  role: string
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'manager') {
      router.push('/login')
      return
    }
    
    setUser(parsedUser)
    fetchData()

    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [router])

  const fetchData = async () => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/reservations')
      ])

      if (ordersRes.ok) {
        const orders = await ordersRes.json()
        setRecentOrders(orders.slice(0, 4))
      }

      if (reservationsRes.ok) {
        const reservations = await reservationsRes.json()
        const today = new Date().toISOString().split('T')[0]
        const todayReservations = reservations.filter((r: any) => r.date === today)
        setUpcomingReservations(todayReservations.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  const todayStats = [
    { label: 'Total Revenue', value: `₹${recentOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0).toFixed(2)}`, change: '+12%', icon: FaShoppingBag, color: 'text-green-600' },
    { label: 'Orders Today', value: recentOrders.length.toString(), change: '+8%', icon: FaShoppingBag, color: 'text-blue-600' },
    { label: 'Reservations', value: upcomingReservations.length.toString(), change: '+15%', icon: FaCalendarAlt, color: 'text-purple-600' },
    { label: 'Average Rating', value: '4.8', change: '+0.2', icon: FaStar, color: 'text-yellow-600' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': case 'delivered': return 'bg-green-100 text-green-700'
      case 'preparing': return 'bg-blue-100 text-blue-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-gradient-to-r from-[#36454F] to-[#2C3639] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#8B0000] to-[#A52A2A] p-2 rounded-lg">
                <FaUtensils className="text-white text-xl" />
              </div>
              <div>
                <span className="font-playfair text-xl font-bold block">Gastronome</span>
                <span className="text-xs text-gray-300">Management Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-300">Restaurant Manager</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-[#8B0000] to-[#A52A2A] hover:from-[#6B0000] hover:to-[#8B0000] px-4 py-2 rounded-lg text-sm transition-all shadow-md"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#36454F] to-[#8B0000] bg-clip-text text-transparent mb-2">Restaurant Management</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live Dashboard • Auto-refresh every 10s
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                  <stat.icon className={`text-2xl ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-green-50 text-green-600`}>{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-charcoal mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal">Recent Orders</h3>
              <Link href="/admin/orders" className="text-burgundy text-sm hover:text-primary">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading orders...</p>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <motion.div
                    key={order._id || order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-charcoal">{order.order_number || order._id}</p>
                      <p className="text-sm text-gray-600">
                        {order.name || order.customerName || 'Customer'} • {order.items?.length || 0} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-charcoal">₹{parseFloat(order.total || 0).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No orders yet</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal">Upcoming Reservations</h3>
              <Link href="/admin/reservations" className="text-burgundy text-sm hover:text-primary">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading reservations...</p>
              ) : upcomingReservations.length > 0 ? (
                upcomingReservations.map((res, index) => (
                  <motion.div
                    key={res._id || res.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-charcoal">{res.name}</p>
                      <p className="text-sm text-gray-600">{res.experience?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-burgundy" />
                        <span>{res.time}</span>
                      </div>
                      <p>{res.guests} guests</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No reservations today</p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="font-bold text-charcoal mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-cream transition-colors"
            >
              <FaChartLine className="text-2xl text-burgundy mb-2" />
              <span className="text-sm font-medium text-charcoal">Analytics</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-cream transition-colors"
            >
              <FaShoppingBag className="text-2xl text-blue-600 mb-2" />
              <span className="text-sm font-medium text-charcoal">Orders</span>
            </Link>
            <Link
              href="/admin/reservations"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-cream transition-colors"
            >
              <FaCalendarAlt className="text-2xl text-purple-600 mb-2" />
              <span className="text-sm font-medium text-charcoal">Reservations</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-cream transition-colors"
            >
              <FaCog className="text-2xl text-gray-600 mb-2" />
              <span className="text-sm font-medium text-charcoal">Settings</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}