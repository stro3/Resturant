import React from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import './Contact.css'

function Contact() {
  return (
    <div className="contact-page">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>We would love to hear from you</p>
      </section>

      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>Have questions or feedback? Reach out to us through any of the channels below.</p>

            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
                <p>+1 (555) 123-4568</p>
              </div>
            </div>

            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3>Email</h3>
                <p>info@restaurant.com</p>
                <p>reservations@restaurant.com</p>
              </div>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h3>Location</h3>
                <p>123 Main Street</p>
                <p>Downtown City, ST 12345</p>
              </div>
            </div>

            <div className="contact-item">
              <FaClock className="contact-icon" />
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          <div className="map-container">
            <div className="placeholder-map">
              Google Maps Integration
            </div>
          </div>
        </div>

        <div className="whatsapp-section">
          <h2>Quick Connect</h2>
          <p>For immediate assistance, connect with us on WhatsApp</p>
          <button className="btn btn-primary">Chat on WhatsApp</button>
        </div>
      </div>
    </div>
  )
}

export default Contact
