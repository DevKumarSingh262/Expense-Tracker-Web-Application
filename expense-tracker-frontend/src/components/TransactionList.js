import React, { useState } from 'react';
import apiService from '../services/api';
import EditTransactionModal from './EditTransactionModal';
import './TransactionList.css';

const TransactionList = ({ transactions, onUpdate }) => {
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric' 
        });
    };

    const formatAmount = (amount, type) => {
        const formattedAmount = Math.abs(amount).toFixed(2);
        return type === 'EXPENSE' ? `-$${formattedAmount}` : `$${formattedAmount}`;
    };

    const getAmountClass = (type) => {
        return type === 'EXPENSE' ? 'amount-expense' : 'amount-income';
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleDelete = (transactionId) => {
        setShowDeleteConfirm(transactionId);
    };

    const confirmDelete = async () => {
        try {
            await apiService.deleteTransaction(showDeleteConfirm);
            setShowDeleteConfirm(null);
            onUpdate(); // Refresh data after delete
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Failed to delete transaction');
        }
    };

    const handleEditComplete = () => {
        setEditingTransaction(null);
        onUpdate();
    };

    return (
        <div className="transaction-list-container">
            <h2>Your Transactions</h2>
            
            {transactions.length === 0 ? (
                <div className="no-transactions">
                    <p>No transactions found</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>DESCRIPTION</th>
                                <th>CATEGORY</th>
                                <th>AMOUNT</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{formatDate(transaction.date)}</td>
                                    <td>{transaction.description}</td>
                                    <td>{transaction.category}</td>
                                    <td className={getAmountClass(transaction.type)}>
                                        {formatAmount(transaction.amount, transaction.type)}
                                    </td>
                                    <td>
                                        <div className="action-icons">
                                            <button 
                                                className="icon-btn edit-btn" 
                                                title="Edit"
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.5 2.5L15.5 5.5M1 17L1 13L11 3L15 7L5 17H1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            <button 
                                                className="icon-btn delete-btn" 
                                                title="Delete"
                                                onClick={() => handleDelete(transaction.id)}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 4H15M14 4L13.5 15C13.5 15.5 13 16 12.5 16H5.5C5 16 4.5 15.5 4.5 15L4 4M7 1H11M7 7V13M11 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onUpdate={handleEditComplete}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
                    <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Transaction</h3>
                        <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                        <div className="delete-confirm-actions">
                            <button 
                                className="cancel-btn" 
                                onClick={() => setShowDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="delete-confirm-btn" 
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionList;