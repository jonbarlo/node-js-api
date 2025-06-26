# Setting Up NodeJS API Project from scratch
## This is a guide to set up a NodeJS API project from scratch using Express, TypeScript, and other tools.
# Step 1: Initialize the Project
```bash
npm init -y
```
# Step 2: Install Dependencies
```bash
npm install express body-parser cors dotenv nodemon
npm install --save-dev typescript ts-node @types/node @types/express @types/cors
```
# Step 3: Create TypeScript Configuration
```bash
touch tsconfig.json
```

# Step 4: Update `tsconfig.json` file and Add the following content
<!-- ```typescript
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
``` -->
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
    }
}
```
# Step 5: Create Project Structure
```bash
mkdir src
touch src/index.ts
mkdir src/routes
touch src/routes/index.ts
mkdir src/controllers
touch src/controllers/index.ts
mkdir src/middleware
touch src/middleware/errorHandler.ts
mkdir src/models
touch src/models/index.ts
mkdir src/config
touch src/config/index.ts
mkdir src/utils
touch src/utils/logger.ts
```
Create a `.env` file in the root directory and add your environment variables:
```env
APP_NAME=MyNodeAPI
VERSION=1.0.0
PORT=3000
```

# Step 6: Create `nodemon.json`
Create a `nodemon.json` file in the root directory:
```json
{
  "watch": ["src"],
  "ext": "ts",
  "ignore": ["src/**/*.spec.ts"],
  "exec": "ts-node src/index.ts"
}
```
# Step 7: Update `package.json` Scripts
Add the following scripts to your `package.json`:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon",
    "build": "tsc"
  }
}
```

# Step 8: Create Basic Route
In `src/routes/items.ts`, add the following code:
```typescript
import { Router } from 'express';
const itemRouter = Router();
import { ItemController } from "../controllers/itemController";
itemRouter.get('/items', ItemController.getAll);
export default itemRouter;
```
# Step 9: Create Basic Controller
In `src/controllers/items.ts`, add the following code:
```typescript
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export class ItemController {

    // regular function
    public static async getAll(req: Request, res: Response) 
    {
        logger('API endpoint /items was called...');
        res.send('List of items');
    }
}
```
# Step 10: Create Basic Express Server
In `src/index.ts`, add the following code:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import routes from './routes';
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
# Step 11: Create Basic Error Handler Middleware
In `src/middleware/errorHandler.ts`, add the following code:
```typescript
import { Request, Response, NextFunction } from 'express';
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};
```
# Step 12: Use Error Handler Middleware
In `src/index.ts`, add the error handler middleware:
```typescript
import { errorHandler } from './middleware/errorHandler';
app.use(errorHandler);
```
# Step 13: Create Basic Logger Utility
In `src/utils/logger.ts`, add the following code:
```typescript
export const logger = (message: string) => {
    console.log(`[${new Date().toISOString()}] ${message}`);
};
```
# Step 14: Use Logger Utility
In `src/index.ts`, import and use the logger utility:
```typescript
import { logger } from './utils/logger';
logger(`Server is running on port ${PORT}`);
```
# Step 15: Create Basic Model
In `src/models/index.ts`, add the following code:
```typescript
export interface User {
    id: number;
    name: string;
    email: string;
}
export const users: User[] = [
    { id: 1, name: 'John Doe', email: 'johndoe@email.com' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@email.com' }
];
export const getUsers = () => {
    return users;
};
export const getUserById = (id: number) => {
    return users.find(user => user.id === id);
};
```
# Step 16: Create Basic Config
In `src/config/index.ts`, add the following code:
```typescript
export const config = {
    appName: process.env.APP_NAME || 'NodeJS API',
    version: process.env.VERSION || '1.0.0',
    port: process.env.PORT || 3000
};
```
# Step 17: Use Config in Server
In `src/index.ts`, import and use the config:
```typescript
import { config } from './config';
app.listen(config.port, () => {
    logger(`${config.appName} is running on port ${config.port}`);
});
```
# Step 18: Build and Run the Project
```bash
npm run build
npm start
```
# Step 19: Run in Development Mode
```bash
npm run dev
```
# Step 20: Test the API
You can test the API using Postman or any other API testing tool by sending a GET request to `http://localhost:3031/api/`.
You should see the response "Hello World!".
# Step 21: Add Unit Tests
To add unit tests, you can use a testing framework like Jest. First, install Jest and its TypeScript support:
```bash
npm install --save-dev jest ts-jest @types/jest
```
Then, create a `jest.config.js` file in the root directory:
What the Updated Jest Config Includes:
testMatch: Explicitly tells Jest to look for files ending in .spec.ts or .test.ts
moduleFileExtensions: Specifies which file extensions Jest should handle
transform: Ensures TypeScript files are properly transformed
collectCoverageFrom: Sets up coverage collection (optional but useful)
```javascript
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/dist/'],
    testMatch: [
        '**/__tests__/**/*.ts',
        '**/?(*.)+(spec|test).ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.test.ts'
    ]
};
```
# Step 22: Create a Test File
Create a test file in `src/controllers/index.spec.ts`:
```typescript
import { helloWorld } from './index';
import { Request, Response } from 'express';
describe('helloWorld Controller', () => {
    it('should return Hello World from Controller!', () => {
        const req = {} as Request;
        const res = {
            send: jest.fn(),
        } as unknown as Response;

        helloWorld(req, res);
        expect(res.send).toHaveBeenCalledWith('Hello World from Controller!');
    });
});
```
# Step 23: Add Test Script
Add a test script to your `package.json`:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
# Step 24: Run Tests
You can run the tests using the following command:
```bash
npm test
```
# Step 25: Add Linting
To add linting, you can use ESLint. First, install ESLint and its TypeScript support:
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
Then, create an ESLint configuration file `.eslintrc.js` in the root directory:
```javascript
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
```
# Step 26: Add Lint Script
Add a lint script to your `package.json`:
```json
{
  "scripts": {
    "lint": "eslint 'src/**/*.{ts,tsx}'"
  }
}
```
# Step 27: Run Linting
You can run the linting using the following command:
```bash
npm run lint
```
# Step 28: Add Prettier for Code Formatting
To add Prettier for code formatting, first install Prettier and its TypeScript support
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```
Then, create a Prettier configuration file `.prettierrc` in the root directory:
```json
{
    "singleQuote": true,
    "trailingComma": "es5",
    "printWidth": 80,
    "tabWidth": 4
}
```
# Step 29: Update ESLint Configuration for Prettier
Update your `.eslintrc.js` file to include Prettier:
```javascript
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
    },
};
```
# Step 30: Add Format Script
Add a format script to your `package.json`:
```json
{
  "scripts": {
    "format": "prettier --write 'src/**/*.{ts,tsx}'"
  }
}
```
# Step 31: Run Prettier
You can run Prettier to format your code using the following command:
```bash
npm run format
```
# Conclusion
You have successfully set up a NodeJS API project from scratch using Express, TypeScript, and other tools. You can now expand this project by adding more routes, controllers, and features as needed.
Feel free to customize the project structure and add more functionalities based on your requirements.
# Additional Steps
- You can add more routes in `src/routes/index.ts` and create corresponding controllers in `src/controllers/`.
- You can implement more middleware in `src/middleware/` for authentication, logging, etc.
- You can create more models in `src/models/` for different entities in your application.
- You can enhance the error handling middleware to handle different types of errors and return appropriate responses.
- You can add unit tests and integration tests to ensure the reliability of your API.