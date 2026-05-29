'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FaUtensils, FaUser } from 'react-icons/fa'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Reservations', href: '/reservation' },
  { name: 'Order Online', href: '/order' },
  { name: 'Track Order', href: '/track-order' },
  { name: 'Gift Cards', href: '/gift-cards' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const moreLinks = [
  { name: 'Loyalty Rewards', href: '/loyalty' },
  { name: 'Payment', href: '/payment' },
  { name: 'Tables', href: '/tables' },
  { name: 'Promo Codes', href: '/promo-codes' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-2 rounded-lg transition-all bg-burgundy">
              <FaUtensils className="text-xl text-white" />
            </div>
            <div>
              <span className="font-playfair text-2xl font-bold transition-colors text-charcoal">
                Gastronome
              </span>
              <span className="block text-xs tracking-widest transition-colors text-burgundy">
                FINE DINING
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors text-sm font-medium hover:text-amber-500 text-charcoal"
              >
                {link.name}
              </Link>
            ))}
            <div className="relative group">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 200)}
                className="transition-colors text-sm font-medium hover:text-amber-500 text-charcoal flex items-center gap-1"
              >
                More <span className="text-xs">&#9660;</span>
              </button>
              <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-200 py-2 z-50 ${
                moreOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
              }`}>
                {moreLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-charcoal hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              {user ? (
                <Link
                  href={user.role === 'manager' ? '/manager' : user.role === 'employee' ? '/employee' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all bg-gray-100 text-charcoal hover:bg-gray-200"
                >
                  <FaUser className="text-sm" />
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors text-charcoal hover:text-burgundy"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/reservation"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg text-sm"
              >
                Book a Table
              </Link>
            </div>
          </div>

          <button
            className="lg:hidden text-3xl text-charcoal"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-charcoal hover:text-burgundy transition-colors py-2 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">More</p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-charcoal hover:text-burgundy transition-colors py-2 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Link
                  href="/login"
                  className="block text-charcoal hover:text-burgundy text-center py-3 border border-gray-200 rounded-full font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/reservation"
                  className="block bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-center py-3 rounded-full font-semibold shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Book a Table
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
