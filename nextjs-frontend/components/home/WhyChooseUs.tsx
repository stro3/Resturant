'use client'

import { motion } from 'framer-motion'
import { FaLeaf, FaAward, FaClock, FaHeart, FaShieldAlt, FaTruck } from 'react-icons/fa'

const features = [
  {
    icon: FaLeaf,
    title: 'Farm Fresh',
    description: 'Locally sourced ingredients from trusted organic farms'
  },
  {
    icon: FaAward,
    title: 'Award Winning',
    description: 'Recognized by top culinary critics and food magazines'
  },
  {
    icon: FaClock,
    title: 'Quick Service',
    description: 'Efficient service without compromising quality'
  },
  {
    icon: FaHeart,
    title: 'Made with Love',
    description: 'Every dish prepared with passion and dedication'
  },
  {
    icon: FaShieldAlt,
    title: 'Hygiene First',
    description: 'Strict safety protocols and clean kitchen practices'
  },
  {
    icon: FaTruck,
    title: 'Fast Delivery',
    description: 'Hot food delivered to your doorstep in minutes'
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-burgundy font-medium tracking-widest uppercase mb-4">
              Why Choose Us
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
              A Commitment to Excellence
            </h2>
            <p className="text-charcoal/70 text-lg mb-8 leading-relaxed">
              We believe in creating memorable dining experiences through exceptional food, 
              warm hospitality, and an unwavering commitment to quality. Every dish tells 
              a story of passion, tradition, and innovation.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              {features.slice(0, 4).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="bg-burgundy/10 p-3 rounded-lg">
                    <feature.icon className="text-burgundy text-xl" />
                  </div>
                  <div>
                    <h3 className="text-charcoal font-semibold mb-1">{feature.title}</h3>
                    <p className="text-charcoal/60 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy/30 to-accent/30 flex items-center justify-center">
                <span className="text-9xl">👨‍🍳</span>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-8 -left-8 bg-burgundy text-white p-6 rounded-2xl"
            >
              <p className="text-4xl font-bold">15+</p>
              <p className="font-medium">Years of Excellence</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-8 -right-8 bg-neutral-800 text-white p-6 rounded-2xl border border-neutral-700"
            >
              <p className="text-4xl font-bold text-amber-500">50K+</p>
              <p className="font-medium">Happy Customers</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
