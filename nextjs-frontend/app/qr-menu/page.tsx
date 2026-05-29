'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiPlus, FiMinus, FiStar } from 'react-icons/fi';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function QRMenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [table, setTable] = useState('');
  const [welcome, setWelcome] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState('All');
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('table') || '';
    setTable(t);
    fetch(`${API}/api/qr/menu?table=${t}`).then(r => r.json()).then(data => {
      setMenu(data.menu || []); setWelcome(data.message || 'Welcome!');
    }).catch(() => {});
  }, []);

  const categories = ['All'].concat(menu.map(m => m.category).filter((v, i, a) => a.indexOf(v) === i));
  const filtered = category === 'All' ? menu : menu.filter(m => m.category === category);

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => {
    const n = { ...prev }; if (n[id] > 1) n[id]--; else delete n[id]; return n;
  });

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const item = menu.find(m => m._id === id);
    return item ? { ...item, qty } : null;
  }).filter(Boolean) as any[];

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = async () => {
    await fetch(`${API}/api/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'QR Order', type: 'dine-in', table_number: table,
        items: cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.qty })),
        total, payment_method: 'card'
      })
    });
    setOrdered(true); setCart({});
  };

  const totalItems = Object.values(cart).reduce((s, q) => s + q, 0);

  if (ordered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600 mb-4">Your order has been sent to the kitchen. {table && `Table ${table}`}</p>
          <p className="text-amber-600 font-semibold text-lg mb-6">Total: ₹{total.toFixed(2)}</p>
          <button onClick={() => setOrdered(false)}
            className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-medium">
            Order More
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-6 text-white text-center">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Gastronome</h1>
        <p className="text-white/80 text-sm">{welcome}</p>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto px-4 py-3 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex gap-2">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                category === c ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 py-4 space-y-3">
        {filtered.map((item, i) => {
          const qty = cart[item._id] || 0;
          return (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow-md p-4 flex gap-4">
              <img src={item.image} alt={item.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <span className="font-bold text-amber-600">₹{item.price}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                  <span className="text-xs text-gray-500">{item.rating} · {item.prep_time} min · {item.calories} cal</span>
                </div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  {qty > 0 ? (
                    <div className="flex items-center gap-3 bg-amber-50 rounded-lg px-3 py-1">
                      <button onClick={() => removeFromCart(item._id)} className="text-amber-600 hover:text-amber-700">
                        <FiMinus />
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(item._id)} className="text-amber-600 hover:text-amber-700">
                        <FiPlus />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(item._id)}
                      className="px-4 py-1.5 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 font-medium flex items-center gap-1">
                      <FiPlus /> Add
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cart Footer */}
      {totalItems > 0 && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-20">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiShoppingCart className="text-amber-500" />
                <span className="text-gray-800 font-medium">{totalItems} items</span>
              </div>
              <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
            <button onClick={placeOrder}
              className="w-full py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-bold text-lg">
              Place Order
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
