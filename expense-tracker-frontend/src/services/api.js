import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

const apiService = {
    // Auth endpoints
    register: (email, password) => {
        return api.post('/auth/register', { email, password });
    },

    login: (email, password) => {
        return api.post('/auth/login', { email, password });
    },

    // Transaction endpoints
    getTransactions: () => {
        return api.get('/transactions');
    },

    addTransaction: (transactionData) => {
        return api.post('/transactions', transactionData);
    },

    updateTransaction: (id, transactionData) => {
        return api.put(`/transactions/${id}`, transactionData);
    },

    deleteTransaction: (id) => {
        return api.delete(`/transactions/${id}`);
    },

    // Dashboard endpoints
    getDashboardSummary: () => {
        return api.get('/dashboard/summary');
    },

    getCategoryBreakdown: () => {
        return api.get('/dashboard/categories');
    }
};

export default apiService;