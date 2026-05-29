'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FaUtensils, FaSignOutAlt, FaClipboardList, FaCheckCircle, FaClock,
  FaShoppingBag, FaCalendarAlt, FaBell, FaUser, FaChartLine,
  FaExclamationTriangle, FaTimes, FaConciergeBell, FaCheck, FaStar,
  FaBoxes, FaTh, FaSync, FaExternalLinkAlt, FaSearch, FaArrowRight,
  FaPhone, FaEnvelope, FaFire, FaMapMarkerAlt, FaComments
} from 'react-icons/fa'

const API = 'http://localhost:5000'

interface User { name: string; email: string; role: string }

export default function EmployeeDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  // Data
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [tables, setTables] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([])
  const [kitchenOrders, setKitchenOrders] = useState<any[]>([])
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifs, setShowNotifs] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const p = JSON.parse(userData)
      if (p.role !== 'employee') { router.push('/login'); return }
      setUser(p)
      fetchAll()
    } else { router.push('/login') }
  }, [router])

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchAll, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      const [ordR, resR, tblR, invR, alertR, kitR] = await Promise.all([
        fetch(`${API}/api/orders`), fetch(`${API}/api/reservations`),
        fetch(`${API}/api/tables`), fetch(`${API}/api/kitchen/inventory`),
        fetch(`${API}/api/kitchen/inventory/alerts`), fetch(`${API}/api/kitchen/orders`)
      ])
      if (ordR.ok) setOrders(await ordR.json())
      if (resR.ok) setReservations(await resR.json())
      if (tblR.ok) setTables(await tblR.json())
      if (invR.ok) setInventory(await invR.json())
      if (alertR.ok) setInventoryAlerts(await alertR.json())
      if (kitR.ok) setKitchenOrders(await kitR.json())
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const notifs: string[] = []
    const pending = orders.filter(o => o.status === 'pending')
    if (pending.length > 0) notifs.push(`${pending.length} new order(s) need attention`)
    const ready = orders.filter(o => o.status === 'ready')
    if (ready.length > 0) notifs.push(`${ready.length} order(s) ready for pickup`)
    if (inventoryAlerts.length > 0) notifs.push(`${inventoryAlerts.length} low stock alert(s)`)
    const pendingRes = reservations.filter(r => r.status === 'pending')
    if (pendingRes.length > 0) notifs.push(`${pendingRes.length} reservation(s) to confirm`)
    setNotifications(notifs)
  }, [orders, inventoryAlerts, reservations])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  const updateReservation = async (id: string, status: string) => {
    await fetch(`${API}/api/reservations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  const updateTableStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/tables/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  // Stats
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const readyOrders = orders.filter(o => o.status === 'ready')
  const completedOrders = orders.filter(o => o.status === 'completed')
  const todayRevenue = orders.reduce((s, o) => s + (o.total || 0), 0)
  const availableTables = tables.filter(t => t.status === 'available')
  const occupiedTables = tables.filter(t => t.status === 'occupied')
  const pendingReservations = reservations.filter(r => r.status === 'pending')

  const tabs = [
    { id: 'overview', icon: FaChartLine, label: 'Overview' },
    { id: 'orders', icon: FaShoppingBag, label: 'Orders', badge: pendingOrders.length },
    { id: 'kitchen', icon: FaConciergeBell, label: 'Kitchen', badge: preparingOrders.length },
    { id: 'reservations', icon: FaCalendarAlt, label: 'Reservations', badge: pendingReservations.length },
    { id: 'tables', icon: FaTh, label: 'Tables' },
    { id: 'inventory', icon: FaBoxes, label: 'Inventory', badge: inventoryAlerts.length },
  ]

  if (!user) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2 rounded-lg">
                <FaUtensils className="text-white text-lg" />
              </div>
              <div>
                <span className="font-playfair text-lg font-bold">Gastronome</span>
                <span className="text-[10px] text-emerald-200 block tracking-wider">EMPLOYEE PORTAL</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={fetchAll} className="text-emerald-200 hover:text-white transition p-2" title="Refresh"><FaSync className="text-sm" /></button>

              {/* Notification Bell */}
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)} className="text-white p-2 relative">
                  <FaBell className="text-lg" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{notifications.length}</span>
                  )}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border py-2 z-50">
                    <p className="px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase">Alerts</p>
                    {notifications.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-400">All clear!</p>
                    ) : notifications.map((n, i) => (
                      <div key={i} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />{n}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-[10px] text-emerald-200">Employee</p>
              </div>
              <button onClick={handleLogout} className="bg-white/15 hover:bg-white/25 p-2 rounded-lg transition"><FaSignOutAlt /></button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl shadow-sm border p-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="text-xs" /> {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className={`text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}

          <div className="ml-auto flex gap-2">
            <a href="/kitchen" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 text-white hover:bg-slate-700 transition">
              <FaConciergeBell /> Full Kitchen <FaExternalLinkAlt className="text-[8px]" />
            </a>
            <a href="/tables" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500 text-black hover:bg-amber-600 transition">
              <FaTh /> Floor Plan <FaExternalLinkAlt className="text-[8px]" />
            </a>
          </div>
        </div>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Pending Orders', value: pendingOrders.length, icon: FaClock, color: 'orange', urgent: pendingOrders.length > 0 },
                { label: 'Preparing', value: preparingOrders.length, icon: FaFire, color: 'yellow', urgent: false },
                { label: 'Ready for Pickup', value: readyOrders.length, icon: FaCheckCircle, color: 'emerald', urgent: readyOrders.length > 0 },
                { label: 'Completed', value: completedOrders.length, icon: FaCheck, color: 'blue', urgent: false },
                { label: 'Available Tables', value: `${availableTables.length}/${tables.length}`, icon: FaTh, color: 'teal', urgent: false },
                { label: 'Occupied Tables', value: occupiedTables.length, icon: FaMapMarkerAlt, color: 'red', urgent: false },
                { label: 'Pending Reservations', value: pendingReservations.length, icon: FaCalendarAlt, color: 'purple', urgent: pendingReservations.length > 0 },
                { label: 'Low Stock Items', value: inventoryAlerts.length, icon: FaExclamationTriangle, color: 'red', urgent: inventoryAlerts.length > 0 },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition ${s.urgent ? 'ring-2 ring-amber-400/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-gray-400">{s.label}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-0.5">{s.value}</p>
                    </div>
                    <div className={`bg-${s.color}-100 p-2.5 rounded-xl`}>
                      <s.icon className={`text-${s.color}-500`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions + Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Urgent Actions */}
              <div className="lg:col-span-2 space-y-4">
                {/* Pending Orders */}
                {pendingOrders.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <h3 className="font-bold text-orange-800 text-sm mb-3 flex items-center gap-2">
                      <FaClock /> New Orders Waiting ({pendingOrders.length})
                    </h3>
                    <div className="space-y-2">
                      {pendingOrders.map(o => (
                        <div key={o._id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{o._id} — {o.customer_name}</p>
                            <p className="text-xs text-gray-400">{o.items?.length} items • ₹{o.total?.toFixed(2)} • {o.type}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => updateOrderStatus(o._id, 'preparing')} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-600 transition flex items-center gap-1">
                              <FaCheck /> Start
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ready Orders */}
                {readyOrders.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                      <FaCheckCircle /> Ready for Pickup ({readyOrders.length})
                    </h3>
                    <div className="space-y-2">
                      {readyOrders.map(o => (
                        <div key={o._id} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{o._id} — {o.customer_name}</p>
                            <p className="text-xs text-gray-400">{o.type === 'delivery' ? `Delivery to ${o.delivery_address}` : `Table ${o.table_number}`}</p>
                          </div>
                          <button onClick={() => updateOrderStatus(o._id, 'completed')} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-600 transition flex items-center gap-1">
                            <FaCheck /> Complete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Today's Reservations */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FaCalendarAlt className="text-purple-500" /> Today's Reservations</span>
                    <button onClick={() => setActiveTab('reservations')} className="text-xs text-emerald-500 hover:underline">View All</button>
                  </h3>
                  <div className="space-y-2">
                    {reservations.filter(r => {
                      const today = new Date().toISOString().split('T')[0]
                      return r.date === today || r.date === '2026-02-06' || r.date === '2026-02-07'
                    }).slice(0, 4).map(r => (
                      <div key={r._id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{r.name}</p>
                          <p className="text-[11px] text-gray-400">{r.time} • {r.guests} guests • {r.experience || 'Standard'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{r.status || 'pending'}</span>
                          {r.status !== 'confirmed' && (
                            <button onClick={() => updateReservation(r._id, 'confirmed')} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-1 rounded text-xs"><FaCheck /></button>
                          )}
                        </div>
                      </div>
                    ))}
                    {reservations.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No reservations</p>}
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <div className="space-y-4">
                {/* Table Quick View */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2"><FaTh className="text-teal-500" /> Tables</span>
                    <a href="/tables" className="text-[10px] text-emerald-500 hover:underline flex items-center gap-0.5">Floor Plan <FaExternalLinkAlt className="text-[7px]" /></a>
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {tables.slice(0, 12).map(t => (
                      <button
                        key={t.id}
                        onClick={() => updateTableStatus(t.id, t.status === 'available' ? 'occupied' : 'available')}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-medium transition hover:scale-105 ${
                          t.status === 'available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                          t.status === 'occupied' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                          'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        title={`${t.name}: ${t.status} (click to toggle)`}
                      >
                        <span className="font-bold text-xs">{t.name?.replace('Table ', 'T')}</span>
                        <span className="text-[8px] opacity-70">{t.seats}s</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-400 rounded" /> Available</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-400 rounded" /> Occupied</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-400 rounded" /> Reserved</span>
                  </div>
                </div>

                {/* Inventory Alerts */}
                <div className="bg-white rounded-xl shadow-sm border p-4">
                  <h3 className="font-bold text-gray-800 text-sm mb-3 flex items-center gap-2">
                    <FaBoxes className="text-amber-500" /> Inventory Alerts
                  </h3>
                  {inventoryAlerts.length === 0 ? (
                    <div className="text-center py-4"><FaCheck className="mx-auto text-emerald-400 text-xl mb-1" /><p className="text-xs text-gray-400">All stocked</p></div>
                  ) : inventoryAlerts.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg mb-1.5">
                      <div>
                        <p className="text-xs font-medium text-gray-700">{a.name}</p>
                        <p className="text-[10px] text-red-500">{a.current_stock} {a.unit} left</p>
                      </div>
                      <FaExclamationTriangle className="text-red-400 text-xs" />
                    </div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-4 text-white">
                  <h3 className="font-bold text-sm mb-3">Today's Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200">Revenue</span>
                      <span className="font-bold">₹{todayRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200">Orders</span>
                      <span className="font-bold">{orders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200">Completed</span>
                      <span className="font-bold">{completedOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-200">Tables Occupied</span>
                      <span className="font-bold">{occupiedTables.length}/{tables.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ ORDERS ═══════════════ */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Status Filters */}
            <div className="grid grid-cols-5 gap-3 mb-5">
              {[
                { label: 'All', count: orders.length, color: 'gray' },
                { label: 'Pending', count: pendingOrders.length, color: 'orange' },
                { label: 'Preparing', count: preparingOrders.length, color: 'yellow' },
                { label: 'Ready', count: readyOrders.length, color: 'blue' },
                { label: 'Completed', count: completedOrders.length, color: 'emerald' },
              ].map((f, i) => (
                <div key={i} className={`bg-${f.color}-50 border border-${f.color}-200 rounded-xl p-3 text-center`}>
                  <p className={`text-xl font-bold text-${f.color}-600`}>{f.count}</p>
                  <p className="text-[10px] text-gray-500">{f.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold text-gray-800">Order Management</h2>
                <p className="text-xs text-gray-400">Update order statuses in real-time</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Order</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Items</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(o => (
                      <tr key={o._id} className={`hover:bg-gray-50 ${o.status === 'pending' ? 'bg-orange-50/30' : ''}`}>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{o._id}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-700">{o.customer_name}</p>
                          <p className="text-[10px] text-gray-400">{o.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${o.type === 'delivery' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {o.type} {o.table_number ? `• T${o.table_number}` : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-600">{o.items?.length} items</div>
                          <div className="text-[10px] text-gray-400">{o.items?.map((i: any) => i.name).join(', ')}</div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-700">₹{o.total?.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
                            o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            o.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                            o.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>{o.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)} className="border rounded-lg px-2 py-1 text-xs bg-gray-50">
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ KITCHEN ═══════════════ */}
        {activeTab === 'kitchen' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-5">
              <div><h2 className="text-lg font-bold text-gray-800">Kitchen Queue</h2><p className="text-xs text-gray-400">Active orders in preparation</p></div>
              <a href="/kitchen" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-700 transition">
                <FaConciergeBell /> Full Kitchen Display <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).map(o => {
                const elapsed = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 60000)
                const isUrgent = elapsed > 20
                return (
                  <div key={o._id} className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden ${
                    o.status === 'ready' ? 'border-blue-400' :
                    isUrgent ? 'border-red-400' :
                    o.status === 'preparing' ? 'border-yellow-400' : 'border-orange-400'
                  }`}>
                    <div className={`px-4 py-2 flex items-center justify-between ${
                      o.status === 'ready' ? 'bg-blue-500 text-white' :
                      isUrgent ? 'bg-red-500 text-white' :
                      o.status === 'preparing' ? 'bg-yellow-500 text-black' : 'bg-orange-500 text-white'
                    }`}>
                      <span className="font-mono font-bold text-sm">{o._id}</span>
                      <div className="flex items-center gap-2">
                        {isUrgent && <FaFire className="animate-pulse" />}
                        <span className="text-xs font-medium">{elapsed}min</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-gray-800 text-sm mb-1">{o.customer_name}</p>
                      <p className="text-[10px] text-gray-400 mb-3">{o.type === 'dine-in' ? `Table ${o.table_number}` : 'Delivery'}</p>
                      <div className="space-y-1 mb-3">
                        {o.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {o.status === 'pending' && (
                          <button onClick={() => updateOrderStatus(o._id, 'preparing')} className="flex-1 bg-yellow-500 text-black py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-600 transition">Start Cooking</button>
                        )}
                        {o.status === 'preparing' && (
                          <button onClick={() => updateOrderStatus(o._id, 'ready')} className="flex-1 bg-blue-500 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-blue-600 transition">Mark Ready</button>
                        )}
                        {o.status === 'ready' && (
                          <button onClick={() => updateOrderStatus(o._id, 'completed')} className="flex-1 bg-emerald-500 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 transition">Complete</button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length === 0 && (
                <div className="col-span-3 text-center py-16 text-gray-400">
                  <FaCheckCircle className="mx-auto text-4xl text-emerald-300 mb-3" />
                  <p className="font-medium">All orders completed!</p>
                  <p className="text-sm">No orders in the kitchen queue</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════════ RESERVATIONS ═══════════════ */}
        {activeTab === 'reservations' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">{reservations.filter(r => r.status === 'confirmed').length}</p>
                <p className="text-[10px] text-gray-500">Confirmed</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-yellow-600">{pendingReservations.length}</p>
                <p className="text-[10px] text-gray-500">Pending</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-600">{reservations.filter(r => r.status === 'cancelled').length}</p>
                <p className="text-[10px] text-gray-500">Cancelled</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b"><h2 className="text-lg font-bold text-gray-800">Reservation Management</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Guest</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Contact</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Party</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {reservations.map(r => (
                      <tr key={r._id} className={`hover:bg-gray-50 ${r.status === 'pending' ? 'bg-yellow-50/30' : ''}`}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">{r.name}</td>
                        <td className="px-4 py-3">
                          <p className="text-[11px] text-gray-500">{r.email}</p>
                          <p className="text-[11px] text-gray-400">{r.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.date} • {r.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.guests} guests</td>
                        <td className="px-4 py-3 text-xs text-gray-400 max-w-[120px] truncate">{r.special_requests || '—'}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{r.status || 'pending'}</span></td>
                        <td className="px-4 py-3 flex gap-1">
                          <button onClick={() => updateReservation(r._id, 'confirmed')} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2 py-1 rounded text-xs"><FaCheck /></button>
                          <button onClick={() => updateReservation(r._id, 'cancelled')} className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-xs"><FaTimes /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ TABLES ═══════════════ */}
        {activeTab === 'tables' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-5">
              <div><h2 className="text-lg font-bold text-gray-800">Table Management</h2><p className="text-xs text-gray-400">Click a table to toggle its status</p></div>
              <a href="/tables" className="bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-amber-600 transition">
                <FaTh /> Full Floor Plan <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">{availableTables.length}</p>
                <p className="text-[10px] text-gray-500">Available</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-red-600">{occupiedTables.length}</p>
                <p className="text-[10px] text-gray-500">Occupied</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{tables.filter(t => t.status === 'reserved').length}</p>
                <p className="text-[10px] text-gray-500">Reserved</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-600">{tables.reduce((s, t) => s + (t.seats || 0), 0)}</p>
                <p className="text-[10px] text-gray-500">Total Seats</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {tables.map(t => (
                  <div key={t.id} className={`border-2 rounded-xl p-4 text-center transition hover:shadow-md cursor-pointer ${
                    t.status === 'available' ? 'border-emerald-300 bg-emerald-50' :
                    t.status === 'occupied' ? 'border-red-300 bg-red-50' :
                    'border-blue-300 bg-blue-50'
                  }`}>
                    <p className="font-bold text-gray-800 mb-1">{t.name}</p>
                    <p className="text-xs text-gray-400 mb-2">{t.seats} seats • {t.zone || 'Main'}</p>
                    <select value={t.status} onChange={e => updateTableStatus(t.id, e.target.value)} className="w-full border rounded px-2 py-1 text-xs bg-white">
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════ INVENTORY ═══════════════ */}
        {activeTab === 'inventory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div><h2 className="text-lg font-bold text-gray-800">Kitchen Inventory</h2><p className="text-xs text-gray-400">{inventory.length} items tracked</p></div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Stock Level</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Min Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Unit</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {inventory.map((item: any) => {
                      const isLow = item.current_stock <= item.min_stock
                      return (
                        <tr key={item.id} className={`hover:bg-gray-50 ${isLow ? 'bg-red-50/50' : ''}`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>{item.current_stock}</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((item.current_stock / (item.min_stock * 3)) * 100, 100)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.min_stock}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                          <td className="px-4 py-3">
                            {isLow ? (
                              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit"><FaExclamationTriangle className="text-[8px]" /> Low</span>
                            ) : (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">OK</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
