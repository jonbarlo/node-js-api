import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

function createMigration() {
  try {
    const migrationName = process.argv[2];
    
    if (!migrationName) {
      logger('Error: Migration name is required');
      logger('Usage: npm run migrate:create <migration-name>');
      process.exit(1);
    }
    
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const fileName = `${timestamp}-${migrationName}.ts`;
    const filePath = path.join('src', 'migrations', fileName);
    
    const migrationTemplate = `import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add your migration code here
  // Example:
  // await queryInterface.createTable('table_name', {
  //   id: {
  //     type: DataTypes.INTEGER,
  //     autoIncrement: true,
  //     primaryKey: true,
  //   },
  //   // ... other columns
  // });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Add your rollback code here
  // Example:
  // await queryInterface.dropTable('table_name');
}
`;
    
    fs.writeFileSync(filePath, migrationTemplate);
    logger(`Migration file created: ${fileName}`);
    logger(`Path: ${filePath}`);
    
  } catch (error) {
    logger(`Error creating migration: ${error}`);
    process.exit(1);
  }
}

createMigration(); 