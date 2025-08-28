const { Pool } = require('pg');
const { sequelize } = require('./config/database');

async function setupDatabase() {
  // First, connect to the default 'postgres' database to create our database
  const adminPool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  const client = await adminPool.connect();
  
  try {
    console.log('🔍 Checking if komorebi_pizza database exists...');
    const dbCheck = await client.query("SELECT 1 FROM pg_database WHERE datname = 'komorebi_pizza'");
    
    if (dbCheck.rows.length === 0) {
      console.log('📦 Creating komorebi_pizza database...');
      await client.query('CREATE DATABASE komorebi_pizza');
      console.log('✅ Database created successfully!');
    } else {
      console.log('ℹ️ Database already exists');
    }
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await adminPool.end();
  }

  // Now connect to our database and sync models
  console.log('\n🔄 Connecting to komorebi_pizza database...');
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to komorebi_pizza database!');
    
    // Sync all models
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('✅ Database models synced successfully!');
    
    // Import models
    const { User } = require('./models');
    
    // Create default admin user
    console.log('👤 Creating default admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@komorebipizza.com',
      password: 'admin123',
      role: 'admin'
    });
    
    console.log('\n✨ Setup completed successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@komorebipizza.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

setupDatabase();
