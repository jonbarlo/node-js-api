import { sequelize } from '../config/database';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function runAllMigrations() {
  try {
    logger('Starting all pending migrations...');
    
    // Test database connection
    await sequelize.authenticate();
    logger('Database connection established successfully.');
    
    // Check if SequelizeMeta table exists using database-agnostic approach
    const dialect = sequelize.getDialect();
    let hasMetaTable = false;
    
    if (dialect === 'mysql' || dialect === 'mariadb') {
      const [tables] = await sequelize.query("SHOW TABLES LIKE 'SequelizeMeta'");
      hasMetaTable = Array.isArray(tables) && tables.length > 0;
    } else if (dialect === 'mssql') {
      const [tables] = await sequelize.query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'SequelizeMeta' AND TABLE_TYPE = 'BASE TABLE'
      `);
      hasMetaTable = Array.isArray(tables) && tables.length > 0;
    }
    
    if (!hasMetaTable) {
      logger('Creating SequelizeMeta table...');
      
      // Create SequelizeMeta table with database-agnostic syntax
      if (dialect === 'mysql' || dialect === 'mariadb') {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS \`SequelizeMeta\` (
            \`name\` VARCHAR(255) NOT NULL,
            PRIMARY KEY (\`name\`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
      } else if (dialect === 'mssql') {
        await sequelize.query(`
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SequelizeMeta' AND xtype='U')
          CREATE TABLE [SequelizeMeta] (
            [name] NVARCHAR(255) NOT NULL,
            PRIMARY KEY ([name])
          );
        `);
      }
      
      logger('✅ SequelizeMeta table created successfully.');
    }
    
    // Get list of migration files
    const migrationsDir = path.join('src', 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
      .map(file => {
        const parts = file.split('-');
        const timestamp = parts[0] || '0';
        return {
          name: file,
          path: path.join(migrationsDir, file),
          timestamp
        };
      })
      .sort((a, b) => (a.timestamp || '0').localeCompare(b.timestamp || '0'));
    
    if (migrationFiles.length === 0) {
      logger('No migration files found.');
      return;
    }
    
    logger(`Found ${migrationFiles.length} migration file(s):`);
    migrationFiles.forEach(file => {
      logger(`  📄 ${file.name}`);
    });
    
    // Get list of executed migrations
    const [executedMigrations] = await sequelize.query("SELECT name FROM SequelizeMeta ORDER BY name");
    const executedMigrationNames = Array.isArray(executedMigrations) 
      ? executedMigrations.map((m: any) => m.name)
      : [];
    
    logger(`Executed migrations: ${executedMigrationNames.length}`);
    
    // Find pending migrations - check both .js and .ts versions
    const pendingMigrations = migrationFiles.filter(file => {
      const jsVersion = file.name.replace('.ts', '.js');
      const tsVersion = file.name;
      return !executedMigrationNames.includes(jsVersion) && !executedMigrationNames.includes(tsVersion);
    });
    
    if (pendingMigrations.length === 0) {
      logger('✅ All migrations are up to date!');
      return;
    }
    
    logger(`Found ${pendingMigrations.length} pending migration(s):`);
    pendingMigrations.forEach(file => {
      logger(`  ⏳ ${file.name}`);
    });
    
    // Run each pending migration
    for (const migrationFile of pendingMigrations) {
      try {
        logger(`Running migration: ${migrationFile.name}`);
        
        // Import and run the migration using relative path
        const migrationPath = path.join('..', 'migrations', migrationFile.name);
        const migration = await import(migrationPath);
        
        if (typeof migration.up === 'function') {
          await migration.up(sequelize.getQueryInterface());
          
          // Record the migration as executed (use .js extension for consistency)
          const recordedName = migrationFile.name.replace('.ts', '.js');
          await sequelize.query("INSERT INTO SequelizeMeta (name) VALUES (?)", {
            replacements: [recordedName]
          });
          
          logger(`✅ Migration completed: ${migrationFile.name}`);
        } else {
          logger(`❌ Migration ${migrationFile.name} does not export an 'up' function`);
        }
      } catch (error) {
        logger(`❌ Migration failed: ${migrationFile.name} - ${error}`);
        throw error;
      }
    }
    
    logger('🎉 All pending migrations completed successfully!');
    
  } catch (error) {
    logger(`Migration failed: ${error}`);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runAllMigrations(); 