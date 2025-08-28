const { Pool } = require('pg');

// Common PostgreSQL default credentials to try
const credentialsList = [
  { user: 'postgres', password: 'postgres', desc: 'Default postgres user with default password' },
  { user: 'postgres', password: 'admin', desc: 'Common admin password' },
  { user: 'postgres', password: 'root', desc: 'Common root password' },
  { user: 'postgres', password: 'password', desc: 'Common password' },
  { user: 'yatri', password: 'yatri123', desc: 'Yatri credentials from config' },
  { user: 'postgres', password: 'yatri123', desc: 'Postgres with yatri password' }
];

async function testCredentials(credentials) {
  const pool = new Pool({
    user: credentials.user,
    host: 'localhost',
    database: 'postgres',
    password: credentials.password,
    port: 5432,
    connectionTimeoutMillis: 2000
  });

  try {
    const client = await pool.connect();
    console.log(`✅ Success! Connected as ${credentials.user}`);
    
    // List all databases
    const dbs = await client.query('SELECT datname FROM pg_database');
    console.log('\n📂 Available databases:');
    console.table(dbs.rows);
    
    // Check if komorebi_pizza exists
    const komorebiExists = dbs.rows.some(db => db.datname === 'komorebi_pizza');
    console.log(`\n🔍 komorebi_pizza database exists: ${komorebiExists ? '✅' : '❌'}`);
    
    if (komorebiExists) {
      // Connect to komorebi_pizza
      const komorebiPool = new Pool({
        user: credentials.user,
        host: 'localhost',
        database: 'komorebi_pizza',
        password: credentials.password,
        port: 5432
      });
      
      try {
        const komorebiClient = await komorebiPool.connect();
        console.log('✅ Connected to komorebi_pizza database!');
        
        // List tables
        const tables = await komorebiClient.query(
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
        );
        
        console.log('\n📋 Tables in komorebi_pizza:');
        console.table(tables.rows);
        
        komorebiClient.release();
      } catch (e) {
        console.log('⚠️ Could not connect to komorebi_pizza:', e.message);
      } finally {
        await komorebiPool.end();
      }
    }
    
    client.release();
    return true;
  } catch (error) {
    console.log(`❌ Failed as ${credentials.user}: ${error.message}`);
    return false;
  } finally {
    await pool.end();
  }
}

async function tryAllCredentials() {
  console.log('🔍 Testing PostgreSQL credentials...\n');
  
  for (const creds of credentialsList) {
    console.log(`🔑 Trying ${creds.desc} (${creds.user}:${'*'.repeat(creds.password.length)})...`);
    const success = await testCredentials(creds);
    if (success) {
      console.log('\n✨ Found working credentials!');
      console.log(`Username: ${creds.user}`);
      console.log(`Password: ${creds.password}`);
      return;
    }
    console.log('');
  }
  
  console.log('\n❌ Could not connect with any of the tested credentials.');
  console.log('Please check your PostgreSQL installation and credentials.');
}

tryAllCredentials();
