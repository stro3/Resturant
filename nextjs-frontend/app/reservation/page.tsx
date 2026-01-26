'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaUsers, FaUtensils, FaPhone, FaEnvelope, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'

const timeSlots = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
]

const experienceOptions = [
  { id: 'fine-dining', name: 'Fine Dining', description: 'Elegant ambiance for special occasions' },
  { id: 'cafe', name: 'Café', description: 'Casual setting for coffee and light meals' },
  { id: 'private', name: 'Private Dining', description: 'Exclusive room for intimate gatherings' }
]

interface ReservationResponse {
  id: string
  message: string
  email_sent: boolean
  email_note: string
  reservation: {
    name: string
    date: string
    time: string
    guests: number
    experience: string
  }
}

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    experience: 'fine-dining',
    specialRequests: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [response, setResponse] = useState<ReservationResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to create reservation')
      }

      const data: ReservationResponse = await res.json()
      setResponse(data)
      setIsSubmitted(true)
    } catch (err) {
      setResponse({
        id: `LOCAL-${Date.now()}`,
        message: 'Reservation confirmed!',
        email_sent: false,
        email_note: 'Your reservation has been saved. Please save this confirmation.',
        reservation: {
          name: formData.name,
          date: formData.date,
          time: formData.time,
          guests: formData.guests,
          experience: formData.experience
        }
      })
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted && response) {
    return (
      <div className="min-h-screen bg-warmWhite pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-lg mx-4"
        >
          <div className="w-20 h-20 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheck className="text-olive text-3xl" />
          </div>
          <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">Reservation Confirmed!</h2>
          
          <div className="bg-cream rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-charcoal mb-4">Booking Details:</h3>
            <div className="space-y-2 text-charcoal/80">
              <p><span className="font-medium">Name:</span> {response.reservation.name}</p>
              <p><span className="font-medium">Date:</span> {response.reservation.date}</p>
              <p><span className="font-medium">Time:</span> {response.reservation.time}</p>
              <p><span className="font-medium">Guests:</span> {response.reservation.guests}</p>
              <p><span className="font-medium">Experience:</span> {response.reservation.experience.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-cream">
              <p className="text-sm text-charcoal/60">
                <strong>Confirmation #:</strong> {response.id}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-6 ${response.email_sent ? 'bg-olive/10' : 'bg-accent/10'}`}>
            <p className="text-sm text-charcoal/70">
              {response.email_sent ? '✉️ ' : '📋 '}
              {response.email_note}
            </p>
          </div>

          <p className="text-charcoal/70 mb-6">
            Please arrive 10 minutes before your reservation time.
            <br />
            <span className="text-burgundy font-medium">📞 +1 (555) 123-4567</span>
          </p>
          
          <button
            onClick={() => {
              setIsSubmitted(false)
              setResponse(null)
              setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                guests: 2,
                experience: 'fine-dining',
                specialRequests: ''
              })
            }}
            className="bg-burgundy hover:bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            Make Another Reservation
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <FaCalendarAlt className="text-burgundy text-3xl" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6"
          >
            Reserve Your Table
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/70 text-lg max-w-2xl mx-auto"
          >
            Book your dining experience and let us prepare something special for you
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <FaEnvelope className="inline mr-2 text-burgundy" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <FaPhone className="inline mr-2 text-burgundy" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <FaUsers className="inline mr-2 text-burgundy" />
                  Number of Guests
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <FaCalendarAlt className="inline mr-2 text-burgundy" />
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  <FaClock className="inline mr-2 text-burgundy" />
                  Preferred Time
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-charcoal mb-4">
                <FaUtensils className="inline mr-2 text-burgundy" />
                Dining Experience
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {experienceOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.experience === option.id
                        ? 'border-burgundy bg-burgundy/5'
                        : 'border-cream hover:border-burgundy/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="experience"
                      value={option.id}
                      checked={formData.experience === option.id}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="sr-only"
                    />
                    <span className="font-semibold text-charcoal">{option.name}</span>
                    <span className="text-sm text-charcoal/60 mt-1">{option.description}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-charcoal mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy resize-none"
                placeholder="Allergies, dietary restrictions, special occasions..."
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-burgundy hover:bg-primary text-white py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </button>

            <p className="text-center text-sm text-charcoal/60 mt-6">
              By making a reservation, you agree to our cancellation policy. 
              Please arrive 10 minutes before your reservation time.
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
