from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
import json
import jwt
import hashlib
import uuid
import random
import string
from bson import ObjectId
from pymongo import MongoClient

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

app = Flask(__name__)
CORS(app)

SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# ═══════════════════════════════════════════════════════════════
# MONGODB CONNECTION
# ═══════════════════════════════════════════════════════════════
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
mongo_client = MongoClient(MONGODB_URI)
db = mongo_client['gastronome_db']

# Collections
users_col = db['users']
orders_col = db['orders']
reservations_col = db['reservations']
reviews_col = db['reviews']
tables_col = db['tables']
waitlist_col = db['waitlist']
gift_cards_col = db['gift_cards']
promo_codes_col = db['promo_codes']
newsletter_col = db['newsletter']
chat_messages_col = db['chat_messages']
contact_messages_col = db['contact_messages']
payments_col = db['payments']
inventory_col = db['inventory']
menu_items_col = db['menu_items']

# ═══════════════════════════════════════════════════════════════
# MONGO HELPERS
# ═══════════════════════════════════════════════════════════════
def mongo_to_dict(doc):
    """Convert a single MongoDB document to a JSON-serializable dict."""
    if doc is None:
        return None
    doc = dict(doc)
    if '_id' in doc and isinstance(doc['_id'], ObjectId):
        doc['_id'] = str(doc['_id'])
    return doc

def mongo_list(cursor):
    """Convert a MongoDB cursor to a list of JSON-serializable dicts."""
    return [mongo_to_dict(doc) for doc in cursor]

# ═══════════════════════════════════════════════════════════════
# SEED DATA (only if collections are empty)
# ═══════════════════════════════════════════════════════════════
def seed_if_empty():
    if users_col.count_documents({}) == 0:
        users_col.insert_many([
            {'id': 'admin001', 'name': 'Admin Manager', 'email': 'admin@gastronome.com',
             'password': hashlib.sha256('admin123'.encode()).hexdigest(),
             'role': 'manager', 'phone': '+91-98765-00001', 'loyalty_points': 0, 'created_at': datetime.utcnow().isoformat()},
            {'id': 'emp001', 'name': 'John Employee', 'email': 'employee@gastronome.com',
             'password': hashlib.sha256('emp123'.encode()).hexdigest(),
             'role': 'employee', 'phone': '+91-98765-00002', 'loyalty_points': 0, 'created_at': datetime.utcnow().isoformat()},
            {'id': 'emp002', 'name': 'Sarah Wilson', 'email': 'sarah@gastronome.com',
             'password': hashlib.sha256('emp123'.encode()).hexdigest(),
             'role': 'employee', 'phone': '+91-98765-00003', 'loyalty_points': 0, 'created_at': datetime.utcnow().isoformat()},
            {'id': 'cust001', 'name': 'Demo Customer', 'email': 'customer@test.com',
             'password': hashlib.sha256('customer123'.encode()).hexdigest(),
             'role': 'customer', 'phone': '+91-98765-10001', 'loyalty_points': 250, 'created_at': datetime.utcnow().isoformat()},
        ])

    if orders_col.count_documents({}) == 0:
        orders_col.insert_many([
            {'_id': 'ORD-1001', 'order_number': 'ORD20260128001', 'customer_name': 'Alice Johnson',
             'email': 'alice@test.com', 'phone': '+91-98765-20001',
             'items': [{'name': 'Truffle Risotto', 'price': 2749, 'quantity': 1}, {'name': 'Lobster Bisque', 'price': 1599, 'quantity': 2}],
             'total': 5947, 'tip': 1189, 'status': 'completed', 'type': 'dine-in',
             'table_number': 5, 'payment_method': 'card', 'payment_status': 'paid',
             'created_at': '2026-01-28T12:30:00', 'completed_at': '2026-01-28T13:15:00',
             'tracking': [{'status': 'pending', 'message': 'Order received', 'time': '2026-01-28T12:30:00'},
                          {'status': 'preparing', 'message': 'Your meal is being prepared', 'time': '2026-01-28T12:35:00'},
                          {'status': 'ready', 'message': 'Order is ready!', 'time': '2026-01-28T13:00:00'},
                          {'status': 'completed', 'message': 'Order completed', 'time': '2026-01-28T13:15:00'}]},
            {'_id': 'ORD-1002', 'order_number': 'ORD20260128002', 'customer_name': 'Bob Smith',
             'email': 'bob@test.com', 'phone': '+91-98765-20002',
             'items': [{'name': 'Wagyu Beef Steak', 'price': 5749, 'quantity': 1}, {'name': 'Chocolate Soufflé', 'price': 1399, 'quantity': 1}],
             'total': 7148, 'tip': 1430, 'status': 'preparing', 'type': 'dine-in',
             'table_number': 3, 'payment_method': 'card', 'payment_status': 'paid',
             'created_at': '2026-01-28T18:45:00', 'completed_at': None,
             'tracking': [{'status': 'pending', 'message': 'Order received', 'time': '2026-01-28T18:45:00'},
                          {'status': 'preparing', 'message': 'Your meal is being prepared', 'time': '2026-01-28T18:50:00'}]},
            {'_id': 'ORD-1003', 'order_number': 'ORD20260129001', 'customer_name': 'Carol Davis',
             'email': 'carol@test.com', 'phone': '+91-98765-20003',
             'items': [{'name': 'Pan-Seared Salmon', 'price': 2899, 'quantity': 2}, {'name': 'Caesar Salad', 'price': 999, 'quantity': 1}],
             'total': 6797, 'tip': 1020, 'status': 'ready', 'type': 'delivery',
             'delivery_address': '456 MG Road, Mumbai', 'payment_method': 'card', 'payment_status': 'paid',
             'created_at': '2026-01-29T11:00:00', 'completed_at': None,
             'tracking': [{'status': 'pending', 'message': 'Order received', 'time': '2026-01-29T11:00:00'},
                          {'status': 'preparing', 'message': 'Your meal is being prepared', 'time': '2026-01-29T11:10:00'},
                          {'status': 'ready', 'message': 'Order is ready!', 'time': '2026-01-29T11:35:00'}]},
            {'_id': 'ORD-1004', 'order_number': 'ORD20260206001', 'customer_name': 'David Lee',
             'email': 'david@test.com', 'phone': '+91-98765-20004',
             'items': [{'name': 'Duck Confit', 'price': 3249, 'quantity': 1}, {'name': 'Lobster Thermidor', 'price': 4599, 'quantity': 1}],
             'total': 7848, 'tip': 0, 'status': 'pending', 'type': 'dine-in',
             'table_number': 7, 'payment_method': 'cash', 'payment_status': 'pending',
             'created_at': datetime.utcnow().isoformat(), 'completed_at': None,
             'tracking': [{'status': 'pending', 'message': 'Order received', 'time': datetime.utcnow().isoformat()}]},
        ])

    if reservations_col.count_documents({}) == 0:
        reservations_col.insert_many([
            {'_id': 'RES-1001', 'name': 'Emily Brown', 'email': 'emily@test.com', 'phone': '+91-98765-30001',
             'date': '2026-02-07', 'time': '19:00', 'guests': 4, 'experience': 'fine-dining', 'table_id': 'T5',
             'status': 'confirmed', 'confirmation_number': 'RES-1001', 'created_at': '2026-02-05T10:00:00', 'special_requests': 'Anniversary dinner'},
            {'_id': 'RES-1002', 'name': 'Frank Wilson', 'email': 'frank@test.com', 'phone': '+91-98765-30002',
             'date': '2026-02-06', 'time': '20:00', 'guests': 2, 'experience': 'wine-pairing', 'table_id': 'T3',
             'status': 'confirmed', 'confirmation_number': 'RES-1002', 'created_at': '2026-02-04T14:00:00', 'special_requests': ''},
            {'_id': 'RES-1003', 'name': 'Grace Kim', 'email': 'grace@test.com', 'phone': '+91-98765-30003',
             'date': '2026-02-08', 'time': '18:30', 'guests': 6, 'experience': 'private-dining', 'table_id': 'T10',
             'status': 'pending', 'confirmation_number': 'RES-1003', 'created_at': '2026-02-06T09:00:00', 'special_requests': 'Birthday celebration'},
        ])

    if reviews_col.count_documents({}) == 0:
        reviews_col.insert_many([
            {'_id': 'REV-001', 'name': 'Sarah M.', 'email': 'sarah.m@test.com', 'rating': 5,
             'title': 'Absolutely stunning!', 'comment': 'The truffle risotto was divine. Best fine dining experience in the city.',
             'dish': 'Truffle Risotto', 'approved': True, 'created_at': '2026-01-20T18:00:00'},
            {'_id': 'REV-002', 'name': 'Michael C.', 'email': 'michael.c@test.com', 'rating': 5,
             'title': 'Michelin-worthy experience', 'comment': 'Every dish was a masterpiece. The wine pairing was exceptional.',
             'dish': 'Wine Pairing Menu', 'approved': True, 'created_at': '2026-01-22T20:00:00'},
            {'_id': 'REV-003', 'name': 'Jennifer L.', 'email': 'jennifer@test.com', 'rating': 4,
             'title': 'Great food, lovely ambiance', 'comment': 'The wagyu steak was cooked perfectly. Service was impeccable.',
             'dish': 'Wagyu Beef Steak', 'approved': True, 'created_at': '2026-01-25T19:30:00'},
            {'_id': 'REV-004', 'name': 'Robert K.', 'email': 'robert@test.com', 'rating': 5,
             'title': 'Best desserts in town', 'comment': 'The chocolate soufflé was heavenly. Will definitely be back!',
             'dish': 'Chocolate Soufflé', 'approved': True, 'created_at': '2026-01-27T21:00:00'},
        ])

    if tables_col.count_documents({}) == 0:
        tables_col.insert_many([
            {'id': 'T1', 'name': 'Table 1', 'seats': 2, 'x': 10, 'y': 15, 'status': 'available', 'shape': 'round'},
            {'id': 'T2', 'name': 'Table 2', 'seats': 2, 'x': 30, 'y': 15, 'status': 'available', 'shape': 'round'},
            {'id': 'T3', 'name': 'Table 3', 'seats': 4, 'x': 50, 'y': 15, 'status': 'occupied', 'shape': 'square'},
            {'id': 'T4', 'name': 'Table 4', 'seats': 4, 'x': 70, 'y': 15, 'status': 'reserved', 'shape': 'square'},
            {'id': 'T5', 'name': 'Table 5', 'seats': 4, 'x': 10, 'y': 40, 'status': 'occupied', 'shape': 'square'},
            {'id': 'T6', 'name': 'Table 6', 'seats': 6, 'x': 35, 'y': 40, 'status': 'available', 'shape': 'rect'},
            {'id': 'T7', 'name': 'Table 7', 'seats': 6, 'x': 65, 'y': 40, 'status': 'occupied', 'shape': 'rect'},
            {'id': 'T8', 'name': 'Table 8', 'seats': 2, 'x': 10, 'y': 65, 'status': 'available', 'shape': 'round'},
            {'id': 'T9', 'name': 'Table 9', 'seats': 8, 'x': 35, 'y': 65, 'status': 'available', 'shape': 'rect'},
            {'id': 'T10', 'name': 'VIP Room', 'seats': 10, 'x': 70, 'y': 65, 'status': 'reserved', 'shape': 'rect'},
            {'id': 'T11', 'name': 'Bar 1', 'seats': 1, 'x': 15, 'y': 88, 'status': 'available', 'shape': 'round'},
            {'id': 'T12', 'name': 'Bar 2', 'seats': 1, 'x': 30, 'y': 88, 'status': 'occupied', 'shape': 'round'},
        ])

    if gift_cards_col.count_documents({}) == 0:
        gift_cards_col.insert_many([
            {'id': 'GC-001', 'code': 'GIFT-AABB-1234', 'amount': 8000, 'balance': 6000,
             'purchaser_name': 'John Doe', 'purchaser_email': 'john@test.com',
             'recipient_name': 'Jane Doe', 'recipient_email': 'jane@test.com',
             'created_at': '2026-01-15', 'expires_at': '2027-01-15', 'status': 'active'},
        ])

    if promo_codes_col.count_documents({}) == 0:
        promo_codes_col.insert_many([
            {'id': 'PC-001', 'code': 'WELCOME20', 'type': 'percentage', 'value': 20,
             'min_order': 4000, 'max_uses': 100, 'used': 12, 'status': 'active',
             'expires_at': '2026-06-30', 'description': '20% off your first order'},
            {'id': 'PC-002', 'code': 'FREESHIP', 'type': 'fixed', 'value': 500,
             'min_order': 2000, 'max_uses': 50, 'used': 8, 'status': 'active',
             'expires_at': '2026-03-31', 'description': '₹500 off delivery'},
            {'id': 'PC-003', 'code': 'HAPPYHOUR', 'type': 'percentage', 'value': 30,
             'min_order': 0, 'max_uses': 200, 'used': 45, 'status': 'active',
             'expires_at': '2026-12-31', 'description': '30% off during happy hour (4-6 PM)'},
        ])

    if inventory_col.count_documents({}) == 0:
        inventory_col.insert_many([
            {'id': 'INV-001', 'name': 'Black Truffle', 'category': 'Specialty', 'quantity': 5, 'unit': 'gm', 'min_stock': 3, 'cost': 3750},
            {'id': 'INV-002', 'name': 'Wagyu Beef A5', 'category': 'Meat', 'quantity': 12, 'unit': 'kg', 'min_stock': 5, 'cost': 9999},
            {'id': 'INV-003', 'name': 'Atlantic Salmon', 'category': 'Seafood', 'quantity': 2, 'unit': 'kg', 'min_stock': 8, 'cost': 1500},
            {'id': 'INV-004', 'name': 'Lobster', 'category': 'Seafood', 'quantity': 8, 'unit': 'pcs', 'min_stock': 4, 'cost': 2900},
            {'id': 'INV-005', 'name': 'Arborio Rice', 'category': 'Pantry', 'quantity': 25, 'unit': 'kg', 'min_stock': 10, 'cost': 420},
            {'id': 'INV-006', 'name': 'Aged Parmesan', 'category': 'Dairy', 'quantity': 4, 'unit': 'kg', 'min_stock': 3, 'cost': 1800},
            {'id': 'INV-007', 'name': 'Dark Chocolate 70%', 'category': 'Pantry', 'quantity': 15, 'unit': 'kg', 'min_stock': 5, 'cost': 999},
            {'id': 'INV-008', 'name': 'Duck Legs', 'category': 'Meat', 'quantity': 1, 'unit': 'pcs', 'min_stock': 6, 'cost': 1200},
        ])

    if menu_items_col.count_documents({}) == 0:
        menu_items_col.insert_many([
            {'_id': 'M001', 'name': 'Truffle Risotto', 'price': 2749, 'category': 'Main Course',
             'description': 'Creamy arborio rice with black truffle, aged Parmesan', 'rating': 4.9, 'prep_time': 25, 'calories': 520,
             'image': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400'},
            {'_id': 'M002', 'name': 'Wagyu Beef Steak', 'price': 5749, 'category': 'Main Course',
             'description': 'Premium A5 Wagyu with roasted vegetables', 'rating': 4.9, 'prep_time': 35, 'calories': 780,
             'image': 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400'},
            {'_id': 'M003', 'name': 'Pan-Seared Salmon', 'price': 2899, 'category': 'Seafood',
             'description': 'Atlantic salmon with lemon butter sauce', 'rating': 4.8, 'prep_time': 20, 'calories': 440,
             'image': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400'},
            {'_id': 'M004', 'name': 'Lobster Thermidor', 'price': 4599, 'category': 'Seafood',
             'description': 'Classic French with cognac cream sauce', 'rating': 4.9, 'prep_time': 30, 'calories': 620,
             'image': 'https://images.unsplash.com/photo-1553247407-23251ce81f59?w=400'},
            {'_id': 'M005', 'name': 'Duck Confit', 'price': 3249, 'category': 'Main Course',
             'description': 'Slow-cooked duck leg with cherry gastrique', 'rating': 4.7, 'prep_time': 40, 'calories': 680,
             'image': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400'},
            {'_id': 'M006', 'name': 'Chocolate Soufflé', 'price': 1399, 'category': 'Dessert',
             'description': 'Warm dark chocolate soufflé with vanilla crème', 'rating': 4.8, 'prep_time': 15, 'calories': 380,
             'image': 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400'},
            {'_id': 'M007', 'name': 'Lobster Bisque', 'price': 1599, 'category': 'Starters',
             'description': 'Rich lobster soup with cognac and cream', 'rating': 4.7, 'prep_time': 12, 'calories': 290,
             'image': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'},
            {'_id': 'M008', 'name': 'Caesar Salad', 'price': 999, 'category': 'Starters',
             'description': 'Crisp romaine with house-made dressing', 'rating': 4.5, 'prep_time': 8, 'calories': 210,
             'image': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'},
        ])

seed_if_empty()

# ═══════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════
def generate_token(user_data):
    payload = {'user_id': user_data['id'], 'email': user_data['email'],
               'role': user_data['role'], 'exp': datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except:
        return None

def gen_id(prefix=''):
    return f"{prefix}{uuid.uuid4().hex[:8].upper()}"

# ═══════════════════════════════════════════════════════════════
# ROOT
# ═══════════════════════════════════════════════════════════════
@app.route('/', methods=['GET'])
def home():
    return jsonify({'status': 'running', 'name': 'Gastronome API', 'version': '2.0.0'})

# ═══════════════════════════════════════════════════════════════
# AUTH
# ═══════════════════════════════════════════════════════════════
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    if users_col.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists with this email'}), 400
    user_data = {
        'id': gen_id('user_'), 'name': data['name'], 'email': data['email'],
        'phone': data.get('phone', ''),
        'password': hashlib.sha256(data['password'].encode()).hexdigest(),
        'role': data.get('role', 'customer'), 'loyalty_points': 0,
        'created_at': datetime.utcnow().isoformat(), 'status': 'active'
    }
    users_col.insert_one(user_data)
    token = generate_token(user_data)
    return jsonify({'message': 'User registered successfully',
                    'user': {k: v for k, v in user_data.items() if k not in ('password', '_id')}, 'token': token}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email, password, role = data.get('email'), data.get('password'), data.get('role')
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    user = mongo_to_dict(users_col.find_one({'email': email}))
    if not user:
        return jsonify({'message': 'Invalid email or password'}), 401
    if user['password'] != hashlib.sha256(password.encode()).hexdigest():
        return jsonify({'message': 'Invalid email or password'}), 401
    if role and user['role'] != role:
        return jsonify({'message': f'Access denied. Not registered as {role}'}), 403
    token = generate_token(user)
    return jsonify({'message': 'Login successful',
                    'user': {k: v for k, v in user.items() if k not in ('password', '_id')}, 'token': token}), 200

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token:
        return jsonify({'message': 'No token provided'}), 401
    payload = verify_token(token)
    if not payload:
        return jsonify({'message': 'Invalid or expired token'}), 401
    user = mongo_to_dict(users_col.find_one({'id': payload['user_id']}))
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'user': {k: v for k, v in user.items() if k not in ('password', '_id')}}), 200

# ═══════════════════════════════════════════════════════════════
# USERS / STAFF
# ═══════════════════════════════════════════════════════════════
@app.route('/api/users', methods=['GET'])
def get_users():
    all_users = mongo_list(users_col.find())
    return jsonify([{k: v for k, v in u.items() if k not in ('password', '_id')} for u in all_users])

@app.route('/api/users/staff', methods=['POST'])
def add_staff():
    data = request.json
    if users_col.find_one({'email': data['email']}):
        return jsonify({'message': 'User already exists'}), 400
    user_data = {
        'id': gen_id('staff_'), 'name': data['name'], 'email': data['email'],
        'phone': data.get('phone', ''),
        'password': hashlib.sha256(data.get('password', 'staff123').encode()).hexdigest(),
        'role': data.get('role', 'employee'), 'loyalty_points': 0,
        'created_at': datetime.utcnow().isoformat(), 'status': 'active'
    }
    users_col.insert_one(user_data)
    return jsonify({'message': 'Staff added', 'user': {k: v for k, v in user_data.items() if k not in ('password', '_id')}}), 201

@app.route('/api/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    result = users_col.delete_one({'id': user_id})
    if result.deleted_count == 0:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'message': 'User deleted'}), 200

# ═══════════════════════════════════════════════════════════════
# MENU
# ═══════════════════════════════════════════════════════════════
@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(mongo_list(menu_items_col.find()))

@app.route('/api/menu', methods=['POST'])
def add_menu_item():
    data = request.json
    data['_id'] = gen_id('M')
    menu_items_col.insert_one(data)
    return jsonify({'id': data['_id'], 'message': 'Menu item added'}), 201

@app.route('/api/menu/<item_id>', methods=['PUT'])
def update_menu_item(item_id):
    data = request.json
    result = menu_items_col.update_one({'_id': item_id}, {'$set': data})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Updated'})

@app.route('/api/menu/<item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    menu_items_col.delete_one({'_id': item_id})
    return jsonify({'message': 'Deleted'})

# ═══════════════════════════════════════════════════════════════
# ORDERS (with real-time tracking)
# ═══════════════════════════════════════════════════════════════
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    order_id = gen_id('ORD-')
    order = {
        '_id': order_id, 'order_number': f"ORD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        'customer_name': data.get('customer_name', data.get('name', 'Guest')),
        'email': data.get('email', ''), 'phone': data.get('phone', ''),
        'items': data.get('items', []), 'total': data.get('total', 0),
        'tip': data.get('tip', 0), 'subtotal': data.get('subtotal', data.get('total', 0)),
        'promo_code': data.get('promo_code', ''), 'discount': data.get('discount', 0),
        'status': 'pending', 'type': data.get('type', 'dine-in'),
        'table_number': data.get('table_number', None),
        'delivery_address': data.get('delivery_address', ''),
        'payment_method': data.get('payment_method', 'card'),
        'payment_status': 'paid' if data.get('payment_method') != 'cash' else 'pending',
        'split_bill': data.get('split_bill', []),
        'special_instructions': data.get('special_instructions', ''),
        'priority': data.get('priority', 'normal'),
        'created_at': datetime.utcnow().isoformat(), 'completed_at': None,
        'tracking': [{'status': 'pending', 'message': 'Order received', 'time': datetime.utcnow().isoformat()}]
    }
    users_col.update_one(
        {'email': order['email']},
        {'$inc': {'loyalty_points': int(order['total'])}}
    )
    orders_col.insert_one(order)
    return jsonify({'order_id': order_id, 'order_number': order['order_number'],
                    'message': 'Order placed', 'status': 'pending'}), 201

@app.route('/api/orders', methods=['GET'])
def get_orders():
    all_orders = mongo_list(orders_col.find().sort('created_at', -1))
    return jsonify(all_orders)

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    order = mongo_to_dict(orders_col.find_one({'$or': [{'_id': order_id}, {'order_number': order_id}]}))
    if order:
        return jsonify(order)
    return jsonify({'error': 'Order not found'}), 404

@app.route('/api/orders/<order_id>/status', methods=['PATCH', 'PUT'])
def update_order_status(order_id):
    data = request.json
    new_status = data.get('status')
    order = mongo_to_dict(orders_col.find_one({'_id': order_id}))
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    msgs = {'pending': 'Order received', 'confirmed': 'Order confirmed by kitchen',
            'preparing': 'Your meal is being prepared', 'ready': 'Order is ready!',
            'out-for-delivery': 'On the way to you', 'completed': 'Order completed',
            'cancelled': 'Order has been cancelled'}
    tracking = order.get('tracking', [])
    tracking.append({'status': new_status, 'message': msgs.get(new_status, new_status), 'time': datetime.utcnow().isoformat()})
    update_fields = {'status': new_status, 'tracking': tracking}
    if new_status == 'completed':
        update_fields['completed_at'] = datetime.utcnow().isoformat()
    orders_col.update_one({'_id': order_id}, {'$set': update_fields})
    return jsonify({'message': 'Status updated', 'tracking': tracking})

@app.route('/api/orders/<order_id>/track', methods=['GET'])
def track_order(order_id):
    order = mongo_to_dict(orders_col.find_one({'$or': [{'_id': order_id}, {'order_number': order_id}]}))
    if order:
        return jsonify({
            'order_id': order['_id'], 'order_number': order.get('order_number'),
            'status': order['status'], 'tracking': order.get('tracking', []),
            'items': order.get('items', []), 'total': order.get('total', 0),
            'type': order.get('type', 'dine-in'),
            'estimated_time': '15-25 min' if order['status'] in ['pending', 'confirmed', 'preparing'] else 'Ready'})
    return jsonify({'error': 'Order not found'}), 404

# ═══════════════════════════════════════════════════════════════
# RESERVATIONS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.json
    res_id = gen_id('RES-')
    reservation = {
        '_id': res_id, 'confirmation_number': res_id,
        'name': data.get('name'), 'email': data.get('email'),
        'phone': data.get('phone', ''), 'date': data.get('date'),
        'time': data.get('time', 'To be confirmed'), 'guests': data.get('guests', 1),
        'experience': data.get('experience', 'fine-dining'), 'table_id': data.get('table_id', ''),
        'status': 'confirmed', 'special_requests': data.get('special_requests', ''),
        'created_at': datetime.utcnow().isoformat()
    }
    reservations_col.insert_one(reservation)
    return jsonify({'id': res_id, 'confirmation_number': res_id, 'message': 'Reservation confirmed!',
                    'email_sent': True, 'reservation': reservation}), 201

@app.route('/api/reservations', methods=['GET'])
def get_reservations():
    date = request.args.get('date')
    if date:
        return jsonify(mongo_list(reservations_col.find({'date': date})))
    return jsonify(mongo_list(reservations_col.find()))

@app.route('/api/reservations/<res_id>', methods=['PUT'])
def update_reservation(res_id):
    data = request.json
    result = reservations_col.update_one({'_id': res_id}, {'$set': data})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Updated'})

# ═══════════════════════════════════════════════════════════════
# REVIEWS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    return jsonify(mongo_list(reviews_col.find({'approved': True})))

@app.route('/api/reviews/all', methods=['GET'])
def get_all_reviews():
    return jsonify(mongo_list(reviews_col.find()))

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.json
    review = {
        '_id': gen_id('REV-'), 'name': data.get('name'), 'email': data.get('email', ''),
        'rating': data.get('rating', 5), 'title': data.get('title', ''),
        'comment': data.get('comment'), 'dish': data.get('dish', ''),
        'approved': False, 'created_at': datetime.utcnow().isoformat()
    }
    reviews_col.insert_one(review)
    return jsonify({'id': review['_id'], 'message': 'Review submitted for approval'}), 201

@app.route('/api/reviews/<review_id>/approve', methods=['PATCH'])
def approve_review(review_id):
    result = reviews_col.update_one({'_id': review_id}, {'$set': {'approved': True}})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Review approved'})

@app.route('/api/reviews/<review_id>', methods=['DELETE'])
def delete_review(review_id):
    reviews_col.delete_one({'_id': review_id})
    return jsonify({'message': 'Deleted'})

# ═══════════════════════════════════════════════════════════════
# TABLES / FLOOR PLAN / WAITLIST
# ═══════════════════════════════════════════════════════════════
@app.route('/api/tables', methods=['GET'])
def get_tables():
    return jsonify(mongo_list(tables_col.find()))

@app.route('/api/tables/<table_id>', methods=['PATCH'])
def update_table(table_id):
    data = request.json
    result = tables_col.update_one({'id': table_id}, {'$set': data})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Table updated'})

@app.route('/api/waitlist', methods=['GET'])
def get_waitlist():
    return jsonify(mongo_list(waitlist_col.find()))

@app.route('/api/waitlist', methods=['POST'])
def join_waitlist():
    data = request.json
    entry = {
        'id': gen_id('WL-'), 'name': data.get('name'), 'phone': data.get('phone', ''),
        'party_size': data.get('party_size', 2), 'status': 'waiting',
        'estimated_wait': f"{random.randint(15, 45)} min",
        'created_at': datetime.utcnow().isoformat()
    }
    waitlist_col.insert_one(entry)
    entry.pop('_id', None)
    return jsonify({'message': 'Added to waitlist', 'entry': entry}), 201

@app.route('/api/waitlist/<wl_id>', methods=['PATCH'])
def update_waitlist(wl_id):
    data = request.json
    result = waitlist_col.update_one({'id': wl_id}, {'$set': data})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Updated'})

# ═══════════════════════════════════════════════════════════════
# GIFT CARDS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/gift-cards', methods=['GET'])
def get_gift_cards():
    return jsonify(mongo_list(gift_cards_col.find()))

@app.route('/api/gift-cards', methods=['POST'])
def create_gift_card():
    data = request.json
    amount = float(data.get('amount', 50))
    gc = {
        'id': gen_id('GC-'),
        'code': f"GIFT-{''.join(random.choices(string.ascii_uppercase, k=4))}-{''.join(random.choices(string.digits, k=4))}",
        'amount': amount, 'balance': amount,
        'purchaser_name': data.get('purchaser_name', ''), 'purchaser_email': data.get('purchaser_email', ''),
        'recipient_name': data.get('recipient_name', ''), 'recipient_email': data.get('recipient_email', ''),
        'message': data.get('message', ''),
        'created_at': datetime.utcnow().isoformat(),
        'expires_at': (datetime.utcnow() + timedelta(days=365)).isoformat()[:10], 'status': 'active'
    }
    gift_cards_col.insert_one(gc)
    gc.pop('_id', None)
    return jsonify({'message': 'Gift card created', 'gift_card': gc}), 201

@app.route('/api/gift-cards/redeem', methods=['POST'])
def redeem_gift_card():
    data = request.json
    code, amount = data.get('code', '').strip(), float(data.get('amount', 0))
    gc = mongo_to_dict(gift_cards_col.find_one({'code': code, 'status': 'active'}))
    if gc:
        if gc['balance'] >= amount:
            new_balance = gc['balance'] - amount
            new_status = 'redeemed' if new_balance == 0 else gc['status']
            gift_cards_col.update_one({'code': code}, {'$set': {'balance': new_balance, 'status': new_status}})
            return jsonify({'message': 'Gift card applied', 'remaining_balance': new_balance})
        return jsonify({'message': f'Insufficient balance. Available: \u20b9{gc["balance"]:.2f}'}), 400
    return jsonify({'message': 'Invalid or expired gift card'}), 404

@app.route('/api/gift-cards/check', methods=['POST'])
def check_gift_card():
    code = request.json.get('code', '').strip()
    gc = mongo_to_dict(gift_cards_col.find_one({'code': code}))
    if gc:
        gc.pop('_id', None)
        return jsonify(gc)
    return jsonify({'message': 'Gift card not found'}), 404

# ═══════════════════════════════════════════════════════════════
# PROMO CODES
# ═══════════════════════════════════════════════════════════════
@app.route('/api/promo-codes', methods=['GET'])
def get_promo_codes():
    return jsonify(mongo_list(promo_codes_col.find()))

@app.route('/api/promo-codes', methods=['POST'])
def create_promo_code():
    data = request.json
    pc = {
        'id': gen_id('PC-'), 'code': data.get('code', '').upper(),
        'type': data.get('type', 'percentage'), 'value': data.get('value', 10),
        'min_order': data.get('min_order', 0), 'max_uses': data.get('max_uses', 100),
        'used': 0, 'status': 'active', 'description': data.get('description', ''),
        'expires_at': data.get('expires_at', (datetime.utcnow() + timedelta(days=90)).isoformat()[:10])
    }
    promo_codes_col.insert_one(pc)
    pc.pop('_id', None)
    return jsonify({'message': 'Promo code created', 'promo': pc}), 201

@app.route('/api/promo-codes/validate', methods=['POST'])
def validate_promo():
    data = request.json
    code, order_total = data.get('code', '').upper().strip(), float(data.get('total', 0))
    pc = mongo_to_dict(promo_codes_col.find_one({'code': code, 'status': 'active'}))
    if pc:
        if pc['used'] >= pc['max_uses']:
            return jsonify({'valid': False, 'message': 'Promo code usage limit reached'}), 400
        if order_total < pc['min_order']:
            return jsonify({'valid': False, 'message': f'Minimum order \u20b9{pc["min_order"]} required'}), 400
        discount = pc['value'] if pc['type'] == 'fixed' else round(order_total * pc['value'] / 100, 2)
        promo_codes_col.update_one({'code': code}, {'$inc': {'used': 1}})
        return jsonify({'valid': True, 'discount': discount, 'type': pc['type'],
                        'message': f'\u20b9{discount:.2f} discount applied!'})
    return jsonify({'valid': False, 'message': 'Invalid promo code'}), 404

# ═══════════════════════════════════════════════════════════════
# LOYALTY POINTS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/loyalty/<user_email>', methods=['GET'])
def get_loyalty(user_email):
    user = mongo_to_dict(users_col.find_one({'email': user_email}))
    if user:
        points = user.get('loyalty_points', 0)
        tier = 'Gold' if points >= 500 else 'Silver' if points >= 200 else 'Bronze'
        return jsonify({
            'points': points, 'tier': tier,
            'next_tier': 'Gold' if tier == 'Silver' else 'Platinum' if tier == 'Gold' else 'Silver',
            'points_to_next': (200 - points) if tier == 'Bronze' else (500 - points) if tier == 'Silver' else 0,
            'rewards': [
                {'name': 'Free Dessert', 'cost': 100, 'available': points >= 100},
                {'name': 'Free Appetizer', 'cost': 150, 'available': points >= 150},
                {'name': '20% Off Meal', 'cost': 300, 'available': points >= 300},
                {'name': 'Free Main Course', 'cost': 500, 'available': points >= 500},
            ]})
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/loyalty/<user_email>/redeem', methods=['POST'])
def redeem_loyalty(user_email):
    data = request.json
    pts = data.get('points', 0)
    user = mongo_to_dict(users_col.find_one({'email': user_email}))
    if user:
        if user.get('loyalty_points', 0) >= pts:
            users_col.update_one({'email': user_email}, {'$inc': {'loyalty_points': -pts}})
            return jsonify({'message': 'Points redeemed', 'remaining': user['loyalty_points'] - pts})
        return jsonify({'message': 'Insufficient points'}), 400
    return jsonify({'error': 'User not found'}), 404

# ═══════════════════════════════════════════════════════════════
# LIVE CHAT
# ═══════════════════════════════════════════════════════════════
@app.route('/api/chat', methods=['GET'])
def get_chat():
    session_id = request.args.get('session_id', '')
    return jsonify(mongo_list(chat_messages_col.find({'session_id': session_id})))

@app.route('/api/chat', methods=['POST'])
def send_chat():
    data = request.json
    msg = {
        'id': gen_id('MSG-'), 'session_id': data.get('session_id', gen_id('SESS-')),
        'sender': data.get('sender', 'customer'), 'name': data.get('name', 'Guest'),
        'message': data.get('message', ''), 'created_at': datetime.utcnow().isoformat()
    }
    chat_messages_col.insert_one(msg)
    msg.pop('_id', None)
    if msg['sender'] == 'customer':
        text = msg['message'].lower()
        if any(w in text for w in ['hour', 'open', 'time', 'close']):
            reply = "We're open Mon-Sun. Lunch: 12-3 PM, Dinner: 6-11 PM."
        elif any(w in text for w in ['reserve', 'book', 'table']):
            reply = "You can make a reservation on our Reservations page or call +91 22 4000 1234."
        elif any(w in text for w in ['menu', 'food', 'dish']):
            reply = "Check our Menu page for the full selection! Chef recommends the Truffle Risotto."
        elif any(w in text for w in ['deliver', 'order']):
            reply = "Order online through our Order page! Free delivery for orders over \u20b94000."
        elif any(w in text for w in ['hi', 'hello', 'hey']):
            reply = "Hello! Welcome to Gastronome. How can I help you today?"
        elif any(w in text for w in ['thank', 'thanks']):
            reply = "You're welcome! Anything else I can help with?"
        else:
            reply = "Thanks for your message! A team member will respond shortly. Feel free to browse our menu or make a reservation."
        bot = {'id': gen_id('MSG-'), 'session_id': msg['session_id'],
               'sender': 'support', 'name': 'Gastronome Support',
               'message': reply, 'created_at': datetime.utcnow().isoformat()}
        chat_messages_col.insert_one(bot)
        bot.pop('_id', None)
    else:
        bot = None
    return jsonify({'message': 'Sent', 'msg': msg, 'bot_reply': bot}), 201

# ═══════════════════════════════════════════════════════════════
# KITCHEN DISPLAY SYSTEM
# ═══════════════════════════════════════════════════════════════
@app.route('/api/kitchen/orders', methods=['GET'])
def kitchen_orders():
    active = mongo_list(orders_col.find({'status': {'$in': ['pending', 'confirmed', 'preparing', 'ready']}}))
    active.sort(key=lambda o: (0 if o.get('priority') == 'rush' else 1, o.get('created_at', '')))
    return jsonify(active)

@app.route('/api/kitchen/inventory', methods=['GET'])
def get_inventory():
    return jsonify(mongo_list(inventory_col.find()))

@app.route('/api/kitchen/inventory/<inv_id>', methods=['PATCH'])
def update_inventory(inv_id):
    data = request.json
    result = inventory_col.update_one({'id': inv_id}, {'$set': data})
    if result.matched_count == 0:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Updated'})

@app.route('/api/kitchen/inventory/alerts', methods=['GET'])
def inventory_alerts():
    all_inv = mongo_list(inventory_col.find())
    return jsonify([i for i in all_inv if i['quantity'] <= i['min_stock']])

# ═══════════════════════════════════════════════════════════════
# ANALYTICS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/analytics/overview', methods=['GET'])
def analytics_overview():
    all_orders = mongo_list(orders_col.find())
    all_users = mongo_list(users_col.find())
    all_reviews = mongo_list(reviews_col.find())
    all_inventory = mongo_list(inventory_col.find())
    all_reservations_count = reservations_col.count_documents({})

    total_rev = sum(o.get('total', 0) for o in all_orders)
    total_tips = sum(o.get('tip', 0) for o in all_orders)
    completed = [o for o in all_orders if o['status'] == 'completed']
    avg_order = total_rev / len(all_orders) if all_orders else 0

    items_count = {}
    for o in all_orders:
        for item in o.get('items', []):
            name = item.get('name', 'Unknown')
            items_count[name] = items_count.get(name, 0) + item.get('quantity', 1)
    popular = sorted(items_count.items(), key=lambda x: x[1], reverse=True)[:5]

    daily = {}
    for o in all_orders:
        day = o.get('created_at', '')[:10]
        daily[day] = daily.get(day, 0) + o.get('total', 0)

    hourly = {}
    for o in all_orders:
        try:
            hour = int(o.get('created_at', '')[11:13])
            hourly[hour] = hourly.get(hour, 0) + 1
        except:
            pass
    peak_hour = max(hourly, key=hourly.get) if hourly else 19

    return jsonify({
        'total_revenue': round(total_rev, 2), 'total_tips': round(total_tips, 2),
        'total_orders': len(all_orders), 'completed_orders': len(completed),
        'avg_order_value': round(avg_order, 2), 'total_reservations': all_reservations_count,
        'total_customers': len([u for u in all_users if u['role'] == 'customer']),
        'popular_items': [{'name': n, 'count': c} for n, c in popular],
        'daily_revenue': [{'date': d, 'revenue': round(r, 2)} for d, r in sorted(daily.items())],
        'peak_hour': peak_hour, 'hourly_distribution': hourly,
        'avg_rating': round(sum(r['rating'] for r in all_reviews) / len(all_reviews), 1) if all_reviews else 0,
        'inventory_alerts': len([i for i in all_inventory if i['quantity'] <= i['min_stock']])
    })

# ═══════════════════════════════════════════════════════════════
# NEWSLETTER
# ═══════════════════════════════════════════════════════════════
@app.route('/api/newsletter', methods=['POST'])
def subscribe_newsletter():
    data = request.json
    if newsletter_col.find_one({'email': data['email']}):
        return jsonify({'message': 'Already subscribed'}), 200
    newsletter_col.insert_one({'email': data['email'], 'name': data.get('name', ''),
                               'subscribed_at': datetime.utcnow().isoformat()})
    return jsonify({'message': 'Subscribed successfully!'}), 201

@app.route('/api/newsletter', methods=['GET'])
def get_newsletter():
    return jsonify(mongo_list(newsletter_col.find()))

# ═══════════════════════════════════════════════════════════════
# PAYMENTS / INVOICES / SPLIT BILL
# ═══════════════════════════════════════════════════════════════
@app.route('/api/payments', methods=['POST'])
def process_payment():
    data = request.json
    payment = {
        'id': gen_id('PAY-'), 'order_id': data.get('order_id'),
        'amount': data.get('amount', 0), 'tip': data.get('tip', 0),
        'method': data.get('method', 'card'), 'card_last4': data.get('card_last4', '****'),
        'status': 'completed', 'created_at': datetime.utcnow().isoformat()
    }
    payments_col.insert_one(payment)
    payment.pop('_id', None)
    orders_col.update_one(
        {'_id': data.get('order_id')},
        {'$set': {'payment_status': 'paid', 'tip': data.get('tip', 0)}}
    )
    return jsonify({'message': 'Payment processed', 'payment': payment}), 201

@app.route('/api/payments/split', methods=['POST'])
def split_bill():
    data = request.json
    order_id, splits = data.get('order_id'), data.get('splits', [])
    order = mongo_to_dict(orders_col.find_one({'_id': order_id}))
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    results = []
    for s in splits:
        p = {'id': gen_id('PAY-'), 'order_id': order_id, 'payer_name': s.get('name', 'Guest'),
             'amount': s.get('amount', 0), 'tip': s.get('tip', 0), 'method': s.get('method', 'card'),
             'status': 'completed', 'created_at': datetime.utcnow().isoformat()}
        payments_col.insert_one(p)
        p.pop('_id', None)
        results.append(p)
    orders_col.update_one({'_id': order_id}, {'$set': {'payment_status': 'paid', 'split_bill': results}})
    return jsonify({'message': 'Bill split successfully', 'payments': results})

@app.route('/api/invoice/<order_id>', methods=['GET'])
def get_invoice(order_id):
    order = mongo_to_dict(orders_col.find_one({'_id': order_id}))
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify({
        'invoice_number': f"INV-{order['_id'][-8:]}", 'order_number': order.get('order_number', ''),
        'date': order.get('created_at', '')[:10], 'customer': order.get('customer_name', ''),
        'email': order.get('email', ''), 'items': order.get('items', []),
        'subtotal': order.get('subtotal', order.get('total', 0)),
        'discount': order.get('discount', 0), 'tip': order.get('tip', 0),
        'total': order.get('total', 0), 'payment_method': order.get('payment_method', ''),
        'payment_status': order.get('payment_status', ''),
        'restaurant': {'name': 'Gastronome', 'address': '350 Fifth Avenue, New York, NY 10118',
                        'phone': '+91 22 4000 1234', 'email': 'reservations@gastronome.com'}
    })

# ═══════════════════════════════════════════════════════════════
# QR CODE MENU
# ═══════════════════════════════════════════════════════════════
@app.route('/api/qr/menu', methods=['GET'])
def qr_menu():
    table = request.args.get('table', '')
    return jsonify({'menu': mongo_list(menu_items_col.find()), 'table': table,
                    'message': f'Welcome to Table {table}!' if table else 'Welcome to Gastronome!'})

# ═══════════════════════════════════════════════════════════════
# CONTACT
# ═══════════════════════════════════════════════════════════════
@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.json
    data['created_at'] = datetime.utcnow().isoformat()
    data['status'] = 'new'
    data['_id'] = gen_id('CTX-')
    contact_messages_col.insert_one(data)
    return jsonify({'message_id': data['_id'], 'message': 'Message received!', 'status': 'success'}), 201

# ═══════════════════════════════════════════════════════════════
# EVENTS
# ═══════════════════════════════════════════════════════════════
@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify([
        {'id': 'E1', 'title': 'Wine Tasting Evening', 'date': '2026-02-14', 'time': '7:00 PM',
         'description': 'Explore a curated selection of fine wines', 'price': 6999, 'spots_left': 12},
        {'id': 'E2', 'title': "Chef's Table Experience", 'date': '2026-02-20', 'time': '8:00 PM',
         'description': '7-course menu with wine pairing', 'price': 19999, 'spots_left': 4},
        {'id': 'E3', 'title': 'Cooking Masterclass', 'date': '2026-03-01', 'time': '2:00 PM',
         'description': 'Learn to cook French cuisine', 'price': 9999, 'spots_left': 8},
    ])

# ═══════════════════════════════════════════════════════════════
if __name__ == '__main__':
    print("\n  Gastronome API v2.0 starting...")
    print("  Endpoints: /api/orders, /api/tables, /api/gift-cards, /api/kitchen/orders, /api/analytics/overview, /api/chat ...")
    app.run(debug=True, port=5000)
