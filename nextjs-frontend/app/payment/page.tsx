'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiUsers, FiFileText, FiCheck, FiPrinter } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const tipPresets = [15, 18, 20, 25];

export default function PaymentPage() {
  const [tab, setTab] = useState<'pay' | 'split' | 'invoice'>('pay');
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState('');
  const [payMethod, setPayMethod] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [paid, setPaid] = useState(false);
  const [splits, setSplits] = useState<{name: string; amount: string; tip: string}[]>([
    { name: '', amount: '', tip: '' }, { name: '', amount: '', tip: '' }
  ]);
  const [splitDone, setSplitDone] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch(`${API}/api/orders`).then(r => r.json()).then(setOrders).catch(() => {});
  }, []);

  const subtotal = selectedOrder?.total || 0;
  const tipAmount = customTip ? parseFloat(customTip) : subtotal * tipPercent / 100;
  const grandTotal = subtotal + tipAmount;

  const processPayment = async () => {
    await fetch(`${API}/api/payments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: selectedOrder._id, amount: grandTotal,
        tip: tipAmount, method: payMethod, card_last4: cardNum.slice(-4)
      })
    });
    setPaid(true);
  };

  const processSplit = async () => {
    if (!selectedOrder) return;
    await fetch(`${API}/api/payments/split`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: selectedOrder._id,
        splits: splits.map(s => ({
          name: s.name || 'Guest', amount: parseFloat(s.amount) || 0,
          tip: parseFloat(s.tip) || 0, method: 'card'
        }))
      })
    });
    setSplitDone(true);
  };

  const fetchInvoice = async () => {
    if (!invoiceId) return;
    try {
      const res = await fetch(`${API}/api/invoice/${invoiceId}`);
      setInvoice(await res.json());
    } catch { setInvoice(null); }
  };

  const unpaidOrders = orders.filter(o => o.payment_status !== 'paid' || true);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Payment Center
            </h1>
            <p className="text-gray-600">Pay your bill, split with friends, or view invoices</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {[
              { key: 'pay', label: 'Pay Bill', icon: FiCreditCard },
              { key: 'split', label: 'Split Bill', icon: FiUsers },
              { key: 'invoice', label: 'Invoice', icon: FiFileText },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key as any); setPaid(false); setSplitDone(false); }}
                className={`px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  tab === t.key ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                }`}>
                <t.icon /> {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* PAY TAB */}
            {tab === 'pay' && (
              <motion.div key="pay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {paid ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-2">Amount: ₹{grandTotal.toFixed(2)} (incl. ₹{tipAmount.toFixed(2)} tip)</p>
                    <p className="text-gray-400 text-sm">Thank you for dining with us!</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Select Order */}
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Select Your Order</h2>
                    <div className="grid gap-2 mb-6 max-h-48 overflow-y-auto">
                      {orders.slice(0, 10).map(o => (
                        <button key={o._id} onClick={() => setSelectedOrder(o)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                            selectedOrder?._id === o._id ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <div>
                            <p className="font-medium text-gray-800">{o.order_number || o._id}</p>
                            <p className="text-sm text-gray-500">{o.customer_name} · {o.items?.length} items</p>
                          </div>
                          <p className="font-bold text-gray-900">₹{o.total?.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>

                    {selectedOrder && (
                      <>
                        {/* Tip Selection */}
                        <h3 className="font-bold text-gray-900 mb-3">Add Tip</h3>
                        <div className="flex gap-2 mb-3">
                          {tipPresets.map(p => (
                            <button key={p} onClick={() => { setTipPercent(p); setCustomTip(''); }}
                              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                tipPercent === p && !customTip ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}>{p}%</button>
                          ))}
                        </div>
                        <input value={customTip} onChange={e => setCustomTip(e.target.value)}
                          placeholder="Custom tip amount ($)"
                          className="w-full px-4 py-3 border rounded-xl mb-6 focus:border-amber-500 focus:outline-none text-gray-800" />

                        {/* Payment Method */}
                        <h3 className="font-bold text-gray-900 mb-3">Payment Method</h3>
                        <div className="flex gap-3 mb-4">
                          {['card', 'cash', 'apple-pay'].map(m => (
                            <button key={m} onClick={() => setPayMethod(m)}
                              className={`flex-1 py-3 rounded-xl font-medium capitalize transition-all ${
                                payMethod === m ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                              }`}>{m === 'apple-pay' ? 'Apple Pay' : m}</button>
                          ))}
                        </div>

                        {payMethod === 'card' && (
                          <input value={cardNum} onChange={e => setCardNum(e.target.value)}
                            placeholder="Card number (last 4 digits for demo)"
                            className="w-full px-4 py-3 border rounded-xl mb-6 focus:border-amber-500 focus:outline-none text-gray-800" />
                        )}

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Tip</span><span>₹{tipAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                            <span>Total</span><span>₹{grandTotal.toFixed(2)}</span>
                          </div>
                        </div>

                        <button onClick={processPayment}
                          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg rounded-xl">
                          Pay ₹{grandTotal.toFixed(2)}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* SPLIT TAB */}
            {tab === 'split' && (
              <motion.div key="split" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl p-8">
                {splitDone ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiCheck className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Bill Split Successfully!</h2>
                    <p className="text-gray-600">All payments have been processed.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Split the Bill</h2>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Select Order</label>
                      <select onChange={e => setSelectedOrder(orders.find(o => o._id === e.target.value) || null)}
                        className="w-full px-4 py-3 border rounded-xl text-gray-800">
                        <option value="">Choose an order...</option>
                        {orders.map(o => <option key={o._id} value={o._id}>{o.order_number} - ₹{o.total?.toFixed(2)}</option>)}
                      </select>
                    </div>

                    {splits.map((s, i) => (
                      <div key={i} className="grid grid-cols-3 gap-3 mb-3">
                        <input value={s.name} onChange={e => { const n = [...splits]; n[i].name = e.target.value; setSplits(n); }}
                          placeholder={`Person ${i + 1}`}
                          className="px-3 py-2 border rounded-lg text-gray-800" />
                        <input value={s.amount} onChange={e => { const n = [...splits]; n[i].amount = e.target.value; setSplits(n); }}
                          placeholder="Amount (₹)"
                          className="px-3 py-2 border rounded-lg text-gray-800" />
                        <input value={s.tip} onChange={e => { const n = [...splits]; n[i].tip = e.target.value; setSplits(n); }}
                          placeholder="Tip (₹)"
                          className="px-3 py-2 border rounded-lg text-gray-800" />
                      </div>
                    ))}

                    <div className="flex gap-3 mb-6">
                      <button onClick={() => setSplits([...splits, { name: '', amount: '', tip: '' }])}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-500 text-sm">
                        + Add Person
                      </button>
                      {splits.length > 2 && (
                        <button onClick={() => setSplits(splits.slice(0, -1))}
                          className="px-4 py-2 text-red-500 text-sm hover:bg-red-50 rounded-lg">Remove Last</button>
                      )}
                    </div>

                    <button onClick={processSplit} disabled={!selectedOrder}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl disabled:opacity-50">
                      Split & Pay
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* INVOICE TAB */}
            {tab === 'invoice' && (
              <motion.div key="invoice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">View Invoice</h2>
                  <div className="flex gap-3 mb-6">
                    <input value={invoiceId} onChange={e => setInvoiceId(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && fetchInvoice()}
                      placeholder="Enter order ID (e.g., ORD-1001)"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none text-gray-800" />
                    <button onClick={fetchInvoice}
                      className="px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold">
                      <FiFileText className="inline mr-1" /> View
                    </button>
                  </div>

                  {invoice && !invoice.error && (
                    <div className="border-2 border-gray-200 rounded-xl p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {invoice.restaurant?.name}
                          </h3>
                          <p className="text-gray-500 text-sm">{invoice.restaurant?.address}</p>
                          <p className="text-gray-500 text-sm">{invoice.restaurant?.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{invoice.invoice_number}</p>
                          <p className="text-gray-500 text-sm">{invoice.date}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{invoice.payment_status?.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Bill To:</p>
                        <p className="font-medium text-gray-800">{invoice.customer}</p>
                        <p className="text-sm text-gray-500">{invoice.email}</p>
                      </div>

                      <table className="w-full mb-6">
                        <thead>
                          <tr className="border-b-2 text-left">
                            <th className="pb-2 text-gray-600">Item</th>
                            <th className="pb-2 text-gray-600 text-right">Qty</th>
                            <th className="pb-2 text-gray-600 text-right">Price</th>
                            <th className="pb-2 text-gray-600 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoice.items?.map((item: any, i: number) => (
                            <tr key={i} className="border-b">
                              <td className="py-3 text-gray-800">{item.name}</td>
                              <td className="py-3 text-gray-600 text-right">{item.quantity}</td>
                              <td className="py-3 text-gray-600 text-right">₹{item.price?.toFixed(2)}</td>
                              <td className="py-3 text-gray-800 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="border-t-2 pt-4 space-y-1">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span><span>₹{invoice.subtotal?.toFixed(2)}</span>
                        </div>
                        {invoice.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount</span><span>-₹{invoice.discount?.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                          <span>Tip</span><span>₹{invoice.tip?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2">
                          <span>Total</span><span>₹{invoice.total?.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-6 text-center">
                        <button onClick={() => window.print()}
                          className="px-6 py-2 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-2 mx-auto">
                          <FiPrinter /> Print Invoice
                        </button>
                      </div>
                    </div>
                  )}
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
