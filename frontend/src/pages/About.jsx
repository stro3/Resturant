import React from 'react'
import './About.css'

function About() {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1>About Us</h1>
        <p>Discover our story and passion for culinary excellence</p>
      </section>

      <div className="container">
        <section className="story-section">
          <div className="story-grid">
            <div className="story-text-block">
              <h2>Our Journey</h2>
              <p>Since our inception in 2010, we have been committed to delivering an unparalleled dining experience. Our restaurant was born from a passion for authentic cuisine and a dedication to preserving traditional cooking methods while embracing modern culinary innovation.</p>
              <p>What started as a small family-owned establishment has grown into a beloved dining destination, recognized for excellence in both food quality and customer service. Every dish we serve carries the essence of our heritage and the creativity of our skilled culinary team.</p>
            </div>
            <div className="placeholder-image">Our Beginning</div>
          </div>
        </section>

        <section className="chef-section">
          <h2 className="section-title">Meet Our Chef</h2>
          <div className="chef-grid">
            <div className="placeholder-image">Chef Portrait</div>
            <div className="chef-info">
              <h3>Executive Chef Michael Rodriguez</h3>
              <p>With over 20 years of culinary experience across three continents, Chef Michael brings a unique perspective to our kitchen. Trained in classical French technique and inspired by global flavors, he creates dishes that honor tradition while pushing culinary boundaries.</p>
              <p>His philosophy centers on ingredient integrity, seasonality, and the art of balance. Under his leadership, our restaurant has earned numerous accolades and a reputation for exceptional cuisine.</p>
              <div className="chef-credentials">
                <div className="credential">
                  <strong>Awards</strong>
                  <p>Michelin Recognition 2022</p>
                </div>
                <div className="credential">
                  <strong>Experience</strong>
                  <p>20+ Years</p>
                </div>
                <div className="credential">
                  <strong>Specialty</strong>
                  <p>Contemporary Fusion</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid grid grid-3">
            <div className="value-card">
              <h3>Quality First</h3>
              <p>We source premium ingredients from trusted local suppliers and maintain the highest standards in every aspect of our operation.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>Committed to environmental responsibility through sustainable sourcing, minimal waste practices, and eco-friendly operations.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Constantly evolving our menu while respecting culinary traditions, we create dishes that surprise and delight.</p>
            </div>
            <div className="value-card">
              <h3>Hospitality</h3>
              <p>Every guest receives personalized attention and warm service that makes each visit memorable.</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>Active participation in local initiatives and support for regional farmers and artisans.</p>
            </div>
            <div className="value-card">
              <h3>Excellence</h3>
              <p>Unwavering commitment to perfection in cuisine, service, and overall dining experience.</p>
            </div>
          </div>
        </section>

        <section className="inspiration-section">
          <h2 className="section-title">Our Inspiration</h2>
          <p className="inspiration-text">We draw inspiration from the rich culinary traditions of Mediterranean cuisine, the vibrant flavors of Asia, and the precision of French technique. This fusion creates a distinctive menu that honors heritage while embracing contemporary innovation. Our kitchen is a space where creativity meets craftsmanship, and every plate tells a unique story.</p>
        </section>
      </div>
    </div>
  )
}

export default About
