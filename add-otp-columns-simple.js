const { sequelize } = require('./server/config/database');

async function addOTPColumns() {
  try {
    console.log('Adding OTP columns to Users table...');
    
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "otpCode" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "otpExpires" TIMESTAMP WITH TIME ZONE;
    `);
    
    console.log('✅ OTP columns added successfully');
    
    // Verify columns were added
    const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Users' 
      AND column_name IN ('otpCode', 'otpExpires')
      ORDER BY column_name;
    `);
    
    console.log('OTP columns found:', results.map(r => r.column_name));
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addOTPColumns();
