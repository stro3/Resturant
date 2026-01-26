# Restaurant Website

Production-grade full-stack restaurant website built with React, Python Flask, and MongoDB.

## Architecture

### Backend Stack
- Python 3.x with Flask framework
- MongoDB for data persistence
- RESTful API architecture
- CORS enabled for cross-origin requests

### Frontend Stack
- React 18 with Vite bundler
- React Router for client-side routing
- Axios for HTTP communication
- React Hook Form for validation
- Framer Motion for animations
- React Toastify for notifications

### Database Schema
- Menu collection: items with pricing, dietary info, allergens, pairing suggestions
- Reservations collection: booking data with status tracking
- Orders collection: e-commerce transactions with order numbers
- Reviews collection: customer feedback with approval workflow
- Events collection: upcoming restaurant events
- Newsletter collection: subscriber management

## Project Structure

```
ResturantWebsite/
├── backend/
│   ├── app.py                 # Flask application with API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── seed_data.py          # Database initialization script
│   └── .env.example          # Environment variables template
└── frontend/
    ├── src/
    │   ├── components/       # Reusable React components
    │   ├── pages/           # Route-based page components
    │   ├── services/        # API integration layer
    │   ├── App.jsx          # Main application component
    │   └── main.jsx         # Application entry point
    ├── package.json
    └── vite.config.js
```

## Installation

### Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
```

Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/
PORT=5000
FLASK_ENV=development
```

### Frontend Setup

```powershell
cd frontend
npm install
```

## Database Initialization

Ensure MongoDB is running locally, then seed the database:

```powershell
cd backend
python seed_data.py
```

## Running the Application

### Start Backend Server
```powershell
cd backend
python app.py
```
Backend runs on http://localhost:5000

### Start Frontend Development Server
```powershell
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

## Features Implementation

### Core Features
- Home page with hero section and feature highlights
- Dynamic menu with category filters and dietary preferences
- Online ordering system with cart management
- Table reservation system with date/time selection
- Contact page with business information
- About page with restaurant story and chef profile

### Advanced Features
- AI-powered menu recommendations based on mood, spice level, dietary needs
- Wine/beverage pairing suggestions per dish
- Customer review system with star ratings
- Event management and upcoming events display
- Newsletter subscription system
- Loyalty program information
- Image gallery with category filtering

### Technical Features
- Form validation with error handling
- Loading states and error boundaries
- Responsive design for mobile/tablet/desktop
- Toast notifications for user feedback
- Sticky navigation with mobile menu
- API proxy configuration for development
- Database indexing for performance

## API Endpoints

### Menu Operations
- GET /api/menu - Retrieve menu items (supports filtering)
- GET /api/menu/:id - Get specific menu item
- POST /api/menu - Add new menu item
- GET /api/pairing/:id - Get pairing suggestions

### Reservation System
- POST /api/reservations - Create reservation
- GET /api/reservations - List reservations

### Order Management
- POST /api/orders - Place order
- GET /api/orders/:id - Track order
- PATCH /api/orders/:id/status - Update order status

### Customer Engagement
- GET /api/reviews - Fetch approved reviews
- POST /api/reviews - Submit review
- POST /api/newsletter - Subscribe to newsletter
- GET /api/events - List upcoming events
- POST /api/ai-recommendation - Get AI menu suggestions

## Common Mistakes to Avoid

1. **MongoDB Connection**: Ensure MongoDB service is running before starting backend
2. **CORS Issues**: Backend CORS is configured; verify frontend proxy in vite.config.js
3. **Environment Variables**: Always copy .env.example to .env with actual values
4. **Port Conflicts**: Default ports 5000 (backend) and 3000 (frontend) must be available
5. **ObjectId Serialization**: Backend converts MongoDB ObjectIds to strings for JSON responses
6. **Form Validation**: Frontend validates before submission; backend should also validate
7. **Image Placeholders**: Current implementation uses CSS gradients; replace with actual images
8. **State Management**: Cart and form state reset appropriately after successful operations

## Improvement Suggestions

### Security Enhancements
- Implement JWT authentication for user accounts
- Add rate limiting to prevent API abuse
- Encrypt sensitive data in transit and at rest
- Implement CSRF protection
- Add input sanitization to prevent injection attacks

### Performance Optimization
- Implement Redis caching for frequently accessed data
- Add database indexing on query-heavy fields
- Implement lazy loading for images
- Use React.memo for expensive components
- Implement virtual scrolling for large lists

### Feature Additions
- Payment gateway integration (Stripe/PayPal)
- Real-time order tracking with WebSocket
- Multi-language support with i18n
- Push notifications for order updates
- Admin dashboard for restaurant management
- Inventory management system
- Advanced analytics and reporting

### User Experience
- Progressive Web App (PWA) capabilities
- Offline mode support
- Dark mode theme
- Accessibility improvements (ARIA labels, keyboard navigation)
- Social media integration for sharing
- Google Maps integration for location
- WhatsApp integration for customer support

### DevOps
- Docker containerization
- CI/CD pipeline setup
- Automated testing (unit, integration, e2e)
- Monitoring and logging infrastructure
- Load balancing for scalability
- Database backup automation

## Technical Specifications

- **Authentication**: Currently not implemented; add JWT for production
- **File Upload**: Not implemented; required for user-generated photos
- **Payment Processing**: Not integrated; use Stripe/Razorpay for transactions
- **Email Service**: Not configured; implement SendGrid/AWS SES for notifications
- **Search**: Basic filtering only; consider Elasticsearch for advanced search
- **Analytics**: Not implemented; integrate Google Analytics or Mixpanel

## Production Deployment

### Backend Deployment
1. Use production WSGI server (Gunicorn)
2. Configure environment variables securely
3. Set up MongoDB Atlas or managed MongoDB
4. Enable HTTPS with SSL certificates
5. Configure proper CORS origins

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to CDN or static hosting (Vercel, Netlify)
3. Configure environment-specific API URLs
4. Enable gzip compression
5. Set up proper caching headers

## Maintenance

- Regular security updates for dependencies
- Database backup schedule
- Performance monitoring
- Log rotation and analysis
- User feedback collection
- A/B testing for UX improvements
