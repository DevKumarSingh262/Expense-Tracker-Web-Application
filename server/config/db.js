// server/config/db.js

const mysql = require('mysql2/promise'); // Using the promise-based API for async/await
require('dotenv').config(); // Load environment variables from .env file

// Database connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, // Whether to wait for a connection to be available
  connectionLimit: 10,      // Maximum number of connections in the pool
  queueLimit: 0             // Maximum number of requests the pool will queue before returning an error
});

/**
 * Tests the database connection.
 * @returns {Promise<void>} A promise that resolves if the connection is successful, rejects otherwise.
 */
const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection(); // Get a connection from the pool
    console.log('Successfully connected to the MySQL database!');
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    // It's crucial here to exit if the DB connection fails, as the app can't function without it.
    process.exit(1); 
  }
};

module.exports = {
  pool,
  testDbConnection
};
