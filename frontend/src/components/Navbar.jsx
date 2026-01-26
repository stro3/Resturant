import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)
  
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Restaurant
        </Link>
        
        <div className="menu-icon" onClick={toggle}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/menu" onClick={closeMenu}>Menu</Link></li>
          <li><Link to="/order" onClick={closeMenu}>Order Online</Link></li>
          <li><Link to="/reservation" onClick={closeMenu}>Reserve Table</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/gallery" onClick={closeMenu}>Gallery</Link></li>
          <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
          <li><Link to="/reviews" onClick={closeMenu}>Reviews</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
