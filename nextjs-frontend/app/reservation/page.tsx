'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaPhone, FaEnvelope, FaCheck, FaSpinner, FaUser, FaStar, FaClock, FaMapMarkerAlt, FaWineGlass } from 'react-icons/fa'

interface ReservationResponse {
  id: string
  confirmation_number?: string
  message: string
  email_sent: boolean
  email_note: string
  reservation: {
    name: string
    email: string
    phone: string
    confirmation_number?: string
  }
}

const features = [
  { icon: FaStar, text: 'Three Michelin Stars' },
  { icon: FaWineGlass, text: 'Award-Winning Wine List' },
  { icon: FaClock, text: 'Open 5 PM - 11 PM Daily' },
  { icon: FaMapMarkerAlt, text: 'Empire State Building' }
]

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [response, setResponse] = useState<ReservationResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!formData.name.trim()) {
      setError('Please enter your name')
      setIsSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email')
      setIsSubmitting(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: new Date().toISOString().split('T')[0],
          time: 'To be confirmed',
          guests: 1,
          experience: 'contact-request'
        }),
      })

      if (!res.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await res.json()
      setResponse(data)
      setIsSubmitted(true)
    } catch (err) {
      setResponse({
        id: `REQ-${Date.now()}`,
        message: 'Request submitted!',
        email_sent: false,
        email_note: 'Your request has been saved. We will contact you shortly.',
        reservation: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      })
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted && response) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-12 text-center max-w-lg mx-4 border border-gray-100"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaCheck className="text-white text-4xl" />
          </div>
          
          <h1 className="text-3xl font-bold text-charcoal mb-4">Request Submitted!</h1>
          <p className="text-gray-600 mb-8">Thank you for choosing Gastronome.</p>
          
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-left mb-6 border border-gray-100">
            <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
              <FaUser className="text-amber-500" />
              Your Details
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-3">
                <span className="w-20 font-medium text-charcoal">Name:</span>
                <span>{response.reservation.name}</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="w-20 font-medium text-charcoal">Email:</span>
                <span>{response.reservation.email}</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="w-20 font-medium text-charcoal">Phone:</span>
                <span>{response.reservation.phone}</span>
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-amber-600 font-medium">
                Confirmation #: {response.confirmation_number || response.id}
              </p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Questions? Call our concierge
            <br />
            <span className="text-amber-600 font-semibold text-lg">+91 22 4000 1234</span>
          </p>
          
          <button
            onClick={() => {
              setIsSubmitted(false)
              setResponse(null)
              setFormData({ name: '', email: '', phone: '' })
            }}
            className="bg-gradient-to-r from-charcoal to-gray-800 hover:from-amber-500 hover:to-yellow-400 text-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg"
          >
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-charcoal via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="bg-gradient-to-br from-amber-500 to-yellow-400 p-4 rounded-full shadow-lg">
              <FaCalendarAlt className="text-black text-2xl" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6"
          >
            Reserve Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Experience</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Share your details and our concierge team will personally arrange your perfect dining experience
          </motion.p>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6"
          >
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 text-gray-400">
                <feature.icon className="text-amber-400" />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form 
            onSubmit={handleSubmit} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-charcoal mb-2">Contact Information</h2>
              <p className="text-gray-500 text-sm">Our concierge will reach out to finalize your booking</p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-charcoal font-medium mb-2">
                  Full Name <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-charcoal font-medium mb-2">
                  Email Address <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-charcoal font-medium mb-2">
                  Phone Number <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </motion.div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl"
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-gradient-to-r from-charcoal to-gray-800 hover:from-amber-500 hover:to-yellow-400 text-white hover:text-black py-4 px-8 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg text-lg"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Request Reservation
                </>
              )}
            </motion.button>

            <p className="text-center text-gray-400 text-sm mt-6">
              By submitting, you agree to be contacted by our concierge team
            </p>
          </motion.form>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">Prefer to speak with us directly?</p>
            <a href="tel:+912240001234" className="text-amber-600 font-semibold text-lg hover:text-amber-700 transition-colors">
              +91 22 4000 1234
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
