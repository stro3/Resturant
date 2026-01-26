import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const footerLinks = {
  experiences: [
    { name: 'Fine Dining', href: '/experiences/fine-dining' },
    { name: 'Fast Food', href: '/experiences/fast-food' },
    { name: 'Cafe', href: '/experiences/cafe' },
    { name: 'Street Food', href: '/experiences/street-food' },
    { name: 'Cloud Kitchen', href: '/experiences/cloud-kitchen' },
  ],
  quickLinks: [
    { name: 'Menu', href: '/menu' },
    { name: 'Order Online', href: '/order' },
    { name: 'Reserve Table', href: '/reservation' },
    { name: 'Live Kitchen', href: '/live-kitchen' },
    { name: 'Events', href: '/events' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-charcoal/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-cream mb-4">
              Gastronome
            </h3>
            <p className="text-cream/70 mb-6 leading-relaxed">
              From Street Cravings to Fine Dining Excellence. One destination, multiple culinary experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-cream/70 hover:text-accent text-xl transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="text-cream/70 hover:text-accent text-xl transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="text-cream/70 hover:text-accent text-xl transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="text-cream/70 hover:text-accent text-xl transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4">Experiences</h4>
            <ul className="space-y-3">
              {footerLinks.experiences.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-cream/70 hover:text-accent transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-cream font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-cream/70">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                <span>123 Culinary Street, Food District, City 12345</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70">
                <FaPhone className="text-accent flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-cream/70">
                <FaEnvelope className="text-accent flex-shrink-0" />
                <span>hello@gastronome.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/50 text-sm">
            2026 Gastronome. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-cream/50 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-cream/50 hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
