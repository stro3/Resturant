'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  FaUtensils, FaSignOutAlt, FaChartBar, FaUsers,
  FaShoppingBag, FaCalendarAlt, FaBell, FaCog, FaClipboardList,
  FaUserTie, FaChartLine, FaPlus, FaEdit, FaTrash, FaEye,
  FaGift, FaConciergeBell, FaChartPie, FaStar, FaTag, FaBoxes,
  FaExclamationTriangle, FaCheck, FaTimes, FaSearch, FaArrowUp,
  FaArrowDown, FaPercent, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaExternalLinkAlt, FaSync, FaNewspaper, FaTh, FaComments
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const API = 'http://localhost:5000'

interface User { id: string; name: string; email: string; role: string; phone?: string }

export default function ManagerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Data states
  const [orders, setOrders] = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [staff, setStaff] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [allReviews, setAllReviews] = useState<any[]>([])
  const [tables, setTables] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [inventory, setInventory] = useState<any[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([])
  const [giftCards, setGiftCards] = useState<any[]>([])
  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [newsletter, setNewsletter] = useState<any[]>([])
  const [notifications, setNotifications] = useState<string[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Modals
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddPromo, setShowAddPromo] = useState(false)
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', phone: '' })
  const [newMenu, setNewMenu] = useState({ name: '', description: '', price: '', category: '', image: '' })
  const [newPromo, setNewPromo] = useState({ code: '', type: 'percentage', value: '', description: '', min_order: '0', valid_until: '' })

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const p = JSON.parse(userData)
      if (p.role !== 'manager') { router.push('/login'); return }
      setUser(p)
      fetchAll()
    } else { router.push('/login') }
  }, [router])

  const fetchAll = useCallback(async () => {
    try {
      const [ordR, resR, menuR, usrR, revR, allRevR, tblR, anaR, invR, alertR, gcR, pcR, nlR] = await Promise.all([
        fetch(`${API}/api/orders`), fetch(`${API}/api/reservations`), fetch(`${API}/api/menu`),
        fetch(`${API}/api/users`), fetch(`${API}/api/reviews`), fetch(`${API}/api/reviews/all`),
        fetch(`${API}/api/tables`), fetch(`${API}/api/analytics/overview`),
        fetch(`${API}/api/kitchen/inventory`), fetch(`${API}/api/kitchen/inventory/alerts`),
        fetch(`${API}/api/gift-cards`), fetch(`${API}/api/promo-codes`), fetch(`${API}/api/newsletter`)
      ])
      if (ordR.ok) setOrders(await ordR.json())
      if (resR.ok) setReservations(await resR.json())
      if (menuR.ok) setMenuItems(await menuR.json())
      if (usrR.ok) { const d = await usrR.json(); setStaff(d.filter((u: any) => u.role !== 'customer')) }
      if (revR.ok) setReviews(await revR.json())
      if (allRevR.ok) setAllReviews(await allRevR.json())
      if (tblR.ok) setTables(await tblR.json())
      if (anaR.ok) setAnalytics(await anaR.json())
      if (invR.ok) setInventory(await invR.json())
      if (alertR.ok) setInventoryAlerts(await alertR.json())
      if (gcR.ok) { const d = await gcR.json(); setGiftCards(d.gift_cards || []) }
      if (pcR.ok) { const d = await pcR.json(); setPromoCodes(d.promo_codes || []) }
      if (nlR.ok) { const d = await nlR.json(); setNewsletter(d.subscribers || []) }

      // Build notifications
      const notifs: string[] = []
      const pendRes = (await resR.json?.()) || []
      // We'll compute notifications from state after
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }, [])

  // Compute notifications
  useEffect(() => {
    const notifs: string[] = []
    const pendingRes = reservations.filter(r => r.status === 'pending')
    if (pendingRes.length > 0) notifs.push(`${pendingRes.length} pending reservation(s)`)
    const pendingOrders = orders.filter(o => o.status === 'pending')
    if (pendingOrders.length > 0) notifs.push(`${pendingOrders.length} new order(s)`)
    if (inventoryAlerts.length > 0) notifs.push(`${inventoryAlerts.length} low stock alert(s)`)
    const unapproved = allReviews.filter((r: any) => !r.approved)
    if (unapproved.length > 0) notifs.push(`${unapproved.length} review(s) awaiting approval`)
    setNotifications(notifs)
  }, [reservations, orders, inventoryAlerts, allReviews])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // API actions
  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  const updateReservation = async (id: string, status: string) => {
    await fetch(`${API}/api/reservations/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  const addStaffMember = async () => {
    const res = await fetch(`${API}/api/users/staff`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newStaff) })
    if (res.ok) { setShowAddStaff(false); setNewStaff({ name: '', email: '', password: '', phone: '' }); fetchAll() }
  }

  const deleteStaff = async (id: string) => {
    await fetch(`${API}/api/users/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const addMenuItem = async () => {
    const res = await fetch(`${API}/api/menu`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newMenu, price: parseFloat(newMenu.price) }) })
    if (res.ok) { setShowAddMenu(false); setNewMenu({ name: '', description: '', price: '', category: '', image: '' }); fetchAll() }
  }

  const deleteMenuItem = async (id: string) => {
    await fetch(`${API}/api/menu/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const approveReview = async (id: string) => {
    await fetch(`${API}/api/reviews/${id}/approve`, { method: 'PATCH' })
    fetchAll()
  }

  const deleteReview = async (id: string) => {
    await fetch(`${API}/api/reviews/${id}`, { method: 'DELETE' })
    fetchAll()
  }

  const addPromoCode = async () => {
    const res = await fetch(`${API}/api/promo-codes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newPromo, value: parseFloat(newPromo.value), min_order: parseFloat(newPromo.min_order) }) })
    if (res.ok) { setShowAddPromo(false); setNewPromo({ code: '', type: 'percentage', value: '', description: '', min_order: '0', valid_until: '' }); fetchAll() }
  }

  const updateTableStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/tables/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    fetchAll()
  }

  // Stats
  const totalRevenue = analytics?.total_revenue || orders.reduce((s, o) => s + (o.total || 0), 0)
  const avgOrderValue = analytics?.avg_order_value || (orders.length > 0 ? totalRevenue / orders.length : 0)
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const completedOrders = orders.filter(o => o.status === 'completed')
  const pendingReservations = reservations.filter(r => r.status === 'pending')
  const unapprovedReviews = allReviews.filter((r: any) => !r.approved)

  const sidebarItems = [
    { id: 'overview', icon: FaChartBar, label: 'Overview' },
    { id: 'orders', icon: FaShoppingBag, label: 'Orders' },
    { id: 'reservations', icon: FaCalendarAlt, label: 'Reservations' },
    { id: 'menu', icon: FaClipboardList, label: 'Menu' },
    { id: 'staff', icon: FaUsers, label: 'Staff' },
    { id: 'tables', icon: FaTh, label: 'Tables' },
    { id: 'analytics', icon: FaChartPie, label: 'Analytics' },
    { id: 'reviews', icon: FaStar, label: 'Reviews', badge: unapprovedReviews.length },
    { id: 'inventory', icon: FaBoxes, label: 'Inventory', badge: inventoryAlerts.length },
    { id: 'gift-cards', icon: FaGift, label: 'Gift Cards' },
    { id: 'promo-codes', icon: FaTag, label: 'Promos' },
    { id: 'newsletter', icon: FaNewspaper, label: 'Newsletter' },
    { id: 'settings', icon: FaCog, label: 'Settings' },
  ]

  if (!user) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-2 rounded-lg flex-shrink-0">
              <FaUtensils className="text-black text-lg" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="font-playfair text-lg font-bold">Gastronome</span>
                <span className="text-[10px] text-slate-400 block">MANAGER PORTAL</span>
              </div>
            )}
          </div>
        </div>

        <nav className="p-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold'
                      : 'hover:bg-slate-700/60 text-slate-300'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                  {!sidebarCollapsed && item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {!sidebarCollapsed && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 px-3">Quick Links</p>
              <a href="/kitchen" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-amber-400 rounded transition">
                <FaConciergeBell /> Kitchen Display <FaExternalLinkAlt className="ml-auto text-[8px]" />
              </a>
              <a href="/analytics" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-amber-400 rounded transition">
                <FaChartLine /> Full Analytics <FaExternalLinkAlt className="ml-auto text-[8px]" />
              </a>
              <a href="/tables" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-amber-400 rounded transition">
                <FaTh /> Floor Plan <FaExternalLinkAlt className="ml-auto text-[8px]" />
              </a>
            </div>
          )}
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700 ${sidebarCollapsed ? 'text-center' : ''}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm">{user.name?.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400">Manager</p>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className={`w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-red-600 py-2 rounded-lg transition text-sm ${sidebarCollapsed ? 'px-2' : ''}`}>
            <FaSignOutAlt /> {!sidebarCollapsed && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="text-gray-400 hover:text-gray-600 text-lg">☰</button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{sidebarItems.find(s => s.id === activeTab)?.label || 'Dashboard'}</h1>
              <p className="text-xs text-gray-400">Welcome back, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => fetchAll()} className="text-gray-400 hover:text-amber-500 transition" title="Refresh"><FaSync /></button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-400 hover:text-gray-600 text-xl relative">
                <FaBell />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{notifications.length}</span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border py-2 z-50">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Notifications</p>
                  {notifications.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">All caught up!</p>
                  ) : notifications.map((n, i) => (
                    <div key={i} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                      {n}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* ═══════════════════ OVERVIEW ═══════════════════ */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, sub: `${analytics?.total_tips ? `₹${analytics.total_tips.toFixed(2)} tips` : ''}`, icon: FaChartBar, color: 'emerald', trend: '+12%' },
                  { label: 'Total Orders', value: orders.length, sub: `${pendingOrders.length} pending`, icon: FaShoppingBag, color: 'blue', trend: '+8%' },
                  { label: 'Reservations', value: reservations.length, sub: `${pendingReservations.length} pending`, icon: FaCalendarAlt, color: 'amber', trend: '+5%' },
                  { label: 'Avg Rating', value: analytics?.avg_rating?.toFixed(1) || '4.8', sub: `${reviews.length} reviews`, icon: FaStar, color: 'yellow', trend: '' },
                  { label: 'Avg Order Value', value: `₹${avgOrderValue.toFixed(2)}`, sub: 'per order', icon: FaChartLine, color: 'purple', trend: '+3%' },
                  { label: 'Menu Items', value: menuItems.length, sub: 'active items', icon: FaUtensils, color: 'pink', trend: '' },
                  { label: 'Staff Members', value: staff.length, sub: 'team members', icon: FaUsers, color: 'indigo', trend: '' },
                  { label: 'Low Stock', value: inventoryAlerts.length, sub: 'items to reorder', icon: FaExclamationTriangle, color: 'red', trend: '' },
                ].map((stat, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {stat.trend && <span className="text-xs text-emerald-500 flex items-center gap-0.5"><FaArrowUp className="text-[8px]" />{stat.trend}</span>}
                          <span className="text-xs text-gray-400">{stat.sub}</span>
                        </div>
                      </div>
                      <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                        <stat.icon className={`text-${stat.color}-500 text-lg`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Row */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Chart */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Revenue Trend</h3>
                    <div className="flex items-end gap-3 h-48">
                      {analytics.daily_revenue?.map((d: any, i: number) => {
                        const max = Math.max(...analytics.daily_revenue.map((x: any) => x.revenue))
                        const pct = max > 0 ? (d.revenue / max) * 100 : 0
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-400">₹{d.revenue.toFixed(0)}</span>
                            <div className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg transition-all hover:from-amber-600 hover:to-yellow-500" style={{ height: `${pct}%`, minHeight: '8px' }} />
                            <span className="text-[10px] text-gray-400">{d.date.slice(5)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Popular Items */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Popular Items</h3>
                    <div className="space-y-3">
                      {analytics.popular_items?.slice(0, 5).map((item: any, i: number) => {
                        const max = Math.max(...analytics.popular_items.map((x: any) => x.count))
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                <span className="text-xs text-gray-400">{item.count} orders</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${(item.count / max) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                    Recent Orders <button onClick={() => setActiveTab('orders')} className="text-xs text-amber-500 hover:underline">View All</button>
                  </h3>
                  <div className="space-y-2">
                    {orders.slice(0, 4).map(o => (
                      <div key={o._id || o.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{o.customer_name}</p>
                          <p className="text-[11px] text-gray-400">{o.items?.length} items • ${o.total?.toFixed(2)}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          o.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                          o.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                    Reservations <button onClick={() => setActiveTab('reservations')} className="text-xs text-amber-500 hover:underline">View All</button>
                  </h3>
                  <div className="space-y-2">
                    {reservations.slice(0, 4).map(r => (
                      <div key={r._id || r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{r.name}</p>
                          <p className="text-[11px] text-gray-400">{r.date} • {r.time} • {r.guests} guests</p>
                        </div>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{r.status || 'pending'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-5">
                  <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                    Inventory Alerts <button onClick={() => setActiveTab('inventory')} className="text-xs text-amber-500 hover:underline">View All</button>
                  </h3>
                  {inventoryAlerts.length === 0 ? (
                    <div className="text-center py-6 text-gray-400"><FaCheck className="mx-auto text-2xl text-emerald-400 mb-2" /><p className="text-sm">All items stocked</p></div>
                  ) : inventoryAlerts.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{a.name}</p>
                        <p className="text-[11px] text-red-500">Stock: {a.current_stock} / Min: {a.min_stock}</p>
                      </div>
                      <FaExclamationTriangle className="text-red-400" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ ORDERS ═══════════════════ */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Order Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Pending', count: pendingOrders.length, color: 'orange' },
                  { label: 'Preparing', count: preparingOrders.length, color: 'yellow' },
                  { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'blue' },
                  { label: 'Completed', count: completedOrders.length, color: 'emerald' },
                ].map((s, i) => (
                  <div key={i} className={`bg-${s.color}-50 border border-${s.color}-200 rounded-xl p-4 text-center`}>
                    <p className={`text-2xl font-bold text-${s.color}-600`}>{s.count}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between">
                  <div><h2 className="text-lg font-bold text-gray-800">All Orders</h2><p className="text-xs text-gray-400">{orders.length} total</p></div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Order ID</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Customer</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Items</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map(o => (
                        <tr key={o._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm font-mono text-gray-600">{o._id}</td>
                          <td className="px-5 py-3"><p className="text-sm font-medium text-gray-700">{o.customer_name}</p><p className="text-[11px] text-gray-400">{o.email}</p></td>
                          <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded ${o.type === 'delivery' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{o.type}</span></td>
                          <td className="px-5 py-3 text-sm text-gray-500">{o.items?.length} items</td>
                          <td className="px-5 py-3 text-sm font-semibold text-gray-700">₹{o.total?.toFixed(2)}</td>
                          <td className="px-5 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            o.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            o.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                            o.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>{o.status}</span></td>
                          <td className="px-5 py-3">
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

          {/* ═══════════════════ RESERVATIONS ═══════════════════ */}
          {activeTab === 'reservations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{reservations.filter(r => r.status === 'confirmed').length}</p>
                  <p className="text-xs text-gray-500">Confirmed</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{pendingReservations.length}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{reservations.filter(r => r.status === 'cancelled').length}</p>
                  <p className="text-xs text-gray-500">Cancelled</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b"><h2 className="text-lg font-bold text-gray-800">All Reservations</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Guest</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Contact</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Date & Time</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Party</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Experience</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Special Requests</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {reservations.map(r => (
                        <tr key={r._id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-sm font-medium text-gray-700">{r.name}</td>
                          <td className="px-5 py-3"><p className="text-xs text-gray-500">{r.email}</p><p className="text-xs text-gray-400">{r.phone}</p></td>
                          <td className="px-5 py-3 text-sm text-gray-600">{r.date} at {r.time}</td>
                          <td className="px-5 py-3 text-sm text-gray-600">{r.guests} guests</td>
                          <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded">{r.experience || 'Standard'}</span></td>
                          <td className="px-5 py-3 text-xs text-gray-400 max-w-[150px] truncate">{r.special_requests || '-'}</td>
                          <td className="px-5 py-3"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            r.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            r.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{r.status || 'pending'}</span></td>
                          <td className="px-5 py-3 flex gap-1">
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

          {/* ═══════════════════ MENU ═══════════════════ */}
          {activeTab === 'menu' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between">
                  <div><h2 className="text-lg font-bold text-gray-800">Menu Items</h2><p className="text-xs text-gray-400">{menuItems.length} items</p></div>
                  <button onClick={() => setShowAddMenu(true)} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition"><FaPlus /> Add Item</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                  {menuItems.map(item => (
                    <div key={item.id} className="border rounded-xl overflow-hidden hover:shadow-md transition group">
                      <div className="h-40 bg-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <span className="text-amber-600 font-bold">₹{item.price}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.category}</span>
                          <div className="flex gap-2">
                            <span className="text-xs text-gray-400 flex items-center gap-0.5"><FaStar className="text-yellow-400" />{item.rating}</span>
                            <button onClick={() => deleteMenuItem(item.id)} className="text-red-400 hover:text-red-600"><FaTrash className="text-xs" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Menu Modal */}
              {showAddMenu && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-lg font-bold mb-4">Add Menu Item</h3>
                    <div className="space-y-3">
                      <input placeholder="Item Name" value={newMenu.name} onChange={e => setNewMenu({...newMenu, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <textarea placeholder="Description" value={newMenu.description} onChange={e => setNewMenu({...newMenu, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" rows={2} />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Price" type="number" value={newMenu.price} onChange={e => setNewMenu({...newMenu, price: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                        <select value={newMenu.category} onChange={e => setNewMenu({...newMenu, category: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                          <option value="">Category</option>
                          <option value="appetizers">Appetizers</option>
                          <option value="mains">Mains</option>
                          <option value="desserts">Desserts</option>
                          <option value="beverages">Beverages</option>
                        </select>
                      </div>
                      <input placeholder="Image URL" value={newMenu.image} onChange={e => setNewMenu({...newMenu, image: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowAddMenu(false)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                      <button onClick={addMenuItem} className="flex-1 bg-amber-500 text-black rounded-lg py-2 text-sm font-semibold hover:bg-amber-600">Add Item</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════ STAFF ═══════════════════ */}
          {activeTab === 'staff' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center justify-between mb-6">
                  <div><h2 className="text-lg font-bold text-gray-800">Staff Members</h2><p className="text-xs text-gray-400">{staff.length} members</p></div>
                  <button onClick={() => setShowAddStaff(true)} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><FaPlus /> Add Staff</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff.map(s => (
                    <div key={s.id} className="border rounded-xl p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${s.role === 'manager' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {s.name?.charAt(0)}
                        </div>
                        {s.role !== 'manager' && (
                          <button onClick={() => deleteStaff(s.id)} className="text-gray-300 hover:text-red-500 transition"><FaTrash className="text-xs" /></button>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-800">{s.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><FaEnvelope className="text-gray-300" />{s.email}</p>
                      {s.phone && <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><FaPhone className="text-gray-300" />{s.phone}</p>}
                      <span className={`inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${s.role === 'manager' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {showAddStaff && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-lg font-bold mb-4">Add Staff Member</h3>
                    <div className="space-y-3">
                      <input placeholder="Full Name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Email" type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Password" type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Phone" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowAddStaff(false)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                      <button onClick={addStaffMember} className="flex-1 bg-amber-500 text-black rounded-lg py-2 text-sm font-semibold hover:bg-amber-600">Add</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════ TABLES ═══════════════════ */}
          {activeTab === 'tables' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{tables.filter(t => t.status === 'available').length}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{tables.filter(t => t.status === 'occupied').length}</p>
                  <p className="text-xs text-gray-500">Occupied</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{tables.filter(t => t.status === 'reserved').length}</p>
                  <p className="text-xs text-gray-500">Reserved</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-600">{tables.reduce((s, t) => s + (t.seats || 0), 0)}</p>
                  <p className="text-xs text-gray-500">Total Seats</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Table Control</h2>
                  <a href="/tables" className="text-xs text-amber-500 hover:underline flex items-center gap-1">Open Floor Plan <FaExternalLinkAlt className="text-[8px]" /></a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tables.map(t => (
                    <div key={t.id} className={`border-2 rounded-xl p-4 text-center transition hover:shadow-md ${
                      t.status === 'available' ? 'border-emerald-300 bg-emerald-50' :
                      t.status === 'occupied' ? 'border-red-300 bg-red-50' :
                      'border-blue-300 bg-blue-50'
                    }`}>
                      <p className="font-bold text-gray-800 mb-1">{t.name || t.id}</p>
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

          {/* ═══════════════════ ANALYTICS ═══════════════════ */}
          {activeTab === 'analytics' && analytics && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `₹${analytics.total_revenue?.toFixed(2)}`, icon: FaChartBar, color: 'emerald' },
                  { label: 'Total Orders', value: analytics.total_orders, icon: FaShoppingBag, color: 'blue' },
                  { label: 'Total Tips', value: `₹${analytics.total_tips?.toFixed(2)}`, icon: FaPercent, color: 'purple' },
                  { label: 'Avg Rating', value: analytics.avg_rating?.toFixed(1), icon: FaStar, color: 'yellow' },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">{s.label}</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
                      </div>
                      <div className={`bg-${s.color}-100 p-3 rounded-xl`}><s.icon className={`text-${s.color}-500`} /></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Daily Revenue</h3>
                  <div className="flex items-end gap-3 h-52">
                    {analytics.daily_revenue?.map((d: any, i: number) => {
                      const max = Math.max(...analytics.daily_revenue.map((x: any) => x.revenue))
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-gray-400 font-mono">₹{d.revenue.toFixed(0)}</span>
                          <div className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg" style={{ height: `${(d.revenue / max) * 100}%`, minHeight: '8px' }} />
                          <span className="text-[10px] text-gray-400">{d.date.slice(5)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Hourly Distribution</h3>
                  <div className="flex items-end gap-2 h-52">
                    {Object.entries(analytics.hourly_distribution || {}).map(([h, c]: any) => {
                      const max = Math.max(...Object.values(analytics.hourly_distribution || {}).map((v: any) => v))
                      return (
                        <div key={h} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-gray-400">{c}</span>
                          <div className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-lg" style={{ height: `${(c / max) * 100}%`, minHeight: '8px' }} />
                          <span className="text-[10px] text-gray-400">{h}:00</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <a href="/analytics" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition">
                  <FaChartPie /> Open Full Analytics Dashboard <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ REVIEWS ═══════════════════ */}
          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{allReviews.filter((r: any) => r.approved).length}</p>
                  <p className="text-xs text-gray-500">Approved</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{unapprovedReviews.length}</p>
                  <p className="text-xs text-gray-500">Pending Approval</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{analytics?.avg_rating?.toFixed(1) || '—'}</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b"><h2 className="text-lg font-bold text-gray-800">All Reviews</h2></div>
                <div className="divide-y">
                  {allReviews.map((r: any) => (
                    <div key={r._id} className={`p-5 flex items-start gap-4 ${!r.approved ? 'bg-yellow-50/50' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${r.approved ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.name?.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                          <div className="flex">{[1,2,3,4,5].map(s => <FaStar key={s} className={`text-xs ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}</div>
                          {!r.approved && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded font-medium">PENDING</span>}
                        </div>
                        <p className="font-medium text-gray-700 text-sm">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.comment}</p>
                        {r.dish && <p className="text-xs text-amber-600 mt-1">Dish: {r.dish}</p>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!r.approved && <button onClick={() => approveReview(r._id)} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded text-xs font-medium"><FaCheck /></button>}
                        <button onClick={() => deleteReview(r._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1.5 rounded text-xs"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ INVENTORY ═══════════════════ */}
          {activeTab === 'inventory' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between">
                  <div><h2 className="text-lg font-bold text-gray-800">Kitchen Inventory</h2><p className="text-xs text-gray-400">{inventory.length} items tracked</p></div>
                  <a href="/kitchen" className="text-xs text-amber-500 hover:underline flex items-center gap-1">Kitchen Display <FaExternalLinkAlt className="text-[8px]" /></a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Item</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Category</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Stock</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Min Stock</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Unit</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {inventory.map((item: any) => {
                        const isLow = item.current_stock <= item.min_stock
                        return (
                          <tr key={item.id} className={`hover:bg-gray-50 ${isLow ? 'bg-red-50/50' : ''}`}>
                            <td className="px-5 py-3 text-sm font-medium text-gray-700">{item.name}</td>
                            <td className="px-5 py-3 text-sm text-gray-500">{item.category}</td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>{item.current_stock}</span>
                                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((item.current_stock / (item.min_stock * 3)) * 100, 100)}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-500">{item.min_stock}</td>
                            <td className="px-5 py-3 text-sm text-gray-500">{item.unit}</td>
                            <td className="px-5 py-3">
                              {isLow ? (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit"><FaExclamationTriangle className="text-[9px]" />Low Stock</span>
                              ) : (
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">In Stock</span>
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

          {/* ═══════════════════ GIFT CARDS ═══════════════════ */}
          {activeTab === 'gift-cards' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center justify-between mb-4">
                  <div><h2 className="text-lg font-bold text-gray-800">Gift Cards</h2><p className="text-xs text-gray-400">{giftCards.length} issued</p></div>
                  <a href="/gift-cards" className="text-xs text-amber-500 hover:underline flex items-center gap-1">Public Page <FaExternalLinkAlt className="text-[8px]" /></a>
                </div>
                {giftCards.length === 0 ? (
                  <div className="text-center py-10 text-gray-400"><FaGift className="mx-auto text-3xl mb-2" /><p>No gift cards issued yet</p></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {giftCards.map((gc: any) => (
                      <div key={gc.code} className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-5 text-black">
                        <div className="flex items-center justify-between mb-3">
                          <FaGift className="text-2xl opacity-60" />
                          <span className="text-xs bg-black/10 px-2 py-0.5 rounded">{gc.status || 'active'}</span>
                        </div>
                        <p className="font-mono text-lg font-bold tracking-wider mb-1">{gc.code}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">₹{gc.balance?.toFixed(2)}</span>
                          <span className="text-xs opacity-70">of ₹{gc.original_amount?.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ PROMO CODES ═══════════════════ */}
          {activeTab === 'promo-codes' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between">
                  <div><h2 className="text-lg font-bold text-gray-800">Promo Codes</h2><p className="text-xs text-gray-400">{promoCodes.length} codes</p></div>
                  <button onClick={() => setShowAddPromo(true)} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"><FaPlus /> New Code</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Code</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Type</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Value</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Min Order</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Usage</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Expires</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {promoCodes.map((pc: any) => (
                        <tr key={pc.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3"><code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-sm font-bold">{pc.code}</code></td>
                          <td className="px-5 py-3 text-sm text-gray-500 capitalize">{pc.type?.replace('_', ' ')}</td>
                          <td className="px-5 py-3 text-sm font-bold text-gray-700">{pc.type === 'percentage' ? `${pc.value}%` : `₹${pc.value}`}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">₹{pc.min_order}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">{pc.used}/{pc.max_uses}</td>
                          <td className="px-5 py-3 text-sm text-gray-500">{pc.expires_at}</td>
                          <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pc.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{pc.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {showAddPromo && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    <h3 className="text-lg font-bold mb-4">New Promo Code</h3>
                    <div className="space-y-3">
                      <input placeholder="CODE (e.g. SUMMER25)" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2 text-sm font-mono uppercase" />
                      <select value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                        <option value="free_shipping">Free Shipping</option>
                      </select>
                      <input placeholder="Value (e.g. 20)" type="number" value={newPromo.value} onChange={e => setNewPromo({...newPromo, value: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input placeholder="Description" value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Min Order" type="number" value={newPromo.min_order} onChange={e => setNewPromo({...newPromo, min_order: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                        <input type="date" value={newPromo.valid_until} onChange={e => setNewPromo({...newPromo, valid_until: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowAddPromo(false)} className="flex-1 border rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                      <button onClick={addPromoCode} className="flex-1 bg-amber-500 text-black rounded-lg py-2 text-sm font-semibold hover:bg-amber-600">Create</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════ NEWSLETTER ═══════════════════ */}
          {activeTab === 'newsletter' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-xl shadow-sm border p-5">
                <div className="flex items-center justify-between mb-6">
                  <div><h2 className="text-lg font-bold text-gray-800">Newsletter Subscribers</h2><p className="text-xs text-gray-400">{newsletter.length} subscribers</p></div>
                </div>
                {newsletter.length === 0 ? (
                  <div className="text-center py-10 text-gray-400"><FaNewspaper className="mx-auto text-3xl mb-2" /><p>No subscribers yet</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">#</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Email</th>
                          <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Subscribed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {newsletter.map((s: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-5 py-3 text-sm text-gray-400">{i + 1}</td>
                            <td className="px-5 py-3 text-sm text-gray-700 flex items-center gap-2"><FaEnvelope className="text-gray-300" />{s.email}</td>
                            <td className="px-5 py-3 text-sm text-gray-400">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════ SETTINGS ═══════════════════ */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5">Restaurant Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Restaurant Name</label>
                      <input type="text" defaultValue="Gastronome" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                        <input type="email" defaultValue="reservations@gastronome.com" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                        <input type="tel" defaultValue="+1 (212) 555-1234" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
                      <textarea defaultValue="350 Fifth Avenue, New York, NY 10118" className="w-full border rounded-lg px-4 py-2.5 text-sm" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Opening Hours</label>
                        <input type="text" defaultValue="5:00 PM - 11:00 PM" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Cuisine Type</label>
                        <input type="text" defaultValue="Fine Dining" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                      </div>
                    </div>
                    <button onClick={() => toast.success('Restaurant settings saved!')} className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black px-6 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition">Save Settings</button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-5">Account Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                      <input type="text" defaultValue={user.name} className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                      <input type="password" placeholder="Enter new password" className="w-full border rounded-lg px-4 py-2.5 text-sm" />
                    </div>
                    <button onClick={() => toast.success('Account updated successfully!')} className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-700 transition">Update Account</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
