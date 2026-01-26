import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { reservationAPI } from '../services/api'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import './Reservation.css'

function Reservation() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await reservationAPI.create(data)
      toast.success('Reservation confirmed! We will contact you shortly.')
      reset()
    } catch (error) {
      toast.error('Reservation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <div className="reservation-page">
      <section className="reservation-header">
        <h1>Reserve a Table</h1>
        <p>Book your dining experience with us</p>
      </section>

      <div className="container">
        <div className="reservation-content">
          <div className="reservation-info">
            <h2>Why Reserve?</h2>
            <p>Guarantee your preferred time and seating by making a reservation. Our team will ensure everything is prepared for your arrival.</p>
            
            <div className="info-points">
              <div className="info-point">
                <h3>Priority Seating</h3>
                <p>Skip the wait and get seated immediately upon arrival</p>
              </div>
              <div className="info-point">
                <h3>Special Requests</h3>
                <p>Let us know about dietary restrictions or special occasions</p>
              </div>
              <div className="info-point">
                <h3>Confirmed Availability</h3>
                <p>Receive instant confirmation for your selected date and time</p>
              </div>
            </div>

            <div className="contact-box">
              <h3>Need to modify your reservation?</h3>
              <p>Call us at +1 (555) 123-4567</p>
            </div>
          </div>

          <div className="reservation-form-container">
            <form onSubmit={handleSubmit(onSubmit)} className="reservation-form">
              <h2>Reservation Details</h2>

              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  className={errors.name ? 'error-input' : ''}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className={errors.email ? 'error-input' : ''}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  {...register('phone', { required: 'Phone is required' })}
                  className={errors.phone ? 'error-input' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone.message}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    min={today}
                    {...register('date', { required: 'Date is required' })}
                    className={errors.date ? 'error-input' : ''}
                  />
                  {errors.date && <span className="error-message">{errors.date.message}</span>}
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <select 
                    {...register('time', { required: 'Time is required' })}
                    className={errors.time ? 'error-input' : ''}
                  >
                    <option value="">Select time</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                  {errors.time && <span className="error-message">{errors.time.message}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Number of Guests</label>
                <select 
                  {...register('guests', { required: 'Number of guests is required' })}
                  className={errors.guests ? 'error-input' : ''}
                >
                  <option value="">Select guests</option>
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value="9+">9+ Guests</option>
                </select>
                {errors.guests && <span className="error-message">{errors.guests.message}</span>}
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea 
                  rows="4"
                  {...register('special_requests')}
                  placeholder="Dietary restrictions, allergies, occasion, seating preference..."
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservation
