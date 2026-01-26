from pymongo import MongoClient
from datetime import datetime

client = MongoClient('mongodb://localhost:27017/')
db = client['restaurant_db']

menu_items = [
    {
        'name': 'Margherita Pizza',
        'category': 'Main Course',
        'price': 12.99,
        'description': 'Fresh mozzarella, tomato sauce, basil',
        'image': '/images/margherita.jpg',
        'dietary': ['vegetarian'],
        'spice_level': 1,
        'allergens': ['gluten', 'dairy'],
        'pairing_suggestions': ['House Red Wine', 'Italian Soda', 'Sparkling Water']
    },
    {
        'name': 'Grilled Salmon',
        'category': 'Main Course',
        'price': 24.99,
        'description': 'Atlantic salmon with lemon butter sauce',
        'image': '/images/salmon.jpg',
        'dietary': ['gluten-free'],
        'spice_level': 1,
        'allergens': ['fish'],
        'pairing_suggestions': ['White Wine', 'Chardonnay', 'Lemon Water']
    },
    {
        'name': 'Caesar Salad',
        'category': 'Starters',
        'price': 8.99,
        'description': 'Romaine lettuce, parmesan, croutons',
        'image': '/images/caesar.jpg',
        'dietary': ['vegetarian'],
        'spice_level': 1,
        'allergens': ['gluten', 'dairy', 'eggs'],
        'pairing_suggestions': ['White Wine', 'Iced Tea']
    },
    {
        'name': 'Spicy Thai Curry',
        'category': 'Main Course',
        'price': 16.99,
        'description': 'Coconut curry with vegetables',
        'image': '/images/curry.jpg',
        'dietary': ['vegan', 'gluten-free'],
        'spice_level': 5,
        'allergens': [],
        'pairing_suggestions': ['Thai Iced Tea', 'Coconut Water', 'Mango Lassi']
    },
    {
        'name': 'Chocolate Lava Cake',
        'category': 'Desserts',
        'price': 7.99,
        'description': 'Warm chocolate cake with molten center',
        'image': '/images/lava-cake.jpg',
        'dietary': ['vegetarian'],
        'spice_level': 0,
        'allergens': ['gluten', 'dairy', 'eggs'],
        'pairing_suggestions': ['Espresso', 'Port Wine', 'Vanilla Ice Cream']
    },
    {
        'name': 'Fresh Lemonade',
        'category': 'Drinks',
        'price': 3.99,
        'description': 'House-made with fresh lemons',
        'image': '/images/lemonade.jpg',
        'dietary': ['vegan', 'gluten-free'],
        'spice_level': 0,
        'allergens': [],
        'pairing_suggestions': []
    }
]

events = [
    {
        'title': 'Live Jazz Night',
        'date': '2025-12-31',
        'time': '19:00',
        'description': 'Enjoy live jazz music with dinner',
        'image': '/images/jazz.jpg'
    },
    {
        'title': 'Wine Tasting Evening',
        'date': '2026-01-15',
        'time': '18:00',
        'description': 'Sample our finest wine collection',
        'image': '/images/wine.jpg'
    }
]

db.menu.delete_many({})
db.events.delete_many({})

db.menu.insert_many(menu_items)
db.events.insert_many(events)

print('Database seeded successfully')
