'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiSend, FiCheck } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rating: 5, title: '', comment: '', dish: '' });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/reviews`).then(r => r.json()).then(setReviews).catch(() => {});
  }, []);

  const submit = async () => {
    if (!form.name || !form.comment) return;
    await fetch(`${API}/api/reviews`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setForm({ name: '', email: '', rating: 5, title: '', comment: '', dish: '' }); }, 3000);
    fetch(`${API}/api/reviews`).then(r => r.json()).then(setReviews).catch(() => {});
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Guest Reviews
            </h1>
            <p className="text-gray-600 text-lg mb-6">What our guests are saying about their experience</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-5xl font-bold text-amber-500">{avgRating}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} className={`${parseFloat(avgRating) >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-500 text-sm mt-1">{reviews.length} reviews</p>
              </div>
              <button onClick={() => setShowForm(!showForm)}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold">
                Write a Review
              </button>
            </div>
          </motion.div>

          {/* Review Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
              {submitted ? (
                <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
                  <FiCheck className="text-4xl text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-800">Review Submitted!</h3>
                  <p className="text-green-600">Your review will appear after approval. Thank you!</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
                  {/* Star Rating */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setForm({ ...form, rating: s })}
                          className="text-3xl transition-transform hover:scale-125">
                          <FiStar className={`${(hoverRating || form.rating) >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name *" className="px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="Email" className="px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                      placeholder="Review title" className="px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                    <input value={form.dish} onChange={e => setForm({ ...form, dish: e.target.value })}
                      placeholder="Dish you tried" className="px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                  </div>
                  <textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
                    placeholder="Tell us about your experience... *" rows={4}
                    className="w-full px-4 py-3 border rounded-xl focus:border-amber-500 focus:outline-none resize-none mb-4 text-gray-800" />
                  <button onClick={submit}
                    className="px-8 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold flex items-center gap-2">
                    <FiSend /> Submit Review
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={review._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{review.title || 'Great Experience'}</h3>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <FiStar key={s} className={`text-sm ${review.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  {review.dish && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{review.dish}</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{review.comment}</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="font-medium text-gray-700">{review.name}</span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
