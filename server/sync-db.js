const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    
    // Force sync will drop tables and recreate them
    await sequelize.sync({ force: true });
    
    console.log('✅ Database synced successfully!');
    
    // Create a test admin user
    const { User } = require('./models');
    await User.create({
      name: 'Admin User',
      email: 'admin@komorebipizza.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('👤 Created test admin user:');
    console.log('   Email: admin@komorebipizza.com');
    console.log('   Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
