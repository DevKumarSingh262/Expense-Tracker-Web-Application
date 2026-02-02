import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import CategoryChart from '../components/CategoryChart';
import './Dashboard.css';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userEmail = localStorage.getItem('userEmail') || 'User';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryRes, transactionsRes, categoriesRes] = await Promise.all([
                apiService.getDashboardSummary(),
                apiService.getTransactions(),
                apiService.getCategoryBreakdown()
            ]);

            setSummary(summaryRes.data);
            setTransactions(transactionsRes.data);
            setCategories(categoriesRes.data.categories || {});
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    const handleAddTransaction = () => {
        setShowModal(true);
    };

    const handleTransactionAdded = () => {
        fetchDashboardData();
        setShowModal(false);
    };

    const handleClearFilters = () => {
        setFilterCategory('All');
        setStartDate('');
        setEndDate('');
    };

    const getFilteredTransactions = () => {
        let filtered = [...transactions];

        // Filter by category
        if (filterCategory !== 'All') {
            filtered = filtered.filter(t => t.category === filterCategory);
        }

        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate));
        }

        return filtered;
    };

    const uniqueCategories = ['All', ...new Set(transactions.map(t => t.category))];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header-main">
                <h1>Expense Tracker</h1>
            </div>

            <div className="dashboard-content">
                {/* Welcome Bar */}
                <div className="welcome-bar">
                    <div className="welcome-text">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 2L3 7V17H7V12H13V17H17V7L10 2Z" fill="#333" stroke="#333" strokeWidth="1.5"/>
                        </svg>
                        Welcome, {userEmail}!
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 3L17 3L17 7M17 3L10 10M7 3H5C3.89543 3 3 3.89543 3 5V13C3 14.1046 3.89543 15 5 15H13C14.1046 15 15 14.1046 15 13V10" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Logout
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="summary-container">
                    <div className="summary-card">
                        <div className="summary-label">Total Income</div>
                        <div className="summary-value income">${summary.totalIncome.toFixed(2)}</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-label">Total Expenses</div>
                        <div className="summary-value expense">${summary.totalExpense.toFixed(2)}</div>
                    </div>
                    <div className="summary-card">
                        <div className="summary-label">Current Balance</div>
                        <div className="summary-value balance">${summary.balance.toFixed(2)}</div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="filter-container">
                    <h3>Filter Transactions</h3>
                    <div className="filter-row">
                        <div className="filter-group">
                            <label>Category</label>
                            <select 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Start Date</label>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="dd-mm-yyyy"
                            />
                        </div>
                        <div className="filter-group">
                            <label>End Date</label>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="dd-mm-yyyy"
                            />
                        </div>
                    </div>
                    <div className="filter-actions">
                        <button className="clear-btn" onClick={handleClearFilters}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 7H6L9 4M6 7L9 10M2 13V5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11C14 12.1046 13.1046 13 12 13H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Clear Filters
                        </button>
                        <button className="add-transaction-btn" onClick={handleAddTransaction}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3V8M8 8V13M8 8H13M8 8H3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Add Transaction
                        </button>
                    </div>
                </div>

                {/* Transaction List */}
                <TransactionList 
                    transactions={getFilteredTransactions()} 
                    onUpdate={fetchDashboardData}
                />

                {/* Category Chart */}
                {Object.keys(categories).length > 0 && (
                    <CategoryChart categories={categories} />
                )}
            </div>

            {showModal && (
                <AddTransactionModal 
                    onClose={() => setShowModal(false)}
                    onTransactionAdded={handleTransactionAdded}
                />
            )}
        </div>
    );
};

export default Dashboard;