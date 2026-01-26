import React, { useState } from 'react'
import AIRecommendation from '../components/AIRecommendation'
import './Gallery.css'

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'food', 'interior', 'events', 'kitchen']

  const galleryImages = [
    { id: 1, category: 'food', title: 'Signature Dish' },
    { id: 2, category: 'food', title: 'Fresh Pasta' },
    { id: 3, category: 'food', title: 'Grilled Steak' },
    { id: 4, category: 'food', title: 'Dessert Platter' },
    { id: 5, category: 'interior', title: 'Main Dining Area' },
    { id: 6, category: 'interior', title: 'Private Booth' },
    { id: 7, category: 'events', title: 'Wine Tasting Event' },
    { id: 8, category: 'events', title: 'Live Music Night' },
    { id: 9, category: 'kitchen', title: 'Chef at Work' },
    { id: 10, category: 'kitchen', title: 'Kitchen Station' },
    { id: 11, category: 'food', title: 'Seafood Special' },
    { id: 12, category: 'interior', title: 'Bar Area' }
  ]

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  return (
    <div className="gallery-page">
      <section className="gallery-header">
        <h1>Gallery</h1>
        <p>A visual journey through our culinary world</p>
      </section>

      <div className="container">
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div key={image.id} className="gallery-item">
              <div className="gallery-image placeholder-image">
                {image.title}
              </div>
              <div className="gallery-overlay">
                <p>{image.title}</p>
              </div>
            </div>
          ))}
        </div>

        <AIRecommendation />
      </div>
    </div>
  )
}

export default Gallery
