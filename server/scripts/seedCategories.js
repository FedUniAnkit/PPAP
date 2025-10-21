const { Category } = require('../models');

const seedCategories = async () => {
  try {
    const categories = [
      { name: 'pizza', displayName: 'Pizza', description: 'Delicious pizzas', sortOrder: 1 },
      { name: 'drink', displayName: 'Drinks', description: 'Refreshing beverages', sortOrder: 2 },
      { name: 'dessert', displayName: 'Desserts', description: 'Sweet treats', sortOrder: 3 },
      { name: 'side', displayName: 'Sides', description: 'Appetizers and sides', sortOrder: 4 },
      { name: 'appetizer', displayName: 'Appetizers', description: 'Starters and appetizers', sortOrder: 5 },
      { name: 'deal', displayName: 'Deals', description: 'Special offers and deals', sortOrder: 6 }
    ];

    for (const category of categories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }

    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

module.exports = seedCategories;
