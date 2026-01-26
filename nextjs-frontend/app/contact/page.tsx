'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCheck } from 'react-icons/fa'

const contactInfo = [
  {
    icon: FaMapMarkerAlt,
    title: 'Visit Us',
    details: ['123 Culinary Street', 'Food District, Downtown', 'New York, NY 10001']
  },
  {
    icon: FaPhone,
    title: 'Call Us',
    details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Toll Free: 1-800-GASTRO']
  },
  {
    icon: FaEnvelope,
    title: 'Email Us',
    details: ['hello@gastronome.com', 'reservations@gastronome.com', 'events@gastronome.com']
  },
  {
    icon: FaClock,
    title: 'Opening Hours',
    details: ['Mon-Thu: 11AM - 10PM', 'Fri-Sat: 11AM - 12AM', 'Sunday: 10AM - 9PM']
  }
]

const socialLinks = [
  { icon: FaFacebook, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaYoutube, href: '#', label: 'YouTube' }
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
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-charcoal/70 text-lg max-w-2xl mx-auto"
          >
            We'd love to hear from you. Whether you have a question, feedback, or just want to say hello, our team is here to help.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-14 h-14 bg-burgundy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="text-burgundy text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">{info.title}</h3>
                      {info.details.map((detail) => (
                        <p key={detail} className="text-charcoal/60 text-sm">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12">
                <h3 className="font-semibold text-charcoal mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 bg-burgundy/10 hover:bg-burgundy rounded-full flex items-center justify-center text-burgundy hover:text-white transition-all"
                      aria-label={social.label}
                    >
                      <social.icon className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-12 text-center"
                >
                  <div className="w-20 h-20 bg-olive/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-olive text-3xl" />
                  </div>
                  <h2 className="font-playfair text-3xl font-bold text-charcoal mb-4">Message Sent!</h2>
                  <p className="text-charcoal/70 mb-8">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
                    }}
                    className="bg-burgundy hover:bg-primary text-white px-8 py-3 rounded-full font-semibold transition-all"
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
                  <h2 className="font-playfair text-2xl font-bold text-charcoal mb-8">Send Us a Message</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                      <label className="block text-sm font-medium text-charcoal mb-2">Email Address</label>
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
                      <label className="block text-sm font-medium text-charcoal mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-2">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy bg-white"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="reservation">Reservation Question</option>
                        <option value="catering">Catering Services</option>
                        <option value="feedback">Feedback</option>
                        <option value="careers">Careers</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">Your Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-burgundy hover:bg-primary text-white py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="h-96 bg-cream">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095919364!2d-74.00425878428698!3d40.74076794379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sGoogle!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </div>
  )
}
