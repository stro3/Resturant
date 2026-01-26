import React, { useState, useEffect } from 'react'
import { reviewAPI } from '../services/api'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FaStar } from 'react-icons/fa'
import './Reviews.css'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getAll()
      setReviews(response.data.filter(r => r.approved))
    } catch (error) {
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    const reviewData = {
      ...data,
      rating,
      date: new Date().toISOString()
    }

    try {
      await reviewAPI.create(reviewData)
      toast.success('Review submitted! It will appear after approval.')
      reset()
      setRating(0)
      setShowForm(false)
    } catch (error) {
      toast.error('Failed to submit review')
    }
  }

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index}
        className={index < count ? 'star filled' : 'star'}
      />
    ))
  }

  if (loading) return <div className="loading">Loading reviews...</div>

  return (
    <div className="reviews-page">
      <section className="reviews-header">
        <h1>Customer Reviews</h1>
        <p>What our guests say about us</p>
      </section>

      <div className="container">
        <div className="reviews-stats">
          <div className="stat-card">
            <h3>{reviews.length}+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3>4.8</h3>
            <p>Average Rating</p>
          </div>
          <div className="stat-card">
            <h3>98%</h3>
            <p>Would Recommend</p>
          </div>
        </div>

        <div className="write-review-section">
          {!showForm ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Write a Review
            </button>
          ) : (
            <div className="review-form-container">
              <h2>Share Your Experience</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="review-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => {
                      const ratingValue = index + 1
                      return (
                        <FaStar
                          key={index}
                          className={ratingValue <= (hover || rating) ? 'star filled clickable' : 'star clickable'}
                          onClick={() => setRating(ratingValue)}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea 
                    rows="5"
                    {...register('comment', { required: 'Review is required' })}
                  />
                  {errors.comment && <span className="error-message">{errors.comment.message}</span>}
                </div>

                <div className="form-buttons">
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false)
                      reset()
                      setRating(0)
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="reviews-list">
          <h2>Recent Reviews</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="grid grid-2">
              {reviews.map(review => (
                <div key={review._id} className="review-card card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h3>{review.name}</h3>
                      <div className="review-stars">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reviews
