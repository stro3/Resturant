'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaUtensils, FaClipboardList, FaConciergeBell, FaClock, FaCheck, FaSignOutAlt, FaUser, FaShoppingBag, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface Task {
  id: string
  type: string
  table: string
  details: string
  time: string
  status: 'pending' | 'in-progress' | 'completed'
  customerName?: string
  customerEmail?: string
  customerPhone?: string
}

interface User {
  name: string
  email: string
  role: string
}

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!token || !userData) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'employee') {
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
        const ordersData = await ordersRes.json()
        setOrders(ordersData.slice(0, 10))
        
        const pendingTasks: Task[] = ordersData.slice(0, 5).map((order: any, index: number) => ({
          id: order._id || order.id || index.toString(),
          type: 'Order',
          table: `Order #${order.order_number?.slice(-4) || index + 1}`,
          details: order.items?.map((item: any) => `${item.name} x${item.quantity}`).join(', ') || 'Order items',
          time: new Date(order.created_at).toLocaleTimeString(),
          status: order.status === 'confirmed' ? 'pending' : order.status === 'preparing' ? 'in-progress' : 'completed',
          customerName: order.name,
          customerEmail: order.email,
          customerPhone: order.phone
        }))
        setTasks(pendingTasks)
      }

      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json()
        const today = new Date().toISOString().split('T')[0]
        const todayReservations = reservationsData.filter((r: any) => r.date === today)
        setReservations(todayReservations.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ))
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'in-progress': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
    }
  }

  const stats = [
    { label: 'Pending Tasks', value: tasks.filter(t => t.status === 'pending').length, color: 'text-yellow-600' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'text-blue-600' },
    { label: 'Completed Today', value: tasks.filter(t => t.status === 'completed').length, color: 'text-green-600' },
  ]

  if (!user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-charcoal text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUtensils className="text-burgundy text-2xl" />
            <span className="font-playfair text-xl font-bold">Employee Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <FaUser className="text-burgundy" />
              <span>Welcome, {user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-burgundy hover:bg-primary px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
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
              <h1 className="text-3xl font-bold text-charcoal mb-2">Welcome, {user.name}!</h1>
              <p className="text-gray-600">Here are your tasks for today.</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-burgundy hover:bg-primary text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <FaClock /> Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
              <FaClipboardList className="text-burgundy" />
              Today's Tasks
            </h2>
          </div>

          <div className="divide-y">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <FaClock className="animate-spin mx-auto text-3xl mb-2" />
                <p>Loading tasks...</p>
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 flex items-center gap-6 hover:bg-gray-50"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    task.type === 'Order' ? 'bg-orange-100' : 
                    task.type === 'Service' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {task.type === 'Order' ? <FaConciergeBell className="text-orange-600" /> :
                     task.type === 'Service' ? <FaClipboardList className="text-purple-600" /> :
                     <FaClock className="text-blue-600" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-charcoal">{task.type}</span>
                      <span className="text-sm bg-cream px-2 py-0.5 rounded">{task.table}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{task.details}</p>
                    
                    {(task.customerName || task.customerEmail || task.customerPhone) && (
                      <div className="bg-gradient-to-r from-burgundy/5 to-transparent p-3 rounded-lg mb-2 border-l-2 border-burgundy">
                        <p className="text-xs font-semibold text-burgundy mb-1">Customer Details:</p>
                        {task.customerName && (
                          <p className="text-xs text-charcoal flex items-center gap-2">
                            <FaUser className="text-burgundy" />
                            <span className="font-medium">{task.customerName}</span>
                          </p>
                        )}
                        {task.customerEmail && (
                          <p className="text-xs text-charcoal flex items-center gap-2 mt-1">
                            <span className="text-burgundy">📧</span>
                            <a href={`mailto:${task.customerEmail}`} className="hover:text-burgundy hover:underline">{task.customerEmail}</a>
                          </p>
                        )}
                        {task.customerPhone && (
                          <p className="text-xs text-charcoal flex items-center gap-2 mt-1">
                            <span className="text-burgundy">📱</span>
                            <a href={`tel:${task.customerPhone}`} className="hover:text-burgundy hover:underline">{task.customerPhone}</a>
                          </p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-400 text-xs mt-1">{task.time}</p>
                  </div>

                  <div className="flex gap-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in-progress')}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                      Start
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'completed')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <FaCheck /> Complete
                    </button>
                  )}
                  {task.status === 'completed' && (
                    <span className="px-4 py-2 text-green-600 text-sm font-medium flex items-center gap-2">
                      <FaCheck /> Done
                    </span>
                  )}
                </div>
              </motion.div>
            ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FaClipboardList className="mx-auto text-4xl mb-2 text-gray-300" />
                <p>No tasks available. Great job!</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-charcoal mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => toast.success('Assistance requested! A manager has been notified.')} className="p-4 bg-burgundy/10 hover:bg-burgundy/20 rounded-xl text-burgundy font-medium transition-colors">
                Request Assistance
              </button>
              <button onClick={() => router.push('/tables')} className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl text-blue-700 font-medium transition-colors">
                View Table Map
              </button>
              <button onClick={() => router.push('/live-kitchen')} className="p-4 bg-green-100 hover:bg-green-200 rounded-xl text-green-700 font-medium transition-colors">
                Check Inventory
              </button>
              <button onClick={() => toast.success('Report submitted to management.')} className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl text-purple-700 font-medium transition-colors">
                Report Issue
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h3 className="font-bold text-charcoal mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Shift Start</span>
                <span className="font-semibold">10:00 AM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Break</span>
                <span className="font-semibold">2:00 PM - 2:30 PM</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Shift End</span>
                <span className="font-semibold">8:00 PM</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Assigned Section</span>
                <span className="font-semibold text-burgundy">Tables 1-8</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
