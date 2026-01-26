import React, { useState } from 'react'
import { aiAPI, menuAPI } from '../services/api'
import { toast } from 'react-toastify'
import './AIRecommendation.css'

function AIRecommendation() {
  const [formData, setFormData] = useState({
    mood: 'neutral',
    spice: 'medium',
    dietary: []
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const handleDietaryChange = (option) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }))
  }

  const getRecommendations = async () => {
    setLoading(true)
    try {
      const response = await aiAPI.getRecommendation(formData)
      setRecommendations(response.data.recommendations)
      if (response.data.recommendations.length === 0) {
        toast.info('No recommendations found. Try different filters.')
      }
    } catch (error) {
      toast.error('Failed to get recommendations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-recommendation-widget">
      <h2>What Should I Eat Today?</h2>
      <p>Let our AI suggest the perfect dish for you</p>

      <div className="recommendation-form">
        <div className="form-section">
          <label>How are you feeling?</label>
          <div className="mood-buttons">
            {['adventurous', 'comfort', 'healthy', 'neutral'].map(mood => (
              <button
                key={mood}
                className={formData.mood === mood ? 'mood-btn active' : 'mood-btn'}
                onClick={() => setFormData({...formData, mood})}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label>Spice Level</label>
          <div className="spice-slider">
            <button
              className={formData.spice === 'mild' ? 'spice-btn active' : 'spice-btn'}
              onClick={() => setFormData({...formData, spice: 'mild'})}
            >
              Mild
            </button>
            <button
              className={formData.spice === 'medium' ? 'spice-btn active' : 'spice-btn'}
              onClick={() => setFormData({...formData, spice: 'medium'})}
            >
              Medium
            </button>
            <button
              className={formData.spice === 'hot' ? 'spice-btn active' : 'spice-btn'}
              onClick={() => setFormData({...formData, spice: 'hot'})}
            >
              Hot
            </button>
          </div>
        </div>

        <div className="form-section">
          <label>Dietary Preferences</label>
          <div className="dietary-checkboxes">
            {['vegetarian', 'vegan', 'gluten-free'].map(option => (
              <label key={option} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.dietary.includes(option)}
                  onChange={() => handleDietaryChange(option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button 
          className="btn btn-primary recommend-btn"
          onClick={getRecommendations}
          disabled={loading}
        >
          {loading ? 'Finding...' : 'Get Recommendations'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations-result">
          <h3>We Recommend</h3>
          <div className="recommended-items">
            {recommendations.map(item => (
              <div key={item._id} className="recommended-item">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="rec-price">${item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AIRecommendation
