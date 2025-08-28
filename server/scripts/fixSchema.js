/* One-time schema fix: drop tables with wrong FK types so Sequelize sync can recreate them.
   Safe to run multiple times; it will ignore if table doesn't exist. */

const { sequelize } = require('../config/database');

async function dropIfExists(tableName) {
  const qi = sequelize.getQueryInterface();
  try {
    const tables = await qi.showAllTables();
    const exists = tables
      .map((t) => (typeof t === 'object' && t.tableName ? t.tableName : t))
      .map((t) => (typeof t === 'string' ? t.replace(/"/g, '') : t));

    if (exists.includes(tableName) || exists.includes(tableName.toLowerCase())) {
      console.log(`Dropping table: ${tableName} ...`);
      await qi.dropTable(tableName);
      console.log(`Dropped: ${tableName}`);
    } else {
      console.log(`Table not found (skip): ${tableName}`);
    }
  } catch (err) {
    console.error(`Error dropping ${tableName}:`, err.message);
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected. Running schema fix...');

    // Drop tables with FK type mismatches so sync can recreate with UUID FKs
    await dropIfExists('Messages');
    await dropIfExists('ContentBlocks');

    console.log('Schema fix completed.');
  } catch (e) {
    console.error('Schema fix failed:', e);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
