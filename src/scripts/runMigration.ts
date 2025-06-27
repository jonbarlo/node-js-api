import { sequelize } from '../config/database';
import { up } from '../migrations/20250626235343-create-users-table';
import { logger } from '../utils/logger';

async function runMigration() {
  try {
    logger('Starting migration...');
    
    // Test database connection
    await sequelize.authenticate();
    logger('Database connection established successfully.');
    
    // Run the migration
    await up(sequelize.getQueryInterface());
    logger('Migration completed successfully!');
    
    process.exit(0);
  } catch (error: any) {
    // Check if it's a duplicate key error (table/index already exists)
    if (error.message && error.message.includes('Duplicate key name')) {
      logger('Migration already completed - table and index already exist.');
      logger('Migration status: ✅ COMPLETED');
      process.exit(0);
    } else {
      logger(`Migration failed: ${error}`);
      process.exit(1);
    }
  }
}

runMigration(); 