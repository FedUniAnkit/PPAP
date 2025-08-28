const { sequelize } = require('./config/database');
const { 
  User, 
  Product,
  Order, 
  OrderItem,
  Message, 
  Promotion, 
  NewsletterSubscription, 
  ContentBlock 
} = require('./models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@komorebipizza.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin St, Pizza City'
  },
  {
    name: 'Staff Member',
    email: 'staff@komorebipizza.com',
    password: 'staff123',
    role: 'staff',
    phone: '+1234567891',
    address: '456 Staff Ave, Pizza City'
  },
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'customer123',
    role: 'customer',
    phone: '+1234567892',
    address: '789 Customer Rd, Pizza City'
  }
];

// Categories are defined as ENUM in the Product model: 'pizza', 'appetizer', 'drink', 'dessert'

const products = [
  // Pizzas
  {
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    price: 12.99,
    category: 'pizza',
    image: '/images/products/margherita.jpg',
    isAvailable: true,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Basil'],
    preparationTime: 15
  },
  {
    name: 'Pepperoni',
    description: 'Classic pepperoni pizza with mozzarella',
    price: 14.99,
    category: 'pizza',
    image: '/images/products/pepperoni.jpg',
    isAvailable: true,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
    preparationTime: 15
  },
  // Appetizers
  {
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter',
    price: 5.99,
    category: 'appetizer',
    image: '/images/products/garlic-bread.jpg',
    isAvailable: true,
    preparationTime: 5
  },
  // Drinks
  {
    name: 'Cola',
    description: 'Refreshing cola drink',
    price: 2.99,
    category: 'drink',
    image: '/images/products/cola.jpg',
    isAvailable: true,
    preparationTime: 2
  },
  // Desserts
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert',
    price: 6.99,
    category: 'dessert',
    image: '/images/products/tiramisu.jpg',
    isAvailable: true,
    preparationTime: 10
  }
];

const promotions = [
  {
    code: 'WELCOME20',
    description: '20% off on your first order',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 20.00,
    amount: 0, // This will be calculated based on order total
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    maxUses: 100,
    currentUses: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: 'FREEDELIVERY',
    description: 'Free delivery on orders over $30',
    discountType: 'fixed',
    discountValue: 5.00, // Assuming $5 delivery fee
    minOrderAmount: 30.00,
    amount: 5.00, // Fixed discount amount
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    maxUses: 50,
    currentUses: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const contentBlocks = [
  {
    key: 'home_hero',
    slug: 'home-hero',
    title: 'Welcome to Komorebi Pizza',
    content: 'Experience the taste of authentic Italian pizza made with love and the finest ingredients.',
    image: '/images/hero.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    key: 'about_us',
    slug: 'about-us',
    title: 'Our Story',
    content: 'Founded in 2023, Komorebi Pizza brings you the perfect blend of traditional recipes and innovative flavors.',
    image: '/images/about.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');
    
    // Hash passwords and create users
    console.log('👥 Creating users...');
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword
      });
    }
    console.log(`✅ Created ${users.length} users`);
    
          // Create products
    console.log('🍕 Creating products...');
    for (const productData of products) {
      await Product.create(productData);
    }
    console.log(`✅ Created ${products.length} products`);
    
    // Create promotions
    console.log('🎉 Creating promotions...');
    for (const promoData of promotions) {
      await Promotion.create(promoData);
    }
    console.log(`✅ Created ${promotions.length} promotions`);
    
    // Create content blocks
    console.log('📝 Creating content blocks...');
    for (const contentData of contentBlocks) {
      await ContentBlock.create(contentData);
    }
    console.log(`✅ Created ${contentBlocks.length} content blocks`);
    
    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n🔑 Sample login credentials:');
    console.log('Admin: admin@komorebipizza.com / admin123');
    console.log('Staff: staff@komorebipizza.com / staff123');
    console.log('Customer: customer@example.com / customer123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

seedDatabase();
