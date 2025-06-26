export const config = {
    appName: process.env.APP_NAME || 'NodeJS API',
    version: process.env.VERSION || '1.0.0',
    port: process.env.PORT || 3031,
    env: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DB_URL || 'nodb://localhost:???/myapp'
};