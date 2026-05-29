'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiPackage } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusColors: Record<string, string> = {
  pending: 'border-yellow-400 bg-yellow-50',
  confirmed: 'border-blue-400 bg-blue-50',
  preparing: 'border-amber-400 bg-amber-50',
  ready: 'border-green-400 bg-green-50',
};

const statusBadge: Record<string, string> = {
  pending: 'bg-yellow-500', confirmed: 'bg-blue-500',
  preparing: 'bg-amber-500', ready: 'bg-green-500',
};

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordRes, invRes, alertRes] = await Promise.all([
        fetch(`${API}/api/kitchen/orders`), fetch(`${API}/api/kitchen/inventory`),
        fetch(`${API}/api/kitchen/inventory/alerts`)
      ]);
      setOrders(await ordRes.json()); setInventory(await invRes.json()); setAlerts(await alertRes.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); const iv = setInterval(fetchData, 10000); return () => clearInterval(iv); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/orders/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GiCookingPot className="text-3xl text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold">Kitchen Display System</h1>
              <p className="text-gray-400 text-sm">Real-time order management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">LIVE</span>
            </div>
            <span className="text-gray-400">{now.toLocaleTimeString()}</span>
            <button onClick={fetchData} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <FiRefreshCw className="text-xl" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {['all', 'pending', 'confirmed', 'preparing', 'ready'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded text-xs">
                {orders.filter(o => o.status === f).length}
              </span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Orders Grid */}
        <div className="flex-1 p-6">
          {alerts.length > 0 && (
            <div className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-6 flex items-center gap-3">
              <FiAlertTriangle className="text-red-400 text-2xl flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-300">Low Stock Alerts</p>
                <p className="text-red-400 text-sm">{alerts.map(a => a.name).join(', ')} — running low!</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FiCheckCircle className="text-5xl mb-3 text-green-500" />
              <p className="text-xl">All caught up!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filtered.map(order => {
                  const elapsed = Math.round((now.getTime() - new Date(order.created_at).getTime()) / 60000);
                  const isUrgent = elapsed > 20 && order.status !== 'ready';
                  return (
                    <motion.div key={order._id} layout
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className={`rounded-xl border-2 p-5 ${statusColors[order.status] || 'border-gray-600 bg-gray-800'} ${isUrgent ? 'ring-2 ring-red-500 animate-pulse' : ''}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{order.order_number || order._id}</p>
                          <p className="text-gray-600 text-sm">{order.customer_name} · {order.type}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-1 rounded text-xs text-white font-bold ${statusBadge[order.status]}`}>
                            {order.status?.toUpperCase()}
                          </span>
                          {order.priority === 'rush' && (
                            <span className="px-2 py-0.5 rounded text-xs bg-red-500 text-white font-bold">RUSH</span>
                          )}
                        </div>
                      </div>

                      {order.table_number && (
                        <p className="text-sm text-gray-600 mb-2">Table {order.table_number}</p>
                      )}

                      <div className="space-y-1 mb-4">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.quantity}× {item.name}</span>
                          </div>
                        ))}
                      </div>

                      {order.special_instructions && (
                        <p className="text-xs bg-yellow-200 text-yellow-800 p-2 rounded mb-3">
                          Note: {order.special_instructions}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1 text-sm ${isUrgent ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                          <FiClock /> {elapsed} min
                        </div>
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <button onClick={() => updateStatus(order._id, 'preparing')}
                              className="px-3 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 font-medium">
                              Start
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button onClick={() => updateStatus(order._id, 'ready')}
                              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 font-medium">
                              Ready
                            </button>
                          )}
                          {order.status === 'ready' && (
                            <button onClick={() => updateStatus(order._id, 'completed')}
                              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 font-medium">
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar: Inventory */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 p-4 hidden lg:block">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiPackage className="text-amber-400" /> Inventory
          </h3>
          <div className="space-y-2">
            {inventory.map(item => {
              const low = item.quantity <= item.min_stock;
              return (
                <div key={item.id} className={`p-3 rounded-lg ${low ? 'bg-red-900/30 border border-red-500/50' : 'bg-gray-700'}`}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className={`text-sm font-bold ${low ? 'text-red-400' : 'text-green-400'}`}>
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-600 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${low ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, (item.quantity / (item.min_stock * 3)) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
