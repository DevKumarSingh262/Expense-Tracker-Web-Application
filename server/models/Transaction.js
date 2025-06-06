// server/models/Transaction.js

const { pool } = require('../config/db'); // Import the database connection pool

/**
 * Creates a new transaction in the database.
 * @param {number} userId The ID of the user who owns the transaction.
 * @param {number} amount The transaction amount (positive for income, negative for expense).
 * @param {string} description A description of the transaction.
 * @param {string} transactionDate The date of the transaction (YYYY-MM-DD format).
 * @param {string} category The category of the transaction.
 * @returns {Promise<object>} A promise that resolves with the newly created transaction's ID.
 */
const createTransaction = async (userId, amount, description, transactionDate, category) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (user_id, amount, description, transaction_date, category) VALUES (?, ?, ?, ?, ?)',
      [userId, amount, description, transactionDate, category]
    );
    return { id: result.insertId };
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    throw error;
  }
};

/**
 * Retrieves all transactions for a specific user, with optional filtering and sorting.
 * @param {number} userId The ID of the user whose transactions to retrieve.
 * @param {object} [filters={}] Optional filters (e.g., { category: 'Food', startDate: '2023-01-01', endDate: '2023-01-31' }).
 * @returns {Promise<Array<object>>} A promise that resolves with an array of transaction objects.
 */
const getTransactions = async (userId, filters = {}) => {
  let query = 'SELECT * FROM transactions WHERE user_id = ?';
  const params = [userId];

  // Apply category filter if provided
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  // Apply date range filters if provided
  if (filters.startDate) {
    query += ' AND transaction_date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    query += ' AND transaction_date <= ?';
    params.push(filters.endDate);
  }

  // Always sort by newest first (transaction_date DESC, then by id DESC for stable sorting)
  query += ' ORDER BY transaction_date DESC, id DESC';

  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error getting transactions:', error.message);
    throw error;
  }
};

/**
 * Updates an existing transaction.
 * @param {number} transactionId The ID of the transaction to update.
 * @param {number} userId The ID of the user who owns the transaction (for security).
 * @param {object} updates An object containing fields to update (e.g., { amount: 150.00, description: 'New description' }).
 * @returns {Promise<boolean>} A promise that resolves to true if the transaction was updated, false otherwise.
 */
const updateTransaction = async (transactionId, userId, updates) => {
  let query = 'UPDATE transactions SET ';
  const params = [];
  const updateFields = [];

  // Dynamically build the update query based on provided fields
  for (const key in updates) {
    if (Object.hasOwnProperty.call(updates, key)) {
      updateFields.push(`${key} = ?`);
      params.push(updates[key]);
    }
  }

  if (updateFields.length === 0) {
    return false; // No fields to update
  }

  query += updateFields.join(', ');
  query += ' WHERE id = ? AND user_id = ?'; // Ensure user owns the transaction
  params.push(transactionId, userId);

  try {
    const [result] = await pool.execute(query, params);
    return result.affectedRows > 0; // Returns true if a row was updated
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    throw error;
  }
};

/**
 * Deletes a transaction.
 * @param {number} transactionId The ID of the transaction to delete.
 * @param {number} userId The ID of the user who owns the transaction (for security).
 * @returns {Promise<boolean>} A promise that resolves to true if the transaction was deleted, false otherwise.
 */
const deleteTransaction = async (transactionId, userId) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?', // Ensure user owns the transaction
      [transactionId, userId]
    );
    return result.affectedRows > 0; // Returns true if a row was deleted
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    throw error;
  }
};

/**
 * Calculates the total income, total expenses, and current balance for a user.
 * @param {number} userId The ID of the user.
 * @param {object} [filters={}] Optional filters (e.g., { category: 'Food', startDate: '2023-01-01', endDate: '2023-01-31' }).
 * @returns {Promise<object>} An object containing totalIncome, totalExpenses, and currentBalance.
 */
const getFinancialSummary = async (userId, filters = {}) => {
  let query = `
    SELECT
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS totalIncome,
        SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS totalExpenses,
        SUM(amount) AS currentBalance
    FROM transactions
    WHERE user_id = ?
  `;
  const params = [userId];

  // Apply category filter if provided
  if (filters.category) {
    query += ' AND category = ?';
    params.push(filters.category);
  }

  // Apply date range filters if provided
  if (filters.startDate) {
    query += ' AND transaction_date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    query += ' AND transaction_date <= ?';
    params.push(filters.endDate);
  }

  try {
    const [rows] = await pool.execute(query, params);
    // Ensure that if no transactions exist, sums are 0 instead of null
    const summary = rows[0];
    return {
      totalIncome: summary.totalIncome || 0,
      totalExpenses: summary.totalExpenses || 0, // This will be a negative value for expenses
      currentBalance: summary.currentBalance || 0,
    };
  } catch (error) {
    console.error('Error getting financial summary:', error.message);
    throw error;
  }
};


/**
 * Retrieves a summary of transactions by category for a specific user, with optional filtering.
 * This is useful for generating pie charts.
 * @param {number} userId The ID of the user whose transactions to retrieve.
 * @param {object} [filters={}] Optional filters (e.g., { startDate: '2023-01-01', endDate: '2023-01-31' }).
 * @returns {Promise<Array<object>>} A promise that resolves with an array of objects like { category: 'Food', totalAmount: -150.00 }.
 */
const getCategorySummary = async (userId, filters = {}) => {
  let query = `
    SELECT category, SUM(amount) AS totalAmount
    FROM transactions
    WHERE user_id = ?
  `;
  const params = [userId];

  // Apply date range filters if provided
  if (filters.startDate) {
    query += ' AND transaction_date >= ?';
    params.push(filters.startDate);
  }
  if (filters.endDate) {
    query += ' AND transaction_date <= ?';
    params.push(filters.endDate);
  }

  query += ' GROUP BY category';
  query += ' ORDER BY category ASC'; // Order by category for consistent results

  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error getting category summary:', error.message);
    throw error;
  }
};


module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
  getCategorySummary,
};
