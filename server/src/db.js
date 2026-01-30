const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || '';
const sslEnabled = process.env.PGSSL === 'true';

const pool = new Pool(
    connectionString
        ? {
            connectionString,
            ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
        }
        : {
            host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
            user: process.env.PGUSER || process.env.DB_USER || 'postgres',
            password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
            database: process.env.PGDATABASE || process.env.DB_NAME || 'abcde',
            port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
            max: 10,
            ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
        }
);

module.exports = pool;
