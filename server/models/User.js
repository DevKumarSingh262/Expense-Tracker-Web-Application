// server/models/User.js

const { pool } = require('../config/db'); // Import the database connection pool
const bcrypt = require('bcryptjs'); // For hashing passwords

/**
 * Finds a user by their email address.
 * @param {string} email The email of the user to find.
 * @returns {Promise<object|null>} A promise that resolves with the user object if found, or null otherwise.
 */
const findUserByEmail = async (email) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error finding user by email:', error.message);
    throw error; // Re-throw the error for handling in the calling function
  }
};

/**
 * Creates a new user in the database.
 * @param {string} email The user's email.
 * @param {string} password The user's plain text password.
 * @returns {Promise<object>} A promise that resolves with the newly created user's ID and email.
 */
const createUser = async (email, password) => {
  try {
    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const [result] = await pool.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    // Return the ID of the newly inserted user
    return { id: result.insertId, email: email };
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
};

/**
 * Compares a plain text password with a hashed password.
 * @param {string} plainPassword The plain text password provided by the user.
 * @param {string} hashedPassword The hashed password stored in the database.
 * @returns {Promise<boolean>} A promise that resolves to true if passwords match, false otherwise.
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing password:', error.message);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  comparePassword,
};
