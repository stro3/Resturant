'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGift, FiCreditCard, FiCheck, FiSearch } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const amounts = [2000, 4000, 6000, 8000, 12000, 16000];

export default function GiftCardsPage() {
  const [tab, setTab] = useState<'buy' | 'check'>('buy');
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ purchaser_name: '', purchaser_email: '', recipient_name: '', recipient_email: '', message: '' });
  const [result, setResult] = useState<any>(null);
  const [checkCode, setCheckCode] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buyGiftCard = async () => {
    setLoading(true);
    try {
      const finalAmount = customAmount ? parseFloat(customAmount) : amount;
      const res = await fetch(`${API}/api/gift-cards`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: finalAmount })
      });
      if (!res.ok) throw new Error('Failed to purchase gift card');
      const data = await res.json();
      setResult(data.gift_card);
    } catch (err) {
      alert('Failed to purchase gift card. Please make sure the server is running.');
    }
    setLoading(false);
  };

  const checkBalance = async () => {
    if (!checkCode.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/gift-cards/check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: checkCode.trim() })
      });
      setCheckResult(await res.json());
    } catch { setCheckResult({ error: true }); }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <FiGift className="text-5xl text-amber-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Gift Cards
            </h1>
            <p className="text-gray-600 text-lg">Give the gift of an exceptional dining experience</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <button onClick={() => { setTab('buy'); setResult(null); }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                tab === 'buy' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              <FiGift className="inline mr-2" /> Purchase Gift Card
            </button>
            <button onClick={() => { setTab('check'); setCheckResult(null); }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                tab === 'check' ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              <FiSearch className="inline mr-2" /> Check Balance
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'buy' && !result && (
              <motion.div key="buy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl shadow-xl p-8">
                {/* Amount Selection */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Amount</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {amounts.map(a => (
                    <button key={a} onClick={() => { setAmount(a); setCustomAmount(''); }}
                      className={`py-3 rounded-xl font-bold text-lg transition-all ${
                        amount === a && !customAmount ? 'bg-amber-500 text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>₹{a}</button>
                  ))}
                </div>
                <input type="number" value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setAmount(0); }}
                  placeholder="Or enter custom amount..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none mb-6 text-gray-800" />

                {/* Gift Card Preview */}
                <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAyMGgyME0yMCAwdjIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIvPjwvc3ZnPg==')] opacity-30" />
                  <div className="relative">
                    <p className="text-white/80 text-sm mb-1">GASTRONOME</p>
                    <p className="text-4xl font-bold mb-4">₹{customAmount || amount}</p>
                    <p className="text-white/80">Gift Card</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input value={form.purchaser_name} onChange={e => setForm({ ...form, purchaser_name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input value={form.purchaser_email} onChange={e => setForm({ ...form, purchaser_email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                    <input value={form.recipient_name} onChange={e => setForm({ ...form, recipient_name: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                    <input value={form.recipient_email} onChange={e => setForm({ ...form, recipient_email: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={3} placeholder="Add a personal message..."
                    className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none resize-none text-gray-800" />
                </div>
                <button onClick={buyGiftCard} disabled={loading}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50">
                  {loading ? 'Processing...' : `Purchase ₹${customAmount || amount} Gift Card`}
                </button>
              </motion.div>
            )}

            {tab === 'buy' && result && (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-3xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gift Card Created!</h2>
                <p className="text-gray-600 mb-6">Share this code with the recipient</p>
                <div className="bg-gray-100 rounded-xl p-6 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Gift Card Code</p>
                  <p className="text-3xl font-mono font-bold text-amber-600 tracking-wider">{result.code}</p>
                  <p className="text-lg text-gray-700 mt-2">Balance: ₹{result.balance?.toFixed(2)}</p>
                </div>
                <button onClick={() => { setResult(null); setForm({ purchaser_name: '', purchaser_email: '', recipient_name: '', recipient_email: '', message: '' }); }}
                  className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium">
                  Purchase Another
                </button>
              </motion.div>
            )}

            {tab === 'check' && (
              <motion.div key="check" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Check Gift Card Balance</h2>
                <div className="flex gap-3 mb-6">
                  <input value={checkCode} onChange={e => setCheckCode(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && checkBalance()}
                    placeholder="Enter gift card code (e.g., GIFT-AABB-1234)"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-gray-800 text-lg font-mono" />
                  <button onClick={checkBalance} disabled={loading}
                    className="px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold">
                    {loading ? '...' : 'Check'}
                  </button>
                </div>

                {checkResult && !checkResult.message && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Gift Card: {checkResult.code}</p>
                        <p className="text-4xl font-bold text-green-600 mt-1">₹{checkResult.balance?.toFixed(2)}</p>
                        <p className="text-sm text-gray-500 mt-1">Original: ₹{checkResult.amount?.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          checkResult.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                        }`}>{checkResult.status?.toUpperCase()}</span>
                        <p className="text-xs text-gray-400 mt-2">Expires: {checkResult.expires_at}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {checkResult?.message && (
                  <p className="text-center text-red-500 py-4">{checkResult.message}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
