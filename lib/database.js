import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';
import { DatabaseSchema } from './database-schema.js';

let pool;
let databaseAvailable = false;

async function createPool() {
  if (!pool) {
    try {
      console.log("DB Config being used:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD ? '***' : 'undefined',
        port: process.env.DB_PORT
      });

      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: 'utf8mb4'
      });

      databaseAvailable = true;
      console.log('✅ Database pool created successfully');

    } catch (error) {
      console.error('❌ Failed to create database pool:', error.message);
      databaseAvailable = false;
      throw error;
    }
  }
  return pool;
}

// ADD THESE MISSING FUNCTIONS AND EXPORTS:

export async function initializeDatabase() {
  try {
    console.log('Initializing database connection...');
    
    // Create pool (database already exists, no need to create it)
    await createPool();
    
    // Test connection
    const connectionOk = await DatabaseSchema.checkConnection();
    if (!connectionOk) {
      throw new Error('Database connection test failed');
    }
    
    // Initialize tables
    await DatabaseSchema.initializeTables();
    
    console.log('Database initialized successfully');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    databaseAvailable = false;
    // Don't throw error - allow app to continue without analytics
    console.warn('Application will continue without database analytics');
  }
}

export function isDatabaseAvailable() {
  return databaseAvailable;
}

// Export the pool - this is what's missing!
export { pool };
