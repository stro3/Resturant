'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUser, FaHistory, FaCalendarAlt, FaShoppingBag, FaCog, FaSignOutAlt, FaUtensils } from 'react-icons/fa'

interface User {
  name: string
  email: string
  role: string
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [upcomingReservations, setUpcomingReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'customer') {
        router.push('/login')
        return
      }
      setUser(parsedUser)
      fetchUserData(parsedUser.email)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchUserData = async (email: string) => {
    try {
      const [ordersRes, reservationsRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders'),
        fetch('http://localhost:5000/api/reservations')
      ])

      if (ordersRes.ok) {
        const orders = await ordersRes.json()
        const userOrders = orders.filter((o: any) => o.email === email)
        setRecentOrders(userOrders.slice(0, 3))
      }

      if (reservationsRes.ok) {
        const reservations = await reservationsRes.json()
        const userReservations = reservations.filter((r: any) => r.email === email)
        const upcoming = userReservations.filter((r: any) => new Date(r.date) >= new Date())
        setUpcomingReservations(upcoming.slice(0, 2))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const menuItems = [
    { title: 'Order Food', icon: FaShoppingBag, href: '/order', description: 'Browse menu and place orders', color: 'bg-green-500' },
    { title: 'Make Reservation', icon: FaCalendarAlt, href: '/reservation', description: 'Book a table for dining', color: 'bg-blue-500' },
    { title: 'Order History', icon: FaHistory, href: '/dashboard/orders', description: 'View your past orders', color: 'bg-purple-500' },
    { title: 'My Reservations', icon: FaUtensils, href: '/dashboard/reservations', description: 'Manage your bookings', color: 'bg-orange-500' },
  ]

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
                <span className="text-xs text-gray-300">Customer Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-300">Welcome Back</p>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#36454F] to-[#8B0000] bg-clip-text text-transparent mb-2">Welcome Back, {user.name.split(' ')[0]}!</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <FaUser className="text-[#8B0000]" />
            Manage your orders, reservations, and dining experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link href={item.href}>
                <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all cursor-pointer group border border-gray-100">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md`}>
                    <item.icon className="text-white text-2xl" />
                  </div>
                  <h3 className="font-bold text-charcoal mb-2 text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal">Recent Orders</h3>
              <Link href="/dashboard/orders" className="text-burgundy text-sm hover:text-primary">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto"></div>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-charcoal">{order.confirmation_number || order._id}</p>
                      <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-burgundy">₹{order.total}</p>
                      <p className={`text-xs ${
                        order.status === 'delivered' ? 'text-green-600' :
                        order.status === 'in-progress' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {order.status || 'pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-charcoal">Upcoming Reservations</h3>
              <Link href="/dashboard/reservations" className="text-burgundy text-sm hover:text-primary">
                View All
              </Link>
            </div>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B0000] mx-auto"></div>
              </div>
            ) : upcomingReservations.length > 0 ? (
              <div className="space-y-3">
                {upcomingReservations.map((res) => (
                  <div key={res._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-charcoal">{res.experience}</p>
                      <p className="text-sm text-gray-500">{new Date(res.date).toLocaleDateString()} at {res.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal">{res.guests} guests</p>
                      <p className={`text-xs ${
                        res.status === 'confirmed' ? 'text-green-600' :
                        res.status === 'cancelled' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {res.status || 'pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming reservations</p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="font-bold text-charcoal mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="bg-burgundy hover:bg-primary text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Menu
            </Link>
            <Link
              href="/experiences"
              className="border border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Experiences
            </Link>
            <Link
              href="/contact"
              className="bg-gray-100 hover:bg-gray-200 text-charcoal px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}