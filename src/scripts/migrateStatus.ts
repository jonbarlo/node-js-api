import { sequelize } from '../config/database';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function checkMigrationStatus() {
  try {
    logger('Checking migration status...');
    
    // Test database connection
    await sequelize.authenticate();
    logger('Database connection established successfully.');
    
    // Check if SequelizeMeta table exists
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'SequelizeMeta'");
    if (!Array.isArray(tables) || tables.length === 0) {
      logger('No SequelizeMeta table found. No migrations have been run.');
      return;
    }
    
    // Get list of executed migrations
    const [executedMigrations] = await sequelize.query("SELECT name FROM SequelizeMeta ORDER BY name");
    const executedMigrationNames = Array.isArray(executedMigrations) 
      ? executedMigrations.map((m: any) => m.name)
      : [];
    
    logger(`Found ${executedMigrationNames.length} executed migration(s):`);
    executedMigrationNames.forEach(name => {
      logger(`  ✅ ${name}`);
    });
    
    // Check if users table exists
    const [userTables] = await sequelize.query("SHOW TABLES LIKE 'users'");
    if (Array.isArray(userTables) && userTables.length > 0) {
      logger('✅ Users table exists');
    } else {
      logger('❌ Users table does not exist');
    }
    
    // Get list of migration files in the directory
    const migrationsDir = path.join('src', 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
        .sort();
      
      if (migrationFiles.length > 0) {
        logger(`\nMigration files in directory (${migrationFiles.length}):`);
        migrationFiles.forEach(file => {
          const jsVersion = file.replace('.ts', '.js');
          const isExecuted = executedMigrationNames.includes(jsVersion) || executedMigrationNames.includes(file);
          const status = isExecuted ? '✅' : '⏳';
          logger(`  ${status} ${file}`);
        });
      }
    }
    
  } catch (error) {
    logger(`Error checking migration status: ${error}`);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

checkMigrationStatus(); 