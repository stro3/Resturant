'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCheckCircle, FiClock, FiPackage, FiTruck, FiMapPin } from 'react-icons/fi';
import { GiCookingPot } from 'react-icons/gi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusSteps = [
  { key: 'pending', label: 'Received', icon: FiClock, color: 'text-yellow-500' },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle, color: 'text-blue-500' },
  { key: 'preparing', label: 'Preparing', icon: GiCookingPot, color: 'text-amber-500' },
  { key: 'ready', label: 'Ready', icon: FiPackage, color: 'text-green-500' },
  { key: 'out-for-delivery', label: 'On The Way', icon: FiTruck, color: 'text-purple-500' },
  { key: 'completed', label: 'Delivered', icon: FiMapPin, color: 'text-emerald-500' },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async () => {
    if (!orderId.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/orders/${orderId.trim()}/track`);
      if (!res.ok) throw new Error('Order not found');
      setTracking(await res.json());
    } catch { setError('Order not found. Please check your order ID.'); setTracking(null); }
    setLoading(false);
  };

  const currentIdx = tracking ? statusSteps.findIndex(s => s.key === tracking.status) : -1;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Track Your Order
            </h1>
            <p className="text-gray-600 text-lg">Enter your order number to see real-time updates</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input value={orderId} onChange={e => setOrderId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchTracking()}
                  placeholder="Enter order number (e.g., ORD-1002)"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-gray-800 text-lg" />
              </div>
              <button onClick={fetchTracking} disabled={loading}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
            {error && <p className="mt-3 text-red-500 text-center">{error}</p>}
            <p className="mt-3 text-gray-400 text-sm text-center">Try: ORD-1001, ORD-1002, ORD-1003, ORD-1004</p>
          </motion.div>

          {/* Tracking Result */}
          <AnimatePresence>
            {tracking && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Status Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">Order #{tracking.order_number || tracking.order_id}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      tracking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      tracking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>{tracking.status?.toUpperCase()}</span>
                  </div>
                  <p className="text-gray-500 mb-8">{tracking.type === 'delivery' ? 'Delivery Order' : 'Dine-in Order'} · Est: {tracking.estimated_time}</p>

                  {/* Progress Steps */}
                  <div className="relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(0, (currentIdx / (statusSteps.length - 1)) * 100)}%` }} />
                    </div>
                    <div className="relative flex justify-between">
                      {statusSteps.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = i <= currentIdx;
                        const isCurrent = i === currentIdx;
                        return (
                          <div key={step.key} className="flex flex-col items-center" style={{ width: '16.66%' }}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500 ${
                              isCurrent ? 'bg-amber-500 text-white scale-125 shadow-lg shadow-amber-200' :
                              isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Icon className="text-lg" />
                            </div>
                            <span className={`text-xs text-center font-medium ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Details + Timeline */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Items */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                    {tracking.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200 flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-amber-600">₹{tracking.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      {tracking.tracking?.map((t: any, i: number) => (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${i === tracking.tracking.length - 1 ? 'bg-amber-500' : 'bg-green-500'}`} />
                            {i < tracking.tracking.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                          </div>
                          <div className="pb-4">
                            <p className="font-medium text-gray-800">{t.message}</p>
                            <p className="text-sm text-gray-400">{new Date(t.time).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
