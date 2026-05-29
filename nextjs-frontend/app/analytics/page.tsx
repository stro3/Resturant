'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUsers, FiTrendingUp, FiStar, FiAlertTriangle, FiClock, FiBarChart2 } from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/analytics/overview`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
    </div>
  );

  if (!data) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Failed to load analytics</div>;

  const stats = [
    { icon: FiBarChart2, label: 'Total Revenue', value: `₹${data.total_revenue?.toLocaleString()}`, color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: FiShoppingBag, label: 'Total Orders', value: data.total_orders, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: FiTrendingUp, label: 'Avg Order Value', value: `₹${data.avg_order_value?.toFixed(2)}`, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { icon: FiBarChart2, label: 'Total Tips', value: `₹${data.total_tips?.toFixed(2)}`, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { icon: FiUsers, label: 'Customers', value: data.total_customers, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { icon: FiStar, label: 'Avg Rating', value: `${data.avg_rating}/5`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { icon: FiClock, label: 'Peak Hour', value: `${data.peak_hour}:00`, color: 'text-red-400', bg: 'bg-red-400/10' },
    { icon: FiAlertTriangle, label: 'Low Stock Items', value: data.inventory_alerts, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  const maxRevenue = Math.max(...(data.daily_revenue?.map((d: any) => d.revenue) || [1]));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-400">Gastronome Business Insights</p>
        </div>
        <a href="/dashboard/manager" className="px-4 py-2 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700 text-sm">
          ← Back to Dashboard
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`text-xl ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiBarChart2 className="text-amber-400" /> Daily Revenue
          </h2>
          <div className="flex items-end gap-2 h-48">
            {data.daily_revenue?.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-400">₹{d.revenue.toFixed(0)}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg min-h-[4px]" />
                <span className="text-xs text-gray-500 truncate w-full text-center">
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-green-400" /> Popular Items
          </h2>
          <div className="space-y-4">
            {data.popular_items?.map((item: any, i: number) => {
              const maxCount = data.popular_items[0]?.count || 1;
              const colors = ['bg-amber-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{i + 1}. {item.name}</span>
                    <span className="text-gray-400">{item.count} orders</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / maxCount) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className={`h-full rounded-full ${colors[i % colors.length]}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Hourly Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <FiClock className="text-cyan-400" /> Order Distribution by Hour
          </h2>
          <div className="flex items-end gap-1 h-40">
            {Array.from({ length: 24 }, (_, h) => {
              const count = data.hourly_distribution?.[h] || 0;
              const maxH = Math.max(...Object.values(data.hourly_distribution || {}).map(Number), 1);
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div initial={{ height: 0 }}
                    animate={{ height: count ? `${(count / maxH) * 100}%` : '2px' }}
                    transition={{ delay: 0.5 + h * 0.02 }}
                    className={`w-full rounded-t ${count ? 'bg-cyan-500' : 'bg-gray-700'} min-h-[2px]`} />
                  {h % 4 === 0 && <span className="text-[10px] text-gray-500">{h}h</span>}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-bold mb-4">Quick Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">Completed Orders</span>
              <span className="text-green-400 font-bold">{data.completed_orders}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">Reservations</span>
              <span className="text-blue-400 font-bold">{data.total_reservations}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">Completion Rate</span>
              <span className="text-amber-400 font-bold">
                {data.total_orders ? Math.round((data.completed_orders / data.total_orders) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">Avg Tip Rate</span>
              <span className="text-purple-400 font-bold">
                {data.total_revenue ? Math.round((data.total_tips / data.total_revenue) * 100) : 0}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
