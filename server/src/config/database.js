// backend/config/database.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    // ===== TIMEZONE SETTINGS (IST) =====
    timezone: '+05:30',
    dateStrings: ['DATE', 'DATETIME', 'TIMESTAMP'],

    // ===== LARGE NUMBER SUPPORT =====
    supportBigNumbers: true,
    bigNumberStrings: true,
});

// Test DB connection on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        process.exit(1);
    }
};

testConnection();

export default pool;
