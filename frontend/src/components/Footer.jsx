import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-section">
          <h3>Restaurant</h3>
          <p>Experience culinary excellence with authentic flavors and exceptional service.</p>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/reservation">Reservations</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Hours</h4>
          <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
          <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p><FaPhone /> +1 (555) 123-4567</p>
          <p><FaEnvelope /> info@restaurant.com</p>
          <p><FaMapMarkerAlt /> 123 Main Street, City</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Restaurant. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
