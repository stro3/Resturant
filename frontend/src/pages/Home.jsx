import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Experience Culinary Excellence</h1>
          <p>Where authentic flavors meet exceptional service</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary">View Menu</Link>
            <Link to="/reservation" className="btn btn-secondary">Book a Table</Link>
            <Link to="/order" className="btn btn-secondary">Order Online</Link>
          </div>
        </motion.div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="grid grid-3">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">🍽️</div>
              <h3>Premium Quality</h3>
              <p>Fresh ingredients sourced daily from local farms</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">👨‍🍳</div>
              <h3>Expert Chefs</h3>
              <p>Award-winning culinary team with decades of experience</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">🎭</div>
              <h3>Unique Ambiance</h3>
              <p>Perfect atmosphere for every occasion</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>Founded in 2010, our restaurant has been serving authentic cuisine with passion and dedication. We believe in creating memorable dining experiences through exceptional food, warm hospitality, and a commitment to quality.</p>
              <p>Every dish tells a story of tradition, innovation, and the finest ingredients carefully selected by our culinary team.</p>
              <Link to="/about" className="btn btn-primary">Learn More</Link>
            </div>
            <div className="story-image">
              <div className="placeholder-image">Restaurant Interior</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Experience Something Special?</h2>
          <p>Reserve your table today and embark on a culinary journey</p>
          <Link to="/reservation" className="btn btn-primary">Make Reservation</Link>
        </div>
      </section>
    </div>
  )
}

export default Home
