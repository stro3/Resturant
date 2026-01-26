'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { FaUtensils } from 'react-icons/fa'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Experiences', href: '/experiences' },
  { name: 'Menu', href: '/menu' },
  { name: 'Order Online', href: '/order' },
  { name: 'Reserve Table', href: '/reservation' },
  { name: 'Live Kitchen', href: '/live-kitchen' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed w-full z-50 bg-warmWhite/95 backdrop-blur-md border-b border-cream shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <FaUtensils className="text-burgundy text-2xl" />
            <span className="font-playfair text-2xl font-bold text-charcoal">
              Gastronome
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-charcoal hover:text-burgundy transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/order"
              className="bg-burgundy hover:bg-primary text-white px-6 py-2 rounded-full font-semibold transition-all shadow-md"
            >
              Order Now
            </Link>
          </div>

          <button
            className="lg:hidden text-charcoal text-3xl"
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
            className="lg:hidden bg-warmWhite border-t border-cream"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-charcoal hover:text-burgundy transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/order"
                className="block bg-burgundy text-white text-center py-3 rounded-full font-semibold mt-4 shadow-md"
                onClick={() => setIsOpen(false)}
              >
                Order Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
