const { Pool } = require('pg');

// Using default PostgreSQL superuser credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'yatri123',
  port: 5432,
});

async function testConnection() {
  console.log('🔍 Testing PostgreSQL connection...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // List all databases
    const dbs = await client.query('SELECT datname FROM pg_database');
    console.log('\n📂 Available databases:');
    console.table(dbs.rows);
    
    // List all users
    const users = await client.query('SELECT usename FROM pg_user');
    console.log('\n👥 Database users:');
    console.table(users.rows);
    
    client.release();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === '28P01') {
      console.log('🔑 Authentication failed. Please check the password for user "postgres"');
    } else {
      console.log('Error details:', error);
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testConnection();
