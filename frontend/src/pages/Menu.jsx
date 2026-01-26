import React, { useState, useEffect } from 'react'
import { menuAPI } from '../services/api'
import { toast } from 'react-toastify'
import { FaLeaf, FaPepperHot, FaExclamationTriangle } from 'react-icons/fa'
import './Menu.css'

function Menu() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDietary, setSelectedDietary] = useState('')
  const [pairingInfo, setPairingInfo] = useState({})

  const categories = ['all', 'Starters', 'Main Course', 'Desserts', 'Drinks']
  const dietaryOptions = ['', 'vegetarian', 'vegan', 'gluten-free']

  useEffect(() => {
    fetchMenu()
  }, [selectedDietary])

  const fetchMenu = async () => {
    try {
      const params = {}
      if (selectedDietary) params.dietary = selectedDietary

      const response = await menuAPI.getAll(params)
      setMenuItems(response.data)
    } catch (error) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const fetchPairing = async (itemId) => {
    try {
      const response = await menuAPI.getPairing(itemId)
      setPairingInfo(prev => ({...prev, [itemId]: response.data.pairings}))
    } catch (error) {
      toast.error('Failed to load pairing suggestions')
    }
  }

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  if (loading) return <div className="loading">Loading menu...</div>

  return (
    <div className="menu-page">
      <section className="menu-header">
        <h1>Our Menu</h1>
        <p>Explore our carefully crafted dishes</p>
      </section>

      <div className="container">
        <div className="filters">
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

          <div className="dietary-filter">
            <label>Dietary Preference:</label>
            <select 
              value={selectedDietary} 
              onChange={(e) => setSelectedDietary(e.target.value)}
            >
              <option value="">All</option>
              {dietaryOptions.slice(1).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="menu-grid grid grid-3">
          {filteredItems.map(item => (
            <div key={item._id} className="menu-item card">
              <div className="menu-item-image placeholder-image">
                {item.name}
              </div>
              <div className="menu-item-content">
                <div className="menu-item-header">
                  <h3>{item.name}</h3>
                  <span className="price">${item.price}</span>
                </div>
                <p className="description">{item.description}</p>
                
                <div className="item-icons">
                  {item.dietary?.includes('vegetarian') && <FaLeaf title="Vegetarian" />}
                  {item.dietary?.includes('vegan') && <FaLeaf title="Vegan" />}
                  {item.spice_level >= 3 && <FaPepperHot title="Spicy" />}
                  {item.allergens?.length > 0 && <FaExclamationTriangle title={`Allergens: ${item.allergens.join(', ')}`} />}
                </div>

                <button 
                  className="pairing-btn"
                  onClick={() => fetchPairing(item._id)}
                >
                  View Pairing
                </button>

                {pairingInfo[item._id] && (
                  <div className="pairing-suggestions">
                    <strong>Pairs well with:</strong>
                    <ul>
                      {pairingInfo[item._id].map((pairing, idx) => (
                        <li key={idx}>{pairing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-items">No items found for selected filters</div>
        )}
      </div>
    </div>
  )
}

export default Menu
