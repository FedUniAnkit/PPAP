const { Pool } = require('pg');
require('dotenv').config();

const config = {
  user: 'postgres',
  host: 'localhost',
  database: 'komorebi_pizza',
  password: 'yatri123',
  port: 5432,
};

async function testConnection() {
  const pool = new Pool(config);
  
  try {
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database!');
    
    // Check if Users table exists
    const tablesRes = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    
    console.log('\n📋 Available tables:');
    console.table(tablesRes.rows);
    
    // Check if Users table exists
    const usersTable = tablesRes.rows.find(t => t.table_name === 'Users');
    
    if (usersTable) {
      console.log('\n👥 Found Users table. Checking contents...');
      try {
        const usersRes = await client.query('SELECT * FROM "Users" LIMIT 5');
        console.log(`Found ${usersRes.rows.length} users:`);
        console.table(usersRes.rows.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          created_at: u.createdAt
        })));
      } catch (err) {
        console.error('❌ Error querying Users table:', err.message);
      }
    } else {
      console.log('\nℹ️ Users table does not exist. Would you like to create it?');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === '3D000') {
      console.log('\n💡 The database does not exist. Creating it now...');
      await createDatabase();
    } else if (error.code === '28P01') {
      console.log('\n🔑 Authentication failed. Please check your username and password.');
    } else {
      console.log('\n🔍 Error details:', error);
    }
  } finally {
    await pool.end();
  }
}

async function createDatabase() {
  // Connect to default 'postgres' database to create our database
  const adminPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'yatri123',
    port: 5432,
    database: 'postgres'  // Connect to default database
  });
  
  const client = await adminPool.connect();
  
  try {
    // Create the database
    await client.query('CREATE DATABASE komorebi_pizza');
    console.log('✅ Created database: komorebi_pizza');
    
    console.log('\n🔑 Database created successfully! Please run the application again.');
    
  } catch (error) {
    if (error.code === '42P04') {
      console.log('ℹ️ Database already exists');
    } else {
      console.error('❌ Error creating database:', error.message);
    }
  } finally {
    client.release();
    await adminPool.end();
  }
}

// Run the test
testConnection();
