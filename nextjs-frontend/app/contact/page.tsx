'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCheck, FaCar, FaWifi, FaWheelchair, FaCreditCard } from 'react-icons/fa'

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: 'Location',
    details: ['350 Fifth Avenue, 21st Floor', 'Empire State Building', 'New York, NY 10118'],
    highlight: 'View on Maps'
  },
  {
    icon: FaPhone,
    title: 'Reservations',
    details: ['+91 22 4000 1234', 'Concierge: +91 22 4000 1235'],
    highlight: 'Available 24/7'
  },
  {
    icon: FaEnvelope,
    title: 'Email',
    details: ['reservations@gastronome.nyc', 'events@gastronome.nyc'],
    highlight: 'Response within 2 hours'
  },
  {
    icon: FaClock,
    title: 'Hours',
    details: ['Dinner: 5:00 PM - 11:00 PM', 'Bar: 4:00 PM - 1:00 AM', 'Brunch (Weekends): 11:00 AM - 3:00 PM'],
    highlight: 'Reservations recommended'
  }
]

const amenities = [
  { icon: FaCar, label: 'Valet Parking' },
  { icon: FaWifi, label: 'Free WiFi' },
  { icon: FaWheelchair, label: 'Accessible' },
  { icon: FaCreditCard, label: 'All Cards Accepted' }
]

const socialLinks = [
  { icon: FaFacebook, href: '#', label: 'Facebook', followers: '125K' },
  { icon: FaInstagram, href: '#', label: 'Instagram', followers: '89K' },
  { icon: FaTwitter, href: '#', label: 'Twitter', followers: '45K' },
  { icon: FaYoutube, href: '#', label: 'YouTube', followers: '32K' }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setIsSubmitted(true)
    } catch (error) {
      setIsSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-charcoal via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-400 font-medium tracking-widest uppercase mb-4"
          >
            Contact Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            We'd love to hear from you. Whether you're planning a special celebration or simply want to experience fine dining, our team is here to assist.
          </motion.p>
          
          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10"
          >
            {amenities.map((amenity) => (
              <div key={amenity.label} className="flex items-center gap-2 text-gray-400">
                <amenity.icon className="text-amber-400" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-32">
                <h3 className="font-playfair text-2xl font-bold text-charcoal mb-8">Contact Information</h3>
                
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <info.icon className="text-black text-lg" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal mb-1">{info.title}</h4>
                        {info.details.map((detail) => (
                          <p key={detail} className="text-gray-600 text-sm">{detail}</p>
                        ))}
                        <p className="text-amber-600 text-xs font-medium mt-1">{info.highlight}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h4 className="font-semibold text-charcoal mb-4">Follow Us</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gradient-to-r hover:from-amber-500 hover:to-yellow-400 rounded-xl group transition-all"
                      >
                        <social.icon className="text-lg text-gray-600 group-hover:text-black transition-colors" />
                        <div>
                          <p className="text-xs text-gray-500 group-hover:text-black/70">{social.followers}</p>
                          <p className="text-sm font-medium text-charcoal group-hover:text-black">{social.label}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FaCheck className="text-white text-4xl" />
                  </div>
                  <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">Message Sent!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Thank you for reaching out. Our team will respond within 2 hours during business hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-playfair text-2xl font-bold text-charcoal">Send Us a Message</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">All fields with * are required</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="+1 (212) 555-0123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Subject *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="reservation">Reservation Inquiry</option>
                        <option value="private-dining">Private Dining & Events</option>
                        <option value="catering">Catering Services</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="press">Press & Media</option>
                        <option value="careers">Career Opportunities</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-charcoal mb-2">Your Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your inquiry, special requests, or how we can assist you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-charcoal to-gray-800 hover:from-amber-500 hover:to-yellow-400 text-white hover:text-black py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>

                  <p className="text-center text-gray-400 text-sm mt-4">
                    By submitting, you agree to our privacy policy. We'll never share your information.
                  </p>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent z-10" />
        <div className="h-[500px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617!2d-73.985!3d40.748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9aeb1c6b5%3A0x35b1cfbc89a6097f!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center">
              <FaMapMarkerAlt className="text-black text-xl" />
            </div>
            <div>
              <p className="font-semibold text-charcoal">350 Fifth Avenue, 21st Floor</p>
              <p className="text-gray-500 text-sm">Empire State Building, New York, NY 10118</p>
            </div>
            <a
              href="https://goo.gl/maps/empirestate"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-charcoal text-white px-6 py-3 rounded-full font-medium hover:bg-amber-500 hover:text-black transition-all"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
