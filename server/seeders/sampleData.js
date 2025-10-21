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
  // Hero Section Pizzas (7 pizzas from homepage)
  {
    name: 'Margherita Supreme',
    description: 'Fresh mozzarella, basil, premium tomatoes',
    price: 24.00,
    category: 'pizza',
    ingredients: ['Fresh Mozzarella', 'Premium Tomatoes', 'Fresh Basil', 'Extra Virgin Olive Oil'],
    sizes: [
      { name: 'Small', price: 20.00 },
      { name: 'Medium', price: 24.00 },
      { name: 'Large', price: 28.00 }
    ],
    preparationTime: 15,
    nutritionalInfo: {
      calories: 280,
      protein: 14,
      carbs: 32,
      fat: 12
    }
  },
  {
    name: 'Pepperoni Classic',
    description: 'Premium pepperoni, mozzarella',
    price: 22.00,
    category: 'pizza',
    ingredients: ['Premium Pepperoni', 'Mozzarella', 'Tomato Sauce'],
    sizes: [
      { name: 'Small', price: 18.00 },
      { name: 'Medium', price: 22.00 },
      { name: 'Large', price: 26.00 }
    ],
    preparationTime: 18
  },
  {
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, ham',
    price: 28.00,
    category: 'pizza',
    ingredients: ['Pepperoni', 'Italian Sausage', 'Bacon', 'Ham', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 24.00 },
      { name: 'Medium', price: 28.00 },
      { name: 'Large', price: 32.00 }
    ],
    preparationTime: 22
  },
  {
    name: 'Veggie Delight',
    description: 'Fresh vegetables, herbs, cheese',
    price: 26.00,
    category: 'pizza',
    ingredients: ['Bell Peppers', 'Mushrooms', 'Red Onions', 'Olives', 'Tomatoes', 'Fresh Herbs', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 22.00 },
      { name: 'Medium', price: 26.00 },
      { name: 'Large', price: 30.00 }
    ],
    preparationTime: 20
  },
  {
    name: 'Pineapple Pizza',
    description: 'Ham, pineapple, mozzarella',
    price: 25.00,
    category: 'pizza',
    ingredients: ['Ham', 'Fresh Pineapple', 'Mozzarella', 'Tomato Sauce'],
    sizes: [
      { name: 'Small', price: 21.00 },
      { name: 'Medium', price: 25.00 },
      { name: 'Large', price: 29.00 }
    ],
    preparationTime: 18
  },
  {
    name: 'Teriyaki Delight',
    description: 'Japanese teriyaki chicken, fresh vegetables',
    price: 27.00,
    category: 'pizza',
    ingredients: ['Teriyaki Chicken', 'Bell Peppers', 'Red Onions', 'Pineapple', 'Mozzarella', 'Teriyaki Sauce'],
    sizes: [
      { name: 'Small', price: 23.00 },
      { name: 'Medium', price: 27.00 },
      { name: 'Large', price: 31.00 }
    ],
    preparationTime: 20
  },
  {
    name: 'Okonomiyaki Fusion',
    description: 'Traditional Japanese flavors on pizza',
    price: 26.00,
    category: 'pizza',
    ingredients: ['Cabbage', 'Bacon', 'Bonito Flakes', 'Okonomiyaki Sauce', 'Japanese Mayo', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 22.00 },
      { name: 'Medium', price: 26.00 },
      { name: 'Large', price: 30.00 }
    ],
    preparationTime: 22
  },
  // Additional 8 Pizzas to make 15 total
  {
    name: 'BBQ Chicken Supreme',
    description: 'Grilled chicken, BBQ sauce, red onions, cilantro',
    price: 25.00,
    category: 'pizza',
    ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Cilantro', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 21.00 },
      { name: 'Medium', price: 25.00 },
      { name: 'Large', price: 29.00 }
    ],
    preparationTime: 20
  },
  {
    name: 'Mediterranean Delight',
    description: 'Feta cheese, olives, sun-dried tomatoes, spinach',
    price: 24.00,
    category: 'pizza',
    ingredients: ['Feta Cheese', 'Kalamata Olives', 'Sun-dried Tomatoes', 'Fresh Spinach', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 20.00 },
      { name: 'Medium', price: 24.00 },
      { name: 'Large', price: 28.00 }
    ],
    preparationTime: 18
  },
  {
    name: 'Spicy Italian',
    description: 'Spicy salami, jalapeños, hot peppers, chili oil',
    price: 26.00,
    category: 'pizza',
    ingredients: ['Spicy Salami', 'Jalapeños', 'Hot Peppers', 'Chili Oil', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 22.00 },
      { name: 'Medium', price: 26.00 },
      { name: 'Large', price: 30.00 }
    ],
    preparationTime: 19
  },
  {
    name: 'Four Cheese Classic',
    description: 'Mozzarella, parmesan, gorgonzola, ricotta',
    price: 23.00,
    category: 'pizza',
    ingredients: ['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta', 'White Sauce'],
    sizes: [
      { name: 'Small', price: 19.00 },
      { name: 'Medium', price: 23.00 },
      { name: 'Large', price: 27.00 }
    ],
    preparationTime: 16
  },
  {
    name: 'Mushroom Truffle',
    description: 'Mixed mushrooms, truffle oil, arugula, parmesan',
    price: 29.00,
    category: 'pizza',
    ingredients: ['Mixed Mushrooms', 'Truffle Oil', 'Fresh Arugula', 'Parmesan', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 25.00 },
      { name: 'Medium', price: 29.00 },
      { name: 'Large', price: 33.00 }
    ],
    preparationTime: 20
  },
  {
    name: 'Prosciutto & Fig',
    description: 'Prosciutto, fresh figs, goat cheese, honey drizzle',
    price: 30.00,
    category: 'pizza',
    ingredients: ['Prosciutto', 'Fresh Figs', 'Goat Cheese', 'Honey', 'Arugula', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 26.00 },
      { name: 'Medium', price: 30.00 },
      { name: 'Large', price: 34.00 }
    ],
    preparationTime: 18
  },
  {
    name: 'Buffalo Chicken',
    description: 'Buffalo chicken, blue cheese, celery, ranch drizzle',
    price: 26.00,
    category: 'pizza',
    ingredients: ['Buffalo Chicken', 'Blue Cheese', 'Celery', 'Ranch Sauce', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 22.00 },
      { name: 'Medium', price: 26.00 },
      { name: 'Large', price: 30.00 }
    ],
    preparationTime: 20
  },
  {
    name: 'Seafood Special',
    description: 'Shrimp, calamari, garlic, white wine sauce',
    price: 32.00,
    category: 'pizza',
    ingredients: ['Shrimp', 'Calamari', 'Garlic', 'White Wine Sauce', 'Fresh Herbs', 'Mozzarella'],
    sizes: [
      { name: 'Small', price: 28.00 },
      { name: 'Medium', price: 32.00 },
      { name: 'Large', price: 36.00 }
    ],
    preparationTime: 25
  },
  
  // Sides (6 items)
  {
    name: 'Garlic Bread',
    description: 'Fresh baked bread with garlic butter and herbs',
    price: 6.99,
    category: 'side',
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
    category: 'side',
    ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan'],
    sizes: [
      { name: 'Regular', price: 8.99 }
    ],
    preparationTime: 5
  },
  {
    name: 'Buffalo Wings',
    description: 'Crispy chicken wings with buffalo sauce and blue cheese dip',
    price: 12.99,
    category: 'side',
    ingredients: ['Chicken Wings', 'Buffalo Sauce', 'Blue Cheese', 'Celery'],
    sizes: [
      { name: '6 pieces', price: 9.99 },
      { name: '12 pieces', price: 12.99 },
      { name: '18 pieces', price: 18.99 }
    ],
    preparationTime: 15
  },
  {
    name: 'Mozzarella Sticks',
    description: 'Golden fried mozzarella sticks with marinara sauce',
    price: 8.99,
    category: 'side',
    ingredients: ['Mozzarella', 'Breadcrumbs', 'Marinara Sauce'],
    sizes: [
      { name: '6 pieces', price: 8.99 },
      { name: '12 pieces', price: 15.99 }
    ],
    preparationTime: 10
  },
  {
    name: 'Loaded Nachos',
    description: 'Tortilla chips with cheese, jalapeños, sour cream, and guacamole',
    price: 11.99,
    category: 'side',
    ingredients: ['Tortilla Chips', 'Cheese', 'Jalapeños', 'Sour Cream', 'Guacamole'],
    sizes: [
      { name: 'Regular', price: 11.99 },
      { name: 'Large', price: 16.99 }
    ],
    preparationTime: 8
  },
  {
    name: 'Chocolate Chip Cookie',
    description: 'Freshly baked chocolate chip cookie',
    price: 2.99,
    category: 'side',
    ingredients: ['Flour', 'Chocolate Chips', 'Butter', 'Sugar'],
    sizes: [
      { name: '1 cookie', price: 2.99 },
      { name: '3 cookies', price: 7.99 },
      { name: '6 cookies', price: 14.99 }
    ],
    preparationTime: 2
  },

  // Drinks (5 items)
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
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 4.99,
    category: 'drink',
    ingredients: ['Fresh Oranges'],
    sizes: [
      { name: 'Small', price: 3.99 },
      { name: 'Medium', price: 4.99 },
      { name: 'Large', price: 5.99 }
    ],
    preparationTime: 2
  },
  {
    name: 'Craft Beer',
    description: 'Local craft beer selection',
    price: 5.99,
    category: 'drink',
    ingredients: ['Craft Beer'],
    sizes: [
      { name: 'Bottle', price: 5.99 },
      { name: 'Pint', price: 7.99 }
    ],
    preparationTime: 1
  },
  {
    name: 'Italian Soda',
    description: 'Sparkling water with Italian syrup flavors',
    price: 3.99,
    category: 'drink',
    ingredients: ['Sparkling Water', 'Italian Syrup'],
    sizes: [
      { name: 'Regular', price: 3.99 }
    ],
    preparationTime: 2
  },
  {
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon',
    price: 2.99,
    category: 'drink',
    ingredients: ['Tea', 'Ice', 'Lemon'],
    sizes: [
      { name: 'Small', price: 2.99 },
      { name: 'Medium', price: 3.49 },
      { name: 'Large', price: 3.99 }
    ],
    preparationTime: 1
  },

  // Desserts (5 items)
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
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian tiramisu with coffee and mascarpone',
    price: 7.99,
    category: 'dessert',
    ingredients: ['Ladyfingers', 'Coffee', 'Mascarpone', 'Cocoa'],
    sizes: [
      { name: 'Regular', price: 7.99 }
    ],
    preparationTime: 2
  },
  {
    name: 'Gelato Trio',
    description: 'Three scoops of artisan gelato - vanilla, chocolate, strawberry',
    price: 6.99,
    category: 'dessert',
    ingredients: ['Vanilla Gelato', 'Chocolate Gelato', 'Strawberry Gelato'],
    sizes: [
      { name: '3 scoops', price: 6.99 },
      { name: '5 scoops', price: 9.99 }
    ],
    preparationTime: 2
  },
  {
    name: 'Cannoli',
    description: 'Traditional Sicilian cannoli with ricotta filling',
    price: 4.99,
    category: 'dessert',
    ingredients: ['Cannoli Shell', 'Ricotta', 'Chocolate Chips', 'Powdered Sugar'],
    sizes: [
      { name: '2 pieces', price: 4.99 },
      { name: '4 pieces', price: 8.99 }
    ],
    preparationTime: 1
  },
  {
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 6.99,
    category: 'dessert',
    ingredients: ['Cream Cheese', 'Graham Cracker Crust', 'Berry Compote'],
    sizes: [
      { name: 'Regular', price: 6.99 }
    ],
    preparationTime: 2
  },

  // Deals (5 items)
  {
    name: 'Family Pizza Deal',
    description: '2 Large pizzas + 4 drinks + garlic bread',
    price: 49.99,
    category: 'deal',
    ingredients: ['2 Large Pizzas', '4 Drinks', 'Garlic Bread'],
    sizes: [
      { name: 'Family Pack', price: 49.99 }
    ],
    preparationTime: 25
  },
  {
    name: 'Lunch Special',
    description: 'Small pizza + drink + side',
    price: 15.99,
    category: 'deal',
    ingredients: ['Small Pizza', 'Drink', 'Side'],
    sizes: [
      { name: 'Lunch Deal', price: 15.99 }
    ],
    preparationTime: 15
  },
  {
    name: 'Date Night Package',
    description: 'Large pizza + 2 drinks + dessert to share',
    price: 34.99,
    category: 'deal',
    ingredients: ['Large Pizza', '2 Drinks', 'Shared Dessert'],
    sizes: [
      { name: 'Date Night', price: 34.99 }
    ],
    preparationTime: 20
  },
  {
    name: 'Party Platter',
    description: '3 Large pizzas + 12 wings + 6 drinks',
    price: 79.99,
    category: 'deal',
    ingredients: ['3 Large Pizzas', '12 Wings', '6 Drinks'],
    sizes: [
      { name: 'Party Pack', price: 79.99 }
    ],
    preparationTime: 30
  },
  {
    name: 'Student Special',
    description: 'Medium pizza + drink + cookie',
    price: 18.99,
    category: 'deal',
    ingredients: ['Medium Pizza', 'Drink', 'Cookie'],
    sizes: [
      { name: 'Student Deal', price: 18.99 }
    ],
    preparationTime: 18
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
