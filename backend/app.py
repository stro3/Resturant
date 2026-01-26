from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

app = Flask(__name__)
CORS(app)

try:
    client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'), serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client['restaurant_db']
    db_connected = True
except:
    db_connected = False
    db = None

if db_connected:
    menu_collection = db['menu']
    reservations_collection = db['reservations']
    orders_collection = db['orders']
    reviews_collection = db['reviews']
    users_collection = db['users']
    newsletter_collection = db['newsletter']
    events_collection = db['events']

reservations_memory = []
orders_memory = []

def send_reservation_email(reservation_data):
    try:
        sender_email = os.getenv('EMAIL_USER', '')
        sender_password = os.getenv('EMAIL_PASS', '')
        
        if not sender_email or not sender_password:
            return False, "Email not configured"
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Reservation Confirmation - Gastronome Restaurant"
        msg['From'] = sender_email
        msg['To'] = reservation_data.get('email')
        
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #722F37 0%, #8B4513 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">🍽️ Gastronome</h1>
                <p style="color: #FFF8DC; margin-top: 10px;">Reservation Confirmed</p>
            </div>
            <div style="background: #FFFAF0; padding: 30px; border: 1px solid #FFF8DC;">
                <h2 style="color: #36454F;">Hello {reservation_data.get('name')}!</h2>
                <p style="color: #36454F;">Your table has been successfully reserved. Here are your booking details:</p>
                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #722F37;">
                    <p><strong>📅 Date:</strong> {reservation_data.get('date')}</p>
                    <p><strong>🕐 Time:</strong> {reservation_data.get('time')}</p>
                    <p><strong>👥 Guests:</strong> {reservation_data.get('guests')}</p>
                    <p><strong>🍷 Experience:</strong> {reservation_data.get('experience', 'Fine Dining').replace('-', ' ').title()}</p>
                </div>
                <p style="color: #36454F;">Please arrive 10 minutes before your reservation time.</p>
                <p style="color: #36454F;">For any changes or cancellations, please contact us at:</p>
                <p style="color: #722F37;"><strong>📞 +1 (555) 123-4567</strong></p>
                <hr style="border: none; border-top: 1px solid #FFF8DC; margin: 20px 0;">
                <p style="color: #888; font-size: 12px; text-align: center;">
                    Gastronome Restaurant | 123 Culinary Street, Food District | hello@gastronome.com
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, reservation_data.get('email'), msg.as_string())
        
        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'running',
        'name': 'Restaurant API',
        'version': '1.0.0',
        'database': 'connected' if db_connected else 'not connected (using memory storage)',
        'endpoints': [
            '/api/menu',
            '/api/reservations',
            '/api/orders',
            '/api/reviews',
            '/api/events',
            '/api/newsletter',
            '/api/ai-recommendation'
        ]
    })

@app.route('/api/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category')
    dietary = request.args.get('dietary')
    
    if not db_connected:
        return jsonify([])
    
    query = {}
    if category:
        query['category'] = category
    if dietary:
        query['dietary'] = {'$in': [dietary]}
    
    items = list(menu_collection.find(query))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify(items)

@app.route('/api/menu/<item_id>', methods=['GET'])
def get_menu_item(item_id):
    if not db_connected:
        return jsonify({'error': 'Database not connected'}), 503
    item = menu_collection.find_one({'_id': ObjectId(item_id)})
    if item:
        item['_id'] = str(item['_id'])
        return jsonify(item)
    return jsonify({'error': 'Item not found'}), 404

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    if not db_connected:
        return jsonify({'error': 'Database not connected'}), 503
    data = request.json
    result = menu_collection.insert_one(data)
    return jsonify({'id': str(result.inserted_id)}), 201

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'confirmed'
    
    reservation_id = None
    
    if db_connected:
        result = reservations_collection.insert_one(data)
        reservation_id = str(result.inserted_id)
    else:
        reservation_id = f"RES-{len(reservations_memory) + 1001}"
        data['_id'] = reservation_id
        reservations_memory.append(data)
    
    email_sent, email_message = send_reservation_email(data)
    
    return jsonify({
        'id': reservation_id,
        'message': 'Reservation confirmed successfully!',
        'email_sent': email_sent,
        'email_note': 'Confirmation email sent!' if email_sent else 'Email service not configured. Your reservation is still confirmed.',
        'reservation': {
            'name': data.get('name'),
            'date': data.get('date'),
            'time': data.get('time'),
            'guests': data.get('guests'),
            'experience': data.get('experience')
        }
    }), 201

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    date = request.args.get('date')
    
    if not db_connected:
        if date:
            return jsonify([r for r in reservations_memory if r.get('date') == date])
        return jsonify(reservations_memory)
    
    query = {}
    if date:
        query['date'] = date
    
    reservations = list(reservations_collection.find(query))
    for res in reservations:
        res['_id'] = str(res['_id'])
    
    return jsonify(reservations)

@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'confirmed'
    data['order_number'] = f"ORD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    order_id = None
    
    if db_connected:
        result = orders_collection.insert_one(data)
        order_id = str(result.inserted_id)
    else:
        order_id = f"ORD-{len(orders_memory) + 1001}"
        data['_id'] = order_id
        orders_memory.append(data)
    
    return jsonify({
        'order_id': order_id,
        'order_number': data['order_number'],
        'message': 'Order placed successfully',
        'status': 'confirmed',
        'total': data.get('total'),
        'items': data.get('items'),
        'delivery_address': data.get('deliveryAddress')
    }), 201

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = orders_collection.find_one({'_id': ObjectId(order_id)})
    if order:
        order['_id'] = str(order['_id'])
        return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders/<order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    data = request.json
    result = orders_collection.update_one(
        {'_id': ObjectId(order_id)},
        {'$set': {'status': data['status']}}
    )
    
    if result.modified_count:
        return jsonify({'message': 'Status updated'})
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    reviews = list(reviews_collection.find().sort('created_at', -1).limit(20))
    for review in reviews:
        review['_id'] = str(review['_id'])
    
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    data['created_at'] = datetime.utcnow()
    data['approved'] = False
    
    result = reviews_collection.insert_one(data)
    
    return jsonify({
        'id': str(result.inserted_id),
        'message': 'Review submitted for approval'
    }), 201

@app.route('/api/newsletter', methods=['POST'])
def subscribe_newsletter():
    data = request.json
    
    existing = newsletter_collection.find_one({'email': data['email']})
    if existing:
        return jsonify({'message': 'Already subscribed'}), 200
    
    data['subscribed_at'] = datetime.utcnow()
    newsletter_collection.insert_one(data)
    
    return jsonify({'message': 'Subscribed successfully'}), 201

@app.route('/api/events', methods=['GET'])
def get_events():
    events = list(events_collection.find({'date': {'$gte': datetime.utcnow().strftime('%Y-%m-%d')}}).sort('date', 1))
    for event in events:
        event['_id'] = str(event['_id'])
    
    return jsonify(events)

@app.route('/api/ai-recommendation', methods=['POST'])
def ai_recommendation():
    data = request.json
    mood = data.get('mood', 'neutral')
    spice = data.get('spice', 'medium')
    dietary = data.get('dietary', [])
    
    query = {}
    if dietary:
        query['dietary'] = {'$in': dietary}
    
    if spice == 'mild':
        query['spice_level'] = {'$lte': 2}
    elif spice == 'hot':
        query['spice_level'] = {'$gte': 4}
    
    items = list(menu_collection.find(query).limit(3))
    for item in items:
        item['_id'] = str(item['_id'])
    
    return jsonify({'recommendations': items})

@app.route('/api/pairing/<item_id>', methods=['GET'])
def get_pairing(item_id):
    item = menu_collection.find_one({'_id': ObjectId(item_id)})
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    
    pairing = item.get('pairing_suggestions', [])
    return jsonify({'pairings': pairing})

contact_messages = []

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'new'
    
    message_id = f"MSG-{len(contact_messages) + 1001}"
    data['_id'] = message_id
    contact_messages.append(data)
    
    return jsonify({
        'message_id': message_id,
        'message': 'Thank you for your message! We will get back to you soon.',
        'status': 'success'
    }), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
