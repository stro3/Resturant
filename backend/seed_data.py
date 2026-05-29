from pymongo import MongoClient
from datetime import datetime
import hashlib
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except:
    pass

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGODB_URI)
db = client['gastronome_db']

# Drop all collections for a clean seed
collections = ['users', 'orders', 'reservations', 'reviews', 'tables',
               'gift_cards', 'promo_codes', 'inventory', 'menu_items',
               'waitlist', 'newsletter', 'chat_messages', 'payments', 'contact_messages']

for col_name in collections:
    db[col_name].delete_many({})

# Users
db.users.insert_many([
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

# Orders
db.orders.insert_many([
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
     'items': [{'name': 'Wagyu Beef Steak', 'price': 5749, 'quantity': 1}, {'name': 'Chocolate Souffle', 'price': 1399, 'quantity': 1}],
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

# Reservations
db.reservations.insert_many([
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

# Reviews
db.reviews.insert_many([
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
     'title': 'Best desserts in town', 'comment': 'The chocolate souffle was heavenly. Will definitely be back!',
     'dish': 'Chocolate Souffle', 'approved': True, 'created_at': '2026-01-27T21:00:00'},
])

# Tables
db.tables.insert_many([
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

# Gift Cards
db.gift_cards.insert_one(
    {'id': 'GC-001', 'code': 'GIFT-AABB-1234', 'amount': 8000, 'balance': 6000,
     'purchaser_name': 'John Doe', 'purchaser_email': 'john@test.com',
     'recipient_name': 'Jane Doe', 'recipient_email': 'jane@test.com',
     'created_at': '2026-01-15', 'expires_at': '2027-01-15', 'status': 'active'}
)

# Promo Codes
db.promo_codes.insert_many([
    {'id': 'PC-001', 'code': 'WELCOME20', 'type': 'percentage', 'value': 20,
     'min_order': 4000, 'max_uses': 100, 'used': 12, 'status': 'active',
     'expires_at': '2026-06-30', 'description': '20% off your first order'},
    {'id': 'PC-002', 'code': 'FREESHIP', 'type': 'fixed', 'value': 500,
     'min_order': 2000, 'max_uses': 50, 'used': 8, 'status': 'active',
     'expires_at': '2026-03-31', 'description': '500 off delivery'},
    {'id': 'PC-003', 'code': 'HAPPYHOUR', 'type': 'percentage', 'value': 30,
     'min_order': 0, 'max_uses': 200, 'used': 45, 'status': 'active',
     'expires_at': '2026-12-31', 'description': '30% off during happy hour (4-6 PM)'},
])

# Inventory
db.inventory.insert_many([
    {'id': 'INV-001', 'name': 'Black Truffle', 'category': 'Specialty', 'quantity': 5, 'unit': 'gm', 'min_stock': 3, 'cost': 3750},
    {'id': 'INV-002', 'name': 'Wagyu Beef A5', 'category': 'Meat', 'quantity': 12, 'unit': 'kg', 'min_stock': 5, 'cost': 9999},
    {'id': 'INV-003', 'name': 'Atlantic Salmon', 'category': 'Seafood', 'quantity': 2, 'unit': 'kg', 'min_stock': 8, 'cost': 1500},
    {'id': 'INV-004', 'name': 'Lobster', 'category': 'Seafood', 'quantity': 8, 'unit': 'pcs', 'min_stock': 4, 'cost': 2900},
    {'id': 'INV-005', 'name': 'Arborio Rice', 'category': 'Pantry', 'quantity': 25, 'unit': 'kg', 'min_stock': 10, 'cost': 420},
    {'id': 'INV-006', 'name': 'Aged Parmesan', 'category': 'Dairy', 'quantity': 4, 'unit': 'kg', 'min_stock': 3, 'cost': 1800},
    {'id': 'INV-007', 'name': 'Dark Chocolate 70%', 'category': 'Pantry', 'quantity': 15, 'unit': 'kg', 'min_stock': 5, 'cost': 999},
    {'id': 'INV-008', 'name': 'Duck Legs', 'category': 'Meat', 'quantity': 1, 'unit': 'pcs', 'min_stock': 6, 'cost': 1200},
])

# Menu Items
db.menu_items.insert_many([
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
    {'_id': 'M006', 'name': 'Chocolate Souffle', 'price': 1399, 'category': 'Dessert',
     'description': 'Warm dark chocolate souffle with vanilla creme', 'rating': 4.8, 'prep_time': 15, 'calories': 380,
     'image': 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400'},
    {'_id': 'M007', 'name': 'Lobster Bisque', 'price': 1599, 'category': 'Starters',
     'description': 'Rich lobster soup with cognac and cream', 'rating': 4.7, 'prep_time': 12, 'calories': 290,
     'image': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'},
    {'_id': 'M008', 'name': 'Caesar Salad', 'price': 999, 'category': 'Starters',
     'description': 'Crisp romaine with house-made dressing', 'rating': 4.5, 'prep_time': 8, 'calories': 210,
     'image': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'},
])

print('Database seeded successfully! All 14 collections populated in gastronome_db.')
