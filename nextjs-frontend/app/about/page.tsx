'use client'

import { motion } from 'framer-motion'
import { FaHeart, FaLeaf, FaUsers, FaAward, FaQuoteLeft } from 'react-icons/fa'

const stats = [
  { number: '15+', label: 'Years of Excellence' },
  { number: '50K+', label: 'Happy Customers' },
  { number: '200+', label: 'Menu Items' },
  { number: '5', label: 'Dining Experiences' }
]

const values = [
  {
    icon: FaHeart,
    title: 'Passion for Food',
    description: 'Every dish is crafted with love and dedication, reflecting our deep passion for culinary excellence.'
  },
  {
    icon: FaLeaf,
    title: 'Sustainability',
    description: 'We source locally, reduce waste, and use eco-friendly packaging to minimize our environmental footprint.'
  },
  {
    icon: FaUsers,
    title: 'Community First',
    description: 'We support local farmers, provide fair employment, and give back to our community through various initiatives.'
  },
  {
    icon: FaAward,
    title: 'Quality Standards',
    description: 'From ingredient selection to presentation, we maintain uncompromising quality at every step.'
  }
]

const timeline = [
  { year: '2010', title: 'The Beginning', description: 'Started as a small family café with 20 seats and big dreams.' },
  { year: '2013', title: 'First Expansion', description: 'Opened our fine dining section after receiving critical acclaim.' },
  { year: '2016', title: 'Going Multi-Experience', description: 'Introduced fast food and street food concepts under one roof.' },
  { year: '2019', title: 'Digital Innovation', description: 'Launched cloud kitchen and live kitchen streaming technology.' },
  { year: '2023', title: 'Award Recognition', description: 'Named "Best Multi-Cuisine Restaurant" by Food & Dining Magazine.' },
  { year: '2026', title: 'Today', description: 'Serving 500+ customers daily across 5 unique dining experiences.' }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warmWhite pt-24">
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-burgundy font-medium tracking-widest uppercase mb-4">Our Story</p>
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-charcoal mb-6">
                A Legacy of Flavor & Love
              </h1>
              <p className="text-charcoal/70 text-lg leading-relaxed mb-6">
                Gastronome began in 2010 as a humble family café, born from a simple belief: great food brings people together. What started with grandmother's recipes and a passion for hospitality has evolved into a multi-experience culinary destination.
              </p>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Today, we're proud to offer five distinct dining experiences under one roof - from the elegance of fine dining to the comfort of street food favorites. Our journey is a testament to the power of dreams, dedication, and the universal language of delicious food.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                alt="Restaurant Interior"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-burgundy text-white p-6 rounded-xl shadow-xl">
                <p className="font-playfair text-4xl font-bold">Since</p>
                <p className="font-playfair text-5xl font-bold">2010</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="font-playfair text-5xl md:text-6xl font-bold text-cream mb-2">{stat.number}</p>
                <p className="text-cream/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-warmWhite">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Our Values</h2>
            <p className="text-charcoal/70 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-burgundy text-2xl" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">{value.title}</h3>
                <p className="text-charcoal/60">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-charcoal mb-4">Our Journey</h2>
            <p className="text-charcoal/70">From a small café to a culinary destination</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-burgundy/20" />
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-2'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <span className="text-burgundy font-bold text-lg">{item.year}</span>
                    <h3 className="font-playfair text-xl font-bold text-charcoal mt-1">{item.title}</h3>
                    <p className="text-charcoal/60 mt-2">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-burgundy rounded-full border-4 border-cream" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaQuoteLeft className="text-burgundy text-4xl mx-auto mb-8" />
          <blockquote className="font-playfair text-3xl md:text-4xl text-cream italic leading-relaxed mb-8">
            "Food is not just about sustenance; it's about creating memories, bringing families together, and celebrating life's beautiful moments."
          </blockquote>
          <div>
            <p className="text-cream font-semibold text-lg">Giovanni Gastronome</p>
            <p className="text-cream/60">Founder & Master Chef</p>
          </div>
        </div>
      </section>
    </div>
  )
}
