// server/routes/transactions.js

const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
  getCategorySummary
} = require('../models/Transaction'); // Import Transaction model functions
const authMiddleware = require('../middleware/auth'); // We will create this middleware next

/**
 * @route POST /api/transactions
 * @desc Add a new transaction
 * @access Private
 */
router.post('/', authMiddleware, async (req, res) => {
  const { amount, description, transactionDate, category } = req.body;
  const userId = req.user.id; // User ID from auth middleware

  // Basic validation
  if (!amount || !description || !transactionDate || !category) {
    return res.status(400).json({ message: 'Please enter all required fields' });
  }

  // Validate amount is a number
  if (isNaN(amount)) {
    return res.status(400).json({ message: 'Amount must be a number' });
  }

  // Basic date format validation (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(transactionDate)) {
    return res.status(400).json({ message: 'Transaction date must be in YYYY-MM-DD format' });
  }

  try {
    const newTransaction = await createTransaction(userId, amount, description, transactionDate, category);
    res.status(201).json({
      message: 'Transaction added successfully',
      transaction: {
        id: newTransaction.id,
        amount,
        description,
        transactionDate,
        category,
        userId
      }
    });
  } catch (error) {
    console.error('Add transaction error:', error.message);
    res.status(500).json({ message: 'Server error during transaction creation' });
  }
});

/**
 * @route GET /api/transactions
 * @desc Get all transactions for the authenticated user, with optional filters
 * @access Private
 */
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id; // User ID from auth middleware
  const { category, startDate, endDate } = req.query; // Get filters from query parameters

  const filters = {
    category,
    startDate,
    endDate
  };

  try {
    const transactions = await getTransactions(userId, filters);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error.message);
    res.status(500).json({ message: 'Server error retrieving transactions' });
  }
});

/**
 * @route PUT /api/transactions/:id
 * @desc Update a transaction
 * @access Private
 */
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params; // Transaction ID from URL
  const userId = req.user.id; // User ID from auth middleware
  const updates = req.body; // Fields to update

  // Basic validation for updates
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  // Validate amount if provided
  if (updates.amount && isNaN(updates.amount)) {
    return res.status(400).json({ message: 'Amount must be a number if provided' });
  }

  // Basic date format validation (YYYY-MM-DD) if provided
  if (updates.transactionDate && !/^\d{4}-\d{2}-\d{2}$/.test(updates.transactionDate)) {
    return res.status(400).json({ message: 'Transaction date must be in YYYY-MM-DD format if provided' });
  }


  try {
    const wasUpdated = await updateTransaction(id, userId, updates);
    if (!wasUpdated) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Update transaction error:', error.message);
    res.status(500).json({ message: 'Server error during transaction update' });
  }
});

/**
 * @route DELETE /api/transactions/:id
 * @desc Delete a transaction
 * @access Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params; // Transaction ID from URL
  const userId = req.user.id; // User ID from auth middleware

  try {
    const wasDeleted = await deleteTransaction(id, userId);
    if (!wasDeleted) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error.message);
    res.status(500).json({ message: 'Server error during transaction deletion' });
  }
});


/**
 * @route GET /api/transactions/summary
 * @desc Get financial summary (total income, expenses, balance) for the authenticated user
 * @access Private
 */
router.get('/summary', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { category, startDate, endDate } = req.query; // Get filters from query parameters

  const filters = {
    category,
    startDate,
    endDate
  };

  try {
    const summary = await getFinancialSummary(userId, filters);
    res.status(200).json(summary);
  } catch (error) {
    console.error('Get financial summary error:', error.message);
    res.status(500).json({ message: 'Server error retrieving financial summary' });
  }
});

/**
 * @route GET /api/transactions/category-summary
 * @desc Get transaction summary by category for the authenticated user (for pie chart)
 * @access Private
 */
router.get('/category-summary', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query; // Get filters from query parameters

  const filters = {
    startDate,
    endDate
  };

  try {
    const categorySummary = await getCategorySummary(userId, filters);
    res.status(200).json(categorySummary);
  } catch (error) {
    console.error('Get category summary error:', error.message);
    res.status(500).json({ message: 'Server error retrieving category summary' });
  }
});


module.exports = router;
