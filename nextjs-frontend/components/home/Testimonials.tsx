'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Food Critic, NY Times',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rating: 5,
    text: "Gastronome has redefined fine dining in New York. The attention to detail in every dish is remarkable. Chef Marco's truffle risotto is simply divine - I've never tasted anything quite like it.",
    date: 'December 2025'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Executive, Goldman Sachs',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 5,
    text: "We host all our important client dinners here. The private dining room is exquisite, and the staff always goes above and beyond. The wine pairing with the tasting menu was exceptional.",
    date: 'January 2026'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Travel Blogger',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    text: "Out of all the restaurants I've visited across 50 countries, Gastronome stands out. The ambiance, the service, the food - everything is world-class. A must-visit when in NYC!",
    date: 'November 2025'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Michelin Guide Inspector',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    rating: 5,
    text: "The culinary techniques displayed here rival the best restaurants in Paris. The seasonal menu showcases incredible creativity while honoring traditional flavors. Truly deserving of its stars.",
    date: 'October 2025'
  }
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return
    let timer: NodeJS.Timeout

    const startTimer = () => {
      timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length)
      }, 5000)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(timer)
      } else {
        startTimer()
      }
    }

    startTimer()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [autoPlay])

  const next = () => {
    setAutoPlay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setAutoPlay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-gradient-to-b from-charcoal to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-burgundy rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-amber-400 font-medium tracking-widest uppercase mb-4">
            What People Say
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
            Guest Experiences
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Don't just take our word for it - hear from our valued guests
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10"
            >
              <FaQuoteLeft className="text-4xl text-amber-400/30 mb-6" />
              
              <p className="text-white/90 text-xl md:text-2xl leading-relaxed mb-8 font-light">
                "{testimonials[current].text}"
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonials[current].avatar}
                    alt={testimonials[current].name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonials[current].name}</h4>
                    <p className="text-white/60 text-sm">{testimonials[current].role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <FaStar key={i} className="text-amber-400" />
                    ))}
                  </div>
                  <span className="text-white/40 text-sm">{testimonials[current].date}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <FaChevronLeft />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoPlay(false)
                    setCurrent(idx)
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === current ? 'bg-amber-400 w-8' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { value: '50K+', label: 'Happy Guests' },
            { value: '4.9', label: 'Average Rating' },
            { value: '15+', label: 'Years of Excellence' },
            { value: '3', label: 'Michelin Stars' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500 mb-2">
                {stat.value}
              </p>
              <p className="text-white/60">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
