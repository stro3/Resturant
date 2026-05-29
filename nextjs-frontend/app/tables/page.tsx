'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiClock, FiPlus, FiRefreshCw } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusColor: Record<string, { bg: string; border: string; text: string; fill: string }> = {
  available: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-700', fill: 'fill-green-500' },
  occupied: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-700', fill: 'fill-red-500' },
  reserved: { bg: 'bg-amber-100', border: 'border-amber-500', text: 'text-amber-700', fill: 'fill-amber-500' },
};

export default function TablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [wlForm, setWlForm] = useState({ name: '', phone: '', party_size: 2 });

  const fetchData = async () => {
    try {
      const [t, w] = await Promise.all([fetch(`${API}/api/tables`), fetch(`${API}/api/waitlist`)]);
      setTables(await t.json()); setWaitlist(await w.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const updateTable = async (id: string, status: string) => {
    await fetch(`${API}/api/tables/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData(); setSelected(null);
  };

  const joinWaitlist = async () => {
    if (!wlForm.name) return;
    await fetch(`${API}/api/waitlist`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wlForm)
    });
    setWlForm({ name: '', phone: '', party_size: 2 }); fetchData();
  };

  const stats = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    totalSeats: tables.reduce((sum, t) => sum + t.seats, 0),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Table Management
              </h1>
              <p className="text-gray-600 mt-1">Interactive floor plan & seating overview</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowWaitlist(!showWaitlist)}
                className="px-4 py-2 border-2 border-amber-500 text-amber-600 rounded-xl hover:bg-amber-50 font-medium flex items-center gap-2">
                <FiUsers /> Waitlist ({waitlist.length})
              </button>
              <button onClick={fetchData} className="p-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50">
                <FiRefreshCw />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Available', value: stats.available, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Occupied', value: stats.occupied, color: 'text-red-600', bg: 'bg-red-50' },
              { label: 'Reserved', value: stats.reserved, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Total Seats', value: stats.totalSeats, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-600 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Floor Plan */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Floor Plan</h2>
                <div className="flex gap-4 text-sm">
                  {Object.entries(statusColor).map(([status, c]) => (
                    <div key={status} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${c.bg} border ${c.border}`} />
                      <span className="text-gray-600 capitalize">{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
                style={{ height: '500px' }}>
                {/* Restaurant areas */}
                <div className="absolute top-2 left-2 text-xs text-gray-400 font-medium">MAIN DINING</div>
                <div className="absolute top-[35%] left-2 text-xs text-gray-400 font-medium">LOUNGE AREA</div>
                <div className="absolute top-[60%] left-2 text-xs text-gray-400 font-medium">PRIVATE</div>
                <div className="absolute bottom-2 left-2 text-xs text-gray-400 font-medium">BAR</div>

                {tables.map(table => {
                  const colors = statusColor[table.status] || statusColor.available;
                  const size = table.seats <= 2 ? 'w-14 h-14' : table.seats <= 4 ? 'w-16 h-16' : table.seats <= 6 ? 'w-20 h-16' : 'w-24 h-16';
                  const shape = table.shape === 'round' ? 'rounded-full' : 'rounded-xl';

                  return (
                    <motion.button key={table.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelected(table)}
                      className={`absolute ${size} ${shape} ${colors.bg} border-2 ${colors.border} flex flex-col items-center justify-center cursor-pointer transition-shadow hover:shadow-lg ${
                        selected?.id === table.id ? 'ring-4 ring-blue-400 shadow-xl' : ''
                      }`}
                      style={{ left: `${table.x}%`, top: `${table.y}%`, transform: 'translate(-50%, -50%)' }}>
                      <span className="text-xs font-bold text-gray-800">{table.name}</span>
                      <span className={`text-[10px] ${colors.text}`}>
                        <FiUsers className="inline" /> {table.seats}
                      </span>
                    </motion.button>
                  );
                })}

                {/* Kitchen area */}
                <div className="absolute right-3 top-3 bg-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 font-medium">
                  🍳 KITCHEN
                </div>
                <div className="absolute right-3 bottom-3 bg-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 font-medium">
                  🚪 ENTRANCE
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Selected Table */}
              {selected ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{selected.name}</h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600"><FiUsers className="inline mr-1" /> {selected.seats} seats</p>
                    <p className="text-gray-600">Status: <span className={`font-semibold capitalize ${statusColor[selected.status]?.text}`}>
                      {selected.status}</span></p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => updateTable(selected.id, 'available')}
                      className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600">Available</button>
                    <button onClick={() => updateTable(selected.id, 'occupied')}
                      className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">Occupied</button>
                    <button onClick={() => updateTable(selected.id, 'reserved')}
                      className="px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600">Reserved</button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center text-gray-400">
                  <p>Click a table on the floor plan to manage it</p>
                </div>
              )}

              {/* Waitlist */}
              {showWaitlist && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Waitlist</h3>
                  <div className="space-y-3 mb-4">
                    <input value={wlForm.name} onChange={e => setWlForm({ ...wlForm, name: e.target.value })}
                      placeholder="Guest name" className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                    <input value={wlForm.phone} onChange={e => setWlForm({ ...wlForm, phone: e.target.value })}
                      placeholder="Phone" className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                    <input type="number" value={wlForm.party_size}
                      onChange={e => setWlForm({ ...wlForm, party_size: parseInt(e.target.value) || 2 })}
                      placeholder="Party size" className="w-full px-3 py-2 border rounded-lg text-gray-800" />
                    <button onClick={joinWaitlist}
                      className="w-full py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium flex items-center justify-center gap-2">
                      <FiPlus /> Add to Waitlist
                    </button>
                  </div>
                  {waitlist.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {waitlist.map((w: any) => (
                        <div key={w.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800">{w.name}</p>
                            <p className="text-xs text-gray-500">Party of {w.party_size} · {w.estimated_wait}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            w.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>{w.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 text-sm">No one waiting</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
