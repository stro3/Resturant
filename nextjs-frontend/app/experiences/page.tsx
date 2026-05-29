'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaHamburger, FaCoffee, FaWineGlassAlt, FaPizzaSlice, FaBox, FaClock, FaStar, FaUsers } from 'react-icons/fa'

const experiences = [
  {
    id: 'fine-dining',
    name: 'Fine Dining',
    tagline: 'Luxury Culinary Art',
    description: 'Experience the pinnacle of gastronomy with our award-winning fine dining restaurant. Each dish is a masterpiece crafted by our Michelin-trained chefs using the finest ingredients from around the world.',
    icon: FaWineGlassAlt,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    features: ['5-Course Tasting Menu', 'Sommelier Wine Pairing', 'Private Dining Rooms', 'Chef\'s Table Experience'],
    priceRange: '₹ ₹',
    timing: '6:00 PM - 11:00 PM',
    rating: 4.9,
    reviews: 847
  },
  {
    id: 'fast-food',
    name: 'Fast Food',
    tagline: 'Quick Bites, Bold Flavors',
    description: 'Craving something delicious in a hurry? Our fast food section delivers premium quality burgers, fries, and more - made fresh to order with the same quality standards as our fine dining.',
    icon: FaHamburger,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    features: ['Gourmet Burgers', 'Hand-Cut Fries', 'Craft Shakes', 'Express Service'],
    priceRange: '₹',
    timing: '11:00 AM - 11:00 PM',
    rating: 4.7,
    reviews: 2341
  },
  {
    id: 'cafe',
    name: 'Café & Bakery',
    tagline: 'Coffee & Sweet Delights',
    description: 'A cozy retreat for coffee lovers and pastry enthusiasts. Our café features artisan coffee, freshly baked goods, and a warm ambiance perfect for work or relaxation.',
    icon: FaCoffee,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    features: ['Single Origin Coffee', 'Fresh Pastries', 'Artisan Sandwiches', 'Free WiFi'],
    priceRange: '₹₹',
    timing: '7:00 AM - 9:00 PM',
    rating: 4.8,
    reviews: 1562
  },
  {
    id: 'street-food',
    name: 'Street Food',
    tagline: 'Authentic Local Flavors',
    description: 'Travel the world through taste with our authentic street food corner. From Asian noodles to Mexican tacos, experience global street cuisine prepared with traditional recipes.',
    icon: FaPizzaSlice,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    features: ['Global Cuisines', 'Traditional Recipes', 'Live Cooking', 'Vegetarian Options'],
    priceRange: '₹',
    timing: '12:00 PM - 10:00 PM',
    rating: 4.6,
    reviews: 1893
  },
  {
    id: 'cloud-kitchen',
    name: 'Cloud Kitchen',
    tagline: 'Delivery Exclusive',
    description: 'Our delivery-only kitchen brings restaurant-quality meals to your doorstep. Specially designed menu optimized for delivery without compromising on taste or presentation.',
    icon: FaBox,
    image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800',
    features: ['30-Min Delivery', 'Eco-Friendly Packaging', 'Family Packs', 'Late Night Menu'],
    priceRange: '₹₹',
    timing: '10:00 AM - 2:00 AM',
    rating: 4.5,
    reviews: 3214
  }
]

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-burgundy font-medium tracking-widest uppercase mb-4"
          >
            Discover Our World
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6"
          >
            Five Unique Experiences
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-charcoal/70 text-lg max-w-3xl mx-auto"
          >
            One destination, endless possibilities. Choose your culinary adventure from our five distinct dining concepts, each crafted to deliver an unforgettable experience.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={exp.image}
                      alt={exp.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-burgundy text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {exp.priceRange}
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <exp.icon className="text-burgundy text-3xl" />
                    <span className="text-burgundy font-medium">{exp.tagline}</span>
                  </div>
                  <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">{exp.name}</h2>
                  <p className="text-charcoal/70 text-lg mb-6 leading-relaxed">{exp.description}</p>

                  <div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-accent" />
                      <span className="font-semibold">{exp.rating}</span>
                      <span className="text-charcoal/60">({exp.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/60">
                      <FaClock />
                      <span>{exp.timing}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {exp.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-charcoal/80">
                        <div className="w-2 h-2 bg-burgundy rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href={`/menu?experience=${exp.id}`}
                      className="bg-burgundy hover:bg-primary text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md"
                    >
                      View Menu
                    </Link>
                    <Link
                      href="/reservation"
                      className="border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white px-6 py-3 rounded-full font-semibold transition-all"
                    >
                      Reserve Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
