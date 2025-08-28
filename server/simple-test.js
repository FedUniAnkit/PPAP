const { Sequelize } = require('sequelize');

async function testConnection() {
  const sequelize = new Sequelize('postgres', 'yatri', 'yatri123', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    logging: console.log
  });

  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
