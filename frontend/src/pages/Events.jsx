import React, { useState, useEffect } from 'react'
import { eventAPI, newsletterAPI } from '../services/api'
import { toast } from 'react-toastify'
import { FaCalendar, FaClock } from 'react-icons/fa'
import './Events.css'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll()
      setEvents(response.data)
    } catch (error) {
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    setSubscribing(true)
    try {
      await newsletterAPI.subscribe(email)
      toast.success('Successfully subscribed to newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Subscription failed')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) return <div className="loading">Loading events...</div>

  return (
    <div className="events-page">
      <section className="events-header">
        <h1>Events & Offers</h1>
        <p>Stay updated with our special events and exclusive offers</p>
      </section>

      <div className="container">
        <section className="upcoming-events">
          <h2 className="section-title">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="no-events">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <div className="events-grid grid grid-2">
              {events.map(event => (
                <div key={event._id} className="event-card card">
                  <div className="event-image placeholder-image">
                    {event.title}
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span><FaCalendar /> {new Date(event.date).toLocaleDateString()}</span>
                      <span><FaClock /> {event.time}</span>
                    </div>
                    <p>{event.description}</p>
                    <button className="btn btn-primary">Reserve Spot</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="special-offers">
          <h2 className="section-title">Special Offers</h2>
          <div className="offers-grid grid grid-3">
            <div className="offer-card">
              <h3>Happy Hour</h3>
              <p className="offer-time">Daily 5:00 PM - 7:00 PM</p>
              <p className="offer-description">50% off on all beverages</p>
              <span className="offer-badge">Limited Time</span>
            </div>

            <div className="offer-card">
              <h3>Weekend Brunch</h3>
              <p className="offer-time">Saturday & Sunday 10:00 AM - 2:00 PM</p>
              <p className="offer-description">Special brunch menu with complimentary mimosas</p>
              <span className="offer-badge">New</span>
            </div>

            <div className="offer-card">
              <h3>Birthday Special</h3>
              <p className="offer-time">Any Day</p>
              <p className="offer-description">Complimentary dessert for birthday celebrations</p>
              <span className="offer-badge">Popular</span>
            </div>
          </div>
        </section>

        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Stay in the Loop</h2>
            <p>Subscribe to our newsletter for exclusive offers, event updates, and culinary news</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={subscribing}>
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </section>

        <section className="loyalty-program">
          <h2 className="section-title">Loyalty Program</h2>
          <div className="loyalty-info">
            <p className="loyalty-description">Join our loyalty program and earn points with every order. Redeem points for free dishes, exclusive discounts, and special perks.</p>
            <div className="loyalty-benefits grid grid-3">
              <div className="benefit-item">
                <h3>Earn Points</h3>
                <p>1 point for every $1 spent</p>
              </div>
              <div className="benefit-item">
                <h3>Exclusive Rewards</h3>
                <p>Redeem for free items and discounts</p>
              </div>
              <div className="benefit-item">
                <h3>Birthday Bonus</h3>
                <p>Double points on your birthday month</p>
              </div>
            </div>
            <button className="btn btn-primary join-btn">Join Now</button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Events
