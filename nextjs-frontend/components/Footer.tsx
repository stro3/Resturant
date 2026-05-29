import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUtensils, FaStar, FaClock } from 'react-icons/fa'

const footerLinks = {
  menu: [
    { name: 'Appetizers', href: '/menu#appetizers' },
    { name: 'Main Course', href: '/menu#main' },
    { name: 'Desserts', href: '/menu#desserts' },
    { name: 'Beverages', href: '/menu#drinks' },
    { name: "Chef's Special", href: '/menu#special' },
  ],
  quickLinks: [
    { name: 'Menu', href: '/menu' },
    { name: 'Order Online', href: '/order' },
    { name: 'Reservations', href: '/reservation' },
    { name: 'Gift Cards', href: '/gift-cards' },
    { name: 'Catering', href: '/catering' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a1a1a] to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-500 p-3 rounded-xl">
                <FaUtensils className="text-black text-xl" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl font-bold text-white">Gastronome</h3>
                <span className="text-amber-400 text-xs tracking-widest">FINE DINING</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
              Award-winning cuisine crafted with passion. Experience the art of fine dining in an atmosphere of elegance and warmth.
            </p>
            
            <div className="flex items-center gap-2 mb-4">
              {[1,2,3,4,5].map((star) => (
                <FaStar key={star} className="text-amber-400" />
              ))}
              <span className="text-white ml-2 font-medium">4.9</span>
              <span className="text-gray-500 text-sm">(2,847 reviews)</span>
            </div>
            
            <div className="flex gap-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all">
                <FaFacebook className="text-white" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all">
                <FaInstagram className="text-white" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all">
                <FaTwitter className="text-white" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all">
                <FaLinkedin className="text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Menu</h4>
            <ul className="space-y-3">
              {footerLinks.menu.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-amber-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-amber-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">350 Fifth Avenue<br />New York, NY 10118</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-amber-400 flex-shrink-0" />
                <a href="tel:+912240001234" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">+91 22 4000 1234</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-amber-400 flex-shrink-0" />
                <a href="mailto:reservations@gastronome.com" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">reservations@gastronome.com</a>
              </li>
              <li className="flex items-start gap-3">
                <FaClock className="text-amber-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>Mon-Thu: 5PM - 10PM</p>
                  <p>Fri-Sat: 5PM - 11PM</p>
                  <p>Sun: 4PM - 9PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Gastronome Restaurant. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-gray-500 hover:text-amber-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
