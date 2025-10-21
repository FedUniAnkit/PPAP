const bcrypt = require('bcryptjs');
const { sequelize } = require('./server/config/database');

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create admin user
    await sequelize.query(`
      INSERT INTO "Users" (
        "id", "name", "email", "password", "role", "isActive", 
        "createdAt", "updatedAt", "accountStatus"
      ) VALUES (
        gen_random_uuid(), 
        'Admin User', 
        'admin@test.com', 
        '${hashedPassword}', 
        'admin', 
        true, 
        NOW(), 
        NOW(), 
        'active'
      ) ON CONFLICT ("email") DO NOTHING;
    `);
    
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();
