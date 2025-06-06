# 💰 Expense Tracker Application

This is a full-stack personal finance tracking web application that allows users to manage their income and expenses, view a financial summary, and visualize spending habits by category.

## 📸 Screenshots

> Add screenshots to your repository under a `/screenshots` folder and update the paths below.

| Dashboard | Add Transaction | Category Chart |
|-----------|------------------|----------------|
| ![Dashboard](screenshots/dashboard.png) | ![Add](screenshots/add-transaction.png) | ![Chart](screenshots/chart.png) |

## ✨ Features

- Secure User Authentication (Signup/Login)
- Add Income & Expense Transactions
- View, Update, and Delete Transactions
- Filter by Category, Start Date, and End Date
- Display Financial Summary (Balance, Income, Expenses)
- Pie Chart Breakdown by Category

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- mysql2/promise
- bcryptjs
- jsonwebtoken (JWT)
- cors
- dotenv
- nodemon

### Frontend
- React.js
- Tailwind CSS (CDN-based)
- Recharts
- Lucide React
- create-react-app

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- MySQL Server (XAMPP/WAMP/MAMP or standalone)
- Git
- Postman (optional)

### Backend Setup

```bash
git clone [YOUR_REPOSITORY_URL]
cd expense-tracker/server
npm install
Create a .env file inside server/ and add:

env
Copy
Edit
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker_db
DB_PORT=3306
JWT_SECRET=supersecurelongsecret
Now create the database and tables:

sql
Copy
Edit
CREATE DATABASE IF NOT EXISTS expense_tracker_db;

USE expense_tracker_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
Then run the backend server:

bash
Copy
Edit
npm start
You should see messages like:

pgsql
Copy
Edit
✅ Successfully connected to the MySQL database!
🚀 Server running on port 5000
Frontend Setup
Open a new terminal, navigate to the frontend:

bash
Copy
Edit
cd ../client
npm install
Configure Tailwind CSS (CDN Approach)
Delete tailwind.config.js and postcss.config.js if present.

Remove these lines from src/index.css if they exist:

css
Copy
Edit
@tailwind base;
@tailwind components;
@tailwind utilities;
In public/index.html, before the closing </head> tag, add:

html
Copy
Edit
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Inter', sans-serif;
  }
</style>
Update src/App.js:

js
Copy
Edit
const API_BASE_URL = 'http://localhost:5000/api';
Start the React development server:

bash
Copy
Edit
npm start
Your app will be available at: http://localhost:3000

🔌 API Endpoints
All protected routes require x-auth-token header.

Auth
POST /api/auth/signup – Register new user

POST /api/auth/login – Login user and receive JWT

Transactions
POST /api/transactions – Add new transaction

GET /api/transactions – Fetch all transactions (supports filters)

PUT /api/transactions/:id – Update a transaction

DELETE /api/transactions/:id – Delete a transaction

GET /api/transactions/summary – Get income, expense, balance

GET /api/transactions/category-summary – Get pie chart data by category

🌐 Deployment
Frontend (React)
Use Netlify or Vercel. Run:

bash
Copy
Edit
npm run build
Deploy the client/build/ folder.

Backend (Node/Express)
Use Render, Railway, Heroku, or other Node-compatible cloud platforms.

MySQL
Use a cloud-hosted MySQL database like AWS RDS, PlanetScale, or Google Cloud SQL.

Make sure to update API_BASE_URL in the frontend with your live backend URL and configure CORS in your backend for deployed frontend domain.

🤝 Contributing
Fork the repository

Create a new branch: git checkout -b feature-name

Commit your changes: git commit -m "Add new feature"

Push to the branch: git push origin feature-name

Open a pull request

📄 License
This project is licensed under the ISC License.
