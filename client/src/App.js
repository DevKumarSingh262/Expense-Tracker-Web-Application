import React, { useState, useEffect, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogIn, UserPlus, Home, PlusCircle, Trash2, Edit, Filter, RefreshCcw } from 'lucide-react'; // Icons

// Backend API URL
const API_BASE_URL = 'http://localhost:5000/api';

// --- AuthContext: For managing authentication state globally ---
const AuthContext = createContext(null);

// --- AuthForm Component: Handles Login and Signup ---
function AuthForm({ onAuthSuccess, isSignUp, setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear error when inputs change
  useEffect(() => {
    setError('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    const endpoint = isSignUp ? `${API_BASE_URL}/auth/signup` : `${API_BASE_URL}/auth/login`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed.');
        return;
      }

      onAuthSuccess(data.token, data.user);
    } catch (err) {
      console.error('Authentication request failed:', err);
      setError('Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-xl border border-indigo-200">
      <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
        {isSignUp ? 'Sign Up' : 'Log In'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        {error && <p className="text-red-500 text-sm italic">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out flex items-center justify-center space-x-2"
          disabled={loading}
          aria-label={isSignUp ? 'Sign Up' : 'Log In'}
        >
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
          <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => setCurrentPage(isSignUp ? 'login' : 'signup')}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition duration-300 ease-in-out"
          disabled={loading}
        >
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

// --- TransactionForm Component: For adding and editing transactions ---
function TransactionForm({ transactionToEdit, onSave, onCancel }) {
  const { token, user } = useContext(AuthContext);
  const [amount, setAmount] = useState(transactionToEdit?.amount || '');
  const [description, setDescription] = useState(transactionToEdit?.description || '');
  const [transactionDate, setTransactionDate] = useState(
    transactionToEdit?.transaction_date ? transactionToEdit.transaction_date.split('T')[0] : ''
  );
  const [category, setCategory] = useState(transactionToEdit?.category || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common categories list for dropdown
  const categories = [
    'Income', 'Food', 'Rent', 'Utilities', 'Transport', 'Entertainment',
    'Shopping', 'Health', 'Education', 'Salary', 'Investment', 'Other'
  ];

  useEffect(() => {
    // Populate form if editing an existing transaction
    if (transactionToEdit) {
      setAmount(transactionToEdit.amount);
      setDescription(transactionToEdit.description);
      setTransactionDate(transactionToEdit.transaction_date.split('T')[0]);
      setCategory(transactionToEdit.category);
    } else {
      // Reset form if not editing
      setAmount('');
      setDescription('');
      setTransactionDate('');
      setCategory('');
    }
    setError(''); // Clear error on edit/new transaction
  }, [transactionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!amount || !description || !transactionDate || !category) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    if (isNaN(amount) || amount === '') {
        setError('Amount must be a valid number.');
        setLoading(false);
        return;
    }

    // Basic date format validation (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(transactionDate)) {
        setError('Date must be in YYYY-MM-DD format.');
        setLoading(false);
        return;
    }

    const transactionData = {
      amount: parseFloat(amount), // Ensure amount is a number
      description,
      transactionDate,
      category,
    };

    try {
      let response;
      if (transactionToEdit) {
        // Update existing transaction
        response = await fetch(`${API_BASE_URL}/transactions/${transactionToEdit.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(transactionData),
        });
      } else {
        // Add new transaction
        response = await fetch(`${API_BASE_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify(transactionData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to save transaction.');
        return;
      }

      onSave(); // Callback to refresh transactions in Dashboard
    } catch (err) {
      console.error('Transaction save error:', err);
      setError('Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-200 mb-6">
      <h3 className="text-2xl font-semibold text-indigo-700 mb-4">
        {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Amount (e.g., -50.00 for expense, 100.00 for income)
          </label>
          <input
            type="number"
            id="amount"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            required
            aria-label="Amount"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            id="description"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            aria-label="Description"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionDate">
            Date
          </label>
          <input
            type="date"
            id="transactionDate"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
            aria-label="Transaction Date"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            aria-label="Category"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500 text-sm italic col-span-full text-center">{error}</p>}
        <div className="col-span-full flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
            disabled={loading}
            aria-label={transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
          >
            {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            <PlusCircle size={20} />
            <span>{transactionToEdit ? 'Update' : 'Add'}</span>
          </button>
          {transactionToEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
              disabled={loading}
              aria-label="Cancel Edit"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// --- TransactionList Component: Displays transactions in a table ---
function TransactionList({ transactions, onEdit, onDelete, loading, error }) {
  if (loading) return <p className="text-center text-gray-600">Loading transactions...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (transactions.length === 0) return <p className="text-center text-gray-600">No transactions found. Add some!</p>;

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-indigo-100 border-b border-indigo-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                {new Date(transaction.transaction_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">{transaction.description}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{transaction.category}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-right">
                <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                  ${parseFloat(transaction.amount).toFixed(2)}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out p-1 rounded-full hover:bg-indigo-100"
                  aria-label={`Edit transaction ${transaction.description}`}
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out p-1 rounded-full hover:bg-red-100"
                  aria-label={`Delete transaction ${transaction.description}`}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- FinancialSummary Component: Displays current balance, total income, and total expenses ---
function FinancialSummary({ summary, loading, error }) {
  if (loading) return <p className="text-center text-gray-600">Loading summary...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Ensure values are numbers and formatted
  const totalIncome = parseFloat(summary.totalIncome || 0).toFixed(2);
  const totalExpenses = parseFloat(summary.totalExpenses || 0).toFixed(2);
  const currentBalance = parseFloat(summary.currentBalance || 0).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-blue-200 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
      <div className="flex flex-col items-center p-3 border-r md:border-r-0 border-b md:border-b-0 md:border-r border-blue-100">
        <h4 className="text-lg font-medium text-gray-700">Total Income</h4>
        <p className="text-3xl font-bold text-green-600">${totalIncome}</p>
      </div>
      <div className="flex flex-col items-center p-3 border-r md:border-r-0 md:border-r border-blue-100">
        <h4 className="text-lg font-medium text-gray-700">Total Expenses</h4>
        <p className="text-3xl font-bold text-red-600">${Math.abs(totalExpenses).toFixed(2)}</p> {/* Display as positive for UI */}
      </div>
      <div className="flex flex-col items-center p-3">
        <h4 className="text-lg font-medium text-gray-700">Current Balance</h4>
        <p className={`text-3xl font-bold ${currentBalance >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
          ${currentBalance}
        </p>
      </div>
    </div>
  );
}

// --- CategoryPieChart Component: Visual summary of expenses/income by category ---
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042', '#A28FDB', '#B39DDB', '#D0A2E8', '#E8A2D0', '#A2E8D0'];

function CategoryPieChart({ data, loading, error }) {
  if (loading) return <p className="text-center text-gray-600">Loading chart data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  
  // Filter out categories with 0 totalAmount for the pie chart and ensure non-negative values for display
  const chartData = data
    .filter(d => Math.abs(parseFloat(d.totalAmount)) > 0)
    .map(d => ({
        name: d.category,
        value: Math.abs(parseFloat(d.totalAmount)) // Use absolute value for chart size
    }));

  if (chartData.length === 0) return <p className="text-center text-gray-600">No data available for chart.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 mb-6">
      <h3 className="text-2xl font-semibold text-purple-700 mb-4 text-center">Breakdown by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${parseFloat(value).toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


// --- Dashboard Component: Main view after login ---
function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [categorySummary, setCategorySummary] = useState([]);
  const [filters, setFilters] = useState({ category: '', startDate: '', endDate: '' });
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [categorySummaryLoading, setCategorySummaryLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [categorySummaryError, setCategorySummaryError] = useState(null);


  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/transactions?${queryParams}`, {
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions');
      }
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setTransactionsError('Failed to load transactions. Please try again.');
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/transactions/summary?${queryParams}`, {
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch summary');
      }
      setSummary(data);
    } catch (err) {
      console.error('Error fetching summary:', err);
      setSummaryError('Failed to load summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchCategorySummary = async () => {
    setCategorySummaryLoading(true);
    setCategorySummaryError(null);
    try {
      // Category summary only uses date filters, not category filter
      const { category, ...dateFilters } = filters; 
      const queryParams = new URLSearchParams(dateFilters).toString();

      const response = await fetch(`${API_BASE_URL}/transactions/category-summary?${queryParams}`, {
        headers: { 'x-auth-token': token },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch category summary');
      }
      setCategorySummary(data);
    } catch (err) {
      console.error('Error fetching category summary:', err);
      setCategorySummaryError('Failed to load category summary. Please try again.');
    } finally {
      setCategorySummaryLoading(false);
    }
  };

  // Fetch data on component mount and when filters change
  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchSummary();
      fetchCategorySummary();
    }
  }, [token, filters]);

  const handleTransactionSave = () => {
    setShowTransactionForm(false); // Hide form
    setTransactionToEdit(null); // Clear edit state
    fetchTransactions(); // Refresh transactions
    fetchSummary(); // Refresh summary
    fetchCategorySummary(); // Refresh category summary
  };

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete transaction');
      }
      handleTransactionSave(); // Refresh data after deletion
    } catch (err) {
      console.error('Delete transaction error:', err);
      alert(err.message || 'Error deleting transaction.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ category: '', startDate: '', endDate: '' });
  };

  const categories = [
    'All', 'Income', 'Food', 'Rent', 'Utilities', 'Transport', 'Entertainment',
    'Shopping', 'Health', 'Education', 'Salary', 'Investment', 'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <FinancialSummary summary={summary} loading={summaryLoading} error={summaryError} />

      {/* Filters and Add Transaction Button */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Filter Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filterCategory">
              Category
            </label>
            <select
              id="filterCategory"
              name="category"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              value={filters.category}
              onChange={handleFilterChange}
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              value={filters.startDate}
              onChange={handleFilterChange}
              aria-label="Filter by start date"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-indigo-500"
              value={filters.endDate}
              onChange={handleFilterChange}
              aria-label="Filter by end date"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClearFilters}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-md shadow transition duration-300 ease-in-out flex items-center space-x-2"
            aria-label="Clear Filters"
          >
            <RefreshCcw size={18} />
            <span>Clear Filters</span>
          </button>
          <button
            onClick={() => {
              setShowTransactionForm(!showTransactionForm);
              setTransactionToEdit(null); // Clear edit state when toggling add form
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow transition duration-300 ease-in-out flex items-center space-x-2"
            aria-label={showTransactionForm ? "Hide Add Transaction Form" : "Show Add Transaction Form"}
          >
            <PlusCircle size={20} />
            <span>{showTransactionForm ? 'Hide Form' : 'Add Transaction'}</span>
          </button>
        </div>
      </div>


      {/* Add/Edit Transaction Form */}
      {showTransactionForm && (
        <TransactionForm
          transactionToEdit={transactionToEdit}
          onSave={handleTransactionSave}
          onCancel={() => {
            setShowTransactionForm(false);
            setTransactionToEdit(null);
          }}
        />
      )}

      {/* Transaction List */}
      <h3 className="text-2xl font-semibold text-indigo-700 mb-4 mt-8">Your Transactions</h3>
      <TransactionList
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        loading={transactionsLoading}
        error={transactionsError}
      />

      {/* Category Pie Chart */}
      <CategoryPieChart data={categorySummary} loading={categorySummaryLoading} error={categorySummaryError} />
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [currentPage, setCurrentPage] = useState(token ? 'dashboard' : 'login'); // Start on dashboard if token exists
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Effect to handle initial auth state check
  useEffect(() => {
    // A more robust check would validate the token with the backend
    // For this assignment, presence of token and user in localStorage is sufficient
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      setToken(localStorage.getItem('token'));
      setUser(JSON.parse(localStorage.getItem('user')));
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
    setIsAuthLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setCurrentPage('dashboard');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-inter">
        <p className="text-gray-700 text-lg">Loading application...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 font-inter">
        <h1 className="text-5xl font-extrabold text-indigo-800 my-8 shadow-text text-center">
          Expense Tracker
        </h1>
        {token && (
          <nav className="w-full max-w-4xl bg-white p-4 rounded-xl shadow-md mb-6 flex justify-between items-center border border-indigo-200">
            <span className="text-lg font-medium text-gray-700 flex items-center space-x-2">
              <Home size={20} />
              <span>Welcome, {user?.email}!</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center space-x-2"
              aria-label="Logout"
            >
              <LogIn size={20} />
              <span>Logout</span>
            </button>
          </nav>
        )}

        <main className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
          {/* Simple Page Routing using switch-case pattern */}
          {(() => {
            switch (currentPage) {
              case 'login':
                return <AuthForm onAuthSuccess={login} isSignUp={false} setCurrentPage={setCurrentPage} />;
              case 'signup':
                return <AuthForm onAuthSuccess={login} isSignUp={true} setCurrentPage={setCurrentPage} />;
              case 'dashboard':
                return <Dashboard />;
              default:
                return <AuthForm onAuthSuccess={login} isSignUp={false} setCurrentPage={setCurrentPage} />;
            }
          })()}
        </main>
      </div>
    </AuthContext.Provider>
  );
}
