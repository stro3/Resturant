'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTag, FaPercent, FaTruck, FaClock, FaCheckCircle, FaTimesCircle, FaGift } from 'react-icons/fa'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface PromoCode {
  code: string
  type: string
  value: number
  description: string
  min_order: number
  valid_until: string
  active: boolean
}

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [validateCode, setValidateCode] = useState('')
  const [validateAmount, setValidateAmount] = useState('')
  const [validationResult, setValidationResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const res = await fetch(`${API}/api/promo-codes`)
      const data = await res.json()
      setPromoCodes(data.promo_codes || [])
    } catch (err) {
      console.error('Failed to fetch promo codes')
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async () => {
    if (!validateCode || !validateAmount) return
    try {
      const res = await fetch(`${API}/api/promo-codes/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: validateCode, order_total: parseFloat(validateAmount) })
      })
      const data = await res.json()
      setValidationResult(data)
    } catch {
      setValidationResult({ valid: false, error: 'Failed to validate' })
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <FaPercent />
      case 'free_shipping': return <FaTruck />
      case 'fixed': return <FaTag />
      default: return <FaGift />
    }
  }

  const getGradient = (type: string) => {
    switch (type) {
      case 'percentage': return 'from-amber-500 to-orange-500'
      case 'free_shipping': return 'from-emerald-500 to-teal-500'
      case 'fixed': return 'from-purple-500 to-pink-500'
      default: return 'from-blue-500 to-indigo-500'
    }
  }

  const formatValue = (promo: PromoCode) => {
    switch (promo.type) {
      case 'percentage': return `${promo.value}% OFF`
      case 'free_shipping': return 'FREE SHIPPING'
      case 'fixed': return `₹${promo.value} OFF`
      default: return `${promo.value}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4 text-sm font-medium">
            <FaTag /> Special Offers
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Promo Codes & Deals
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Use these exclusive promo codes to save on your next order. Apply at checkout for instant savings!
          </p>
        </motion.div>

        {/* Active Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {promoCodes.filter(p => p.active).map((promo, i) => (
            <motion.div
              key={promo.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`bg-gradient-to-r ${getGradient(promo.type)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl opacity-80">{getIcon(promo.type)}</span>
                  {promo.active ? (
                    <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">Active</span>
                  ) : (
                    <span className="bg-red-500/30 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">Expired</span>
                  )}
                </div>
                <div className="text-3xl font-bold mb-1">{formatValue(promo)}</div>
                <p className="text-white/80 text-sm">{promo.description}</p>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg px-4 py-2">
                    <code className="text-lg font-mono font-bold text-charcoal tracking-wider">{promo.code}</code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(promo.code)
                    }}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Min. order: ₹{promo.min_order}</span>
                  <span className="flex items-center gap-1">
                    <FaClock /> Valid until {new Date(promo.valid_until).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Validate Promo Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="font-playfair text-2xl font-bold text-charcoal mb-2 text-center">
              Validate a Promo Code
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              Check if your promo code is valid and see how much you'll save
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Promo Code</label>
                <input
                  type="text"
                  value={validateCode}
                  onChange={(e) => setValidateCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME20"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-lg tracking-wider uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Order Total (₹)</label>
                <input
                  type="number"
                  value={validateAmount}
                  onChange={(e) => setValidateAmount(e.target.value)}
                  placeholder="50.00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handleValidate}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold py-3 rounded-xl transition-all shadow-lg"
              >
                Validate Code
              </button>
            </div>

            {validationResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-6 p-4 rounded-xl ${
                  validationResult.valid
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                {validationResult.valid ? (
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-700">Code is valid!</p>
                      <p className="text-sm text-green-600">
                        Discount: ₹{validationResult.discount?.toFixed(2)} — 
                        Final Total: ₹{validationResult.final_total?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <FaTimesCircle className="text-red-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-700">Invalid Code</p>
                      <p className="text-sm text-red-600">{validationResult.error}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* How to Use */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h3 className="font-playfair text-2xl font-bold text-charcoal mb-8">How to Use Promo Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '1', title: 'Copy Code', desc: 'Click copy on any active promo above' },
              { step: '2', title: 'Place Order', desc: 'Add your favorite items to the cart' },
              { step: '3', title: 'Apply & Save', desc: 'Paste the code at checkout for instant discount' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-charcoal mb-1">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
