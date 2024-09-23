import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a pool of connections to handle multiple users
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',    
  user: process.env.DB_USER || 'root',         
  password: process.env.DB_PASSWORD || '',     
  database: process.env.DB_NAME || 'railway',  
  waitForConnections: true,                    
  connectionLimit: 10,                         
  queueLimit: 0                                
});

// Function to get a connection from the pool
export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('Error getting DB connection:', error);
    throw error;
  }
};

// Function to close all connections in the pool
export const closeConnection = async () => {
  try {
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing DB connection:', error);
  }
};

// Sample query function (you can use this for testing)
export const testQuery = async () => {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SELECT 1 + 1 AS solution');
    console.log('The solution is: ', rows);
  } catch (error) {
    console.error('Query Error: ', error);
  } finally {
    connection.release();  // Always release connection back to the pool
  }
};

// Export the pool to use it in other parts of your app
export default pool;
