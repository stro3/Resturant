'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiAward, FiGift, FiTrendingUp } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const tierColors: Record<string, { bg: string; text: string; gradient: string }> = {
  Bronze: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-400 to-orange-600' },
  Silver: { bg: 'bg-gray-100', text: 'text-gray-600', gradient: 'from-gray-400 to-gray-600' },
  Gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', gradient: 'from-yellow-400 to-amber-500' },
  Platinum: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-400 to-purple-600' },
};

export default function LoyaltyPage() {
  const [loyalty, setLoyalty] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const fetchLoyalty = async (e: string) => {
    try {
      const res = await fetch(`${API}/api/loyalty/${e}`);
      if (res.ok) { setLoyalty(await res.json()); setLoggedIn(true); }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setEmail(u.email);
      fetchLoyalty(u.email);
    }
  }, []);

  const redeem = async (points: number) => {
    setRedeeming(true);
    await fetch(`${API}/api/loyalty/${email}/redeem`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points })
    });
    await fetchLoyalty(email);
    setRedeeming(false);
  };

  const tc = loyalty ? tierColors[loyalty.tier] || tierColors.Bronze : tierColors.Bronze;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <FiAward className="text-5xl text-amber-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Loyalty Rewards
            </h1>
            <p className="text-gray-600 text-lg">Earn points with every order and unlock exclusive rewards</p>
          </motion.div>

          {!loggedIn ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center">
              <FiStar className="text-4xl text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Points</h2>
              <p className="text-gray-600 mb-4">Enter your email to view loyalty status</p>
              <input value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchLoyalty(email)}
                placeholder="your@email.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-3 focus:border-amber-500 focus:outline-none text-gray-800" />
              <button onClick={() => fetchLoyalty(email)}
                className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold">View Points</button>
              <p className="text-gray-400 text-sm mt-3">Try: customer@test.com</p>
            </motion.div>
          ) : loyalty && (
            <>
              {/* Loyalty Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${tc.gradient} rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-2xl`}>
                <div className="absolute inset-0 bg-white/5" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">GASTRONOME REWARDS</p>
                    <p className="text-5xl font-bold mb-2">{loyalty.points}</p>
                    <p className="text-white/80">Points Available</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 inline-block">
                      <p className="text-sm text-white/70">Tier</p>
                      <p className="text-2xl font-bold">{loyalty.tier}</p>
                    </div>
                  </div>
                </div>
                {loyalty.points_to_next > 0 && (
                  <div className="relative mt-6">
                    <div className="flex justify-between text-sm text-white/70 mb-1">
                      <span>Progress to {loyalty.next_tier}</span>
                      <span>{loyalty.points_to_next} points to go</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(5, 100 - (loyalty.points_to_next / (loyalty.tier === 'Bronze' ? 200 : 500)) * 100)}%` }} />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* How it Works */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: FiTrendingUp, title: 'Earn Points', desc: 'Get 1 point per ₹100 spent on every order' },
                  { icon: FiStar, title: 'Level Up', desc: 'Reach higher tiers for better rewards' },
                  { icon: FiGift, title: 'Redeem', desc: 'Use points for free items and discounts' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="bg-white rounded-xl p-5 shadow-lg text-center">
                    <item.icon className="text-3xl text-amber-500 mx-auto mb-2" />
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Available Rewards */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rewards</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {loyalty.rewards?.map((reward: any, i: number) => (
                    <div key={i} className={`border-2 rounded-xl p-5 transition-all ${
                      reward.available ? 'border-amber-300 bg-amber-50 hover:shadow-lg' : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{reward.name}</h3>
                          <p className="text-amber-600 font-semibold">{reward.cost} points</p>
                        </div>
                        <FiGift className={`text-2xl ${reward.available ? 'text-amber-500' : 'text-gray-400'}`} />
                      </div>
                      <button onClick={() => reward.available && redeem(reward.cost)}
                        disabled={!reward.available || redeeming}
                        className={`w-full py-2 rounded-lg font-medium text-sm transition-all ${
                          reward.available ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}>
                        {reward.available ? (redeeming ? 'Redeeming...' : 'Redeem Now') : `Need ${reward.cost - loyalty.points} more pts`}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
