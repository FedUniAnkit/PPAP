const { sequelize, connectDB } = require('../config/database');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import models
const { User, Product, Promotion, Order, ContentBlock } = require('../models');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@komorebi.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    address: {
      street: '123 Admin St',
      city: 'Pizza City',
      state: 'PC',
      zipCode: '12345'
    }
  },
  {
    name: 'Staff Member',
    email: 'staff@komorebi.com',
    password: 'staff123',
    role: 'staff',
    phone: '+1234567891'
  },
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    phone: '+1234567892',
    address: {
      street: '456 Customer Ave',
      city: 'Pizza City',
      state: 'PC',
      zipCode: '12346'
    }
  }
];

const sampleProducts = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 14.99,
    category: 'pizza',
    ingredients: ['Mozzarella', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil'],
    sizes: [
      { name: 'Small', price: 12.99 },
      { name: 'Medium', price: 14.99 },
      { name: 'Large', price: 17.99 }
    ],
    preparationTime: 15,
    nutritionalInfo: {
      calories: 250,
      protein: 12,
      carbs: 30,
      fat: 10
    }
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Traditional pepperoni pizza with mozzarella and tomato sauce',
    price: 16.99,
    category: 'pizza',
    ingredients: ['Pepperoni', 'Mozzarella', 'Tomato Sauce'],
    sizes: [
      { name: 'Small', price: 14.99 },
      { name: 'Medium', price: 16.99 },
      { name: 'Large', price: 19.99 }
    ],
    preparationTime: 18
  },
  {
    name: 'Vegetarian Supreme',
    description: 'Loaded with bell peppers, mushrooms, onions, olives, and tomatoes',
    price: 18.99,
    category: 'pizza',
    ingredients: ['Bell Peppers', 'Mushrooms', 'Onions', 'Olives', 'Tomatoes', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 16.99 },
      { name: 'Medium', price: 18.99 },
      { name: 'Large', price: 21.99 }
    ],
    preparationTime: 20
  },
  {
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter and herbs',
    price: 6.99,
    category: 'appetizer',
    ingredients: ['Bread', 'Garlic', 'Butter', 'Herbs'],
    sizes: [
      { name: 'Regular', price: 6.99 }
    ],
    preparationTime: 8
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing and croutons',
    price: 8.99,
    category: 'appetizer',
    ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
    sizes: [
      { name: 'Regular', price: 8.99 }
    ],
    preparationTime: 5
  },
  {
    name: 'Coca Cola',
    description: 'Classic Coca Cola soft drink',
    price: 2.99,
    category: 'drink',
    ingredients: ['Coca Cola'],
    sizes: [
      { name: 'Small', price: 2.99 },
      { name: 'Medium', price: 3.49 },
      { name: 'Large', price: 3.99 }
    ],
    preparationTime: 1
  },
  {
    name: 'Chocolate Brownie',
    description: 'Rich chocolate brownie with vanilla ice cream',
    price: 5.99,
    category: 'dessert',
    ingredients: ['Chocolate', 'Flour', 'Sugar', 'Vanilla Ice Cream'],
    sizes: [
      { name: 'Regular', price: 5.99 }
    ],
    preparationTime: 3
  }
];

const sampleContentBlocks = [
  {
    slug: 'homepage-welcome-title',
    title: 'Homepage Welcome Title',
    content: 'Welcome to Komorebi Pizza!',
    type: 'text',
  },
  {
    slug: 'homepage-welcome-subtitle',
    title: 'Homepage Welcome Subtitle',
    content: 'Handcrafted pizzas made with love and the freshest ingredients.',
    type: 'text',
  },
  {
    slug: 'about-us-main',
    title: 'About Us Main',
    content: '<p>Founded in 2023, Komorebi Pizza started with a simple dream: to bring authentic, delicious pizza to our community. We believe in quality, from our hand-stretched dough to our locally-sourced toppings.</p>',
    type: 'html',
  },
  {
    slug: 'footer-copyright',
    title: 'Footer Copyright',
    content: '2023 Komorebi Pizza. All rights reserved.',
    type: 'text',
  },
  {
    slug: 'footer-contact',
    title: 'Footer Contact',
    content: '123 Main St, Pizza City, PC 12345 | Phone: +1234567890 | Email: info@komorebi.com',
    type: 'text',
  },
];

const samplePromotions = [
  {
    code: 'SAVE10',
    description: 'Get 10% off your entire order.',
    discountType: 'percentage',
    amount: 10,
    isActive: true
  },
  {
    code: '5OFF',
    description: 'Get $5 off your order of $25 or more.',
    discountType: 'fixed',
    amount: 5,
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
        await connectDB();

    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully!');

    // Clear existing data
    await Order.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Promotion.destroy({ where: {}, truncate: true, cascade: true });
    await ContentBlock.destroy({ where: {}, truncate: true, cascade: true });

    console.log('Existing data cleared...');

    // Insert sample data (create users individually to trigger password hashing hooks)
    for (const userData of sampleUsers) {
      await User.create(userData);
    }
    await Product.bulkCreate(sampleProducts);
    await Promotion.bulkCreate(samplePromotions, { individualHooks: true });
    await ContentBlock.bulkCreate(sampleContentBlocks);

    console.log('Sample data inserted successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Admin: admin@komorebi.com / admin123');
    console.log('Staff: staff@komorebi.com / staff123');
    console.log('Customer: customer@example.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
