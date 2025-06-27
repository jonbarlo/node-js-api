import { sequelize } from '../config/database';
import { down } from '../migrations/20250626235343-create-users-table';
import { logger } from '../utils/logger';

async function undoMigration() {
  try {
    logger('Starting migration undo...');
    
    // Test database connection
    await sequelize.authenticate();
    logger('Database connection established successfully.');
    
    // Run the down migration
    await down(sequelize.getQueryInterface());
    logger('Migration undo completed successfully!');
    
    process.exit(0);
  } catch (error: any) {
    logger(`Migration undo failed: ${error}`);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

undoMigration(); 