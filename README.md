Expense Tracker Application
This is a full-stack personal finance tracking web application that allows users to manage their income and expenses, view a financial summary, and visualize spending habits by category.

Table of Contents
Features

Technologies Used

Getting Started

Prerequisites

Backend Setup

Frontend Setup

Running the Application

API Endpoints

Deployment

Contributing

License

Features
User Authentication: Secure signup and login for individual users.

Transaction Management:

Add new income and expense transactions.

View a list of all transactions.

Update existing transaction details.

Delete transactions.

Filtering: Filter transactions by category, start date, and end date.

Financial Summary: Display current balance, total income, and total expenses.

Category Visualization: A pie chart showing the breakdown of expenses/income by category.

Technologies Used
Backend
Node.js: JavaScript runtime for building the server-side application.

Express.js: Web framework for Node.js, used for building RESTful APIs.

MySQL: Relational database for storing user and transaction data.

mysql2/promise: Node.js MySQL client with Promises API.

bcryptjs: For hashing and comparing user passwords securely.

jsonwebtoken (JWT): For secure user authentication and authorization.

cors: Middleware for enabling Cross-Origin Resource Sharing.

dotenv: For loading environment variables from a .env file.

nodemon (devDependencies): Utility that monitors for changes in your source and automatically restarts your server.

Frontend
React.js: JavaScript library for building the user interface.

Tailwind CSS: A utility-first CSS framework for rapid UI development and styling.

Recharts: A composable charting library built with React and D3.

Lucide React: A set of beautiful and customizable open-source icons.

create-react-app: Tool for setting up a new React project quickly.

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js: Make sure you have Node.js (and npm, which comes with Node.js) installed. You can download it from nodejs.org.

MySQL Server: You need a running MySQL server instance. You can download and install MySQL Community Server or use a tool like XAMPP/WAMP (for Windows) or MAMP (for macOS).

Git: For cloning the repository.

Postman (Optional but Recommended): For testing API endpoints directly.

Backend Setup
Clone the repository (or navigate to your expense-tracker root if you already have it):

# If your repo is structured with client and server folders at the root
git clone [YOUR_REPOSITORY_URL]
cd expense-tracker


Navigate into the server directory:

cd server


Install backend dependencies:

npm install


Create a .env file: In the server directory, create a file named .env and add your MySQL and JWT configurations. Replace the placeholder values.

DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=expense_tracker_db
DB_PORT=3306 

JWT_SECRET=supersecretjwtkeythatshouldbeverylongandrandom


DB_USER, DB_PASSWORD: Your MySQL username and password.

DB_NAME: The name you want for your database (e.g., expense_tracker_db).

JWT_SECRET: A long, random string. You can generate one online.

Create the MySQL Database and Tables:

Open your MySQL client (e.g., MySQL Workbench, command line, or phpMyAdmin).

Execute the following SQL commands to create the database and tables:

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


Test Backend Connection:

Start the backend server to ensure it connects to the database successfully.

npm start


You should see Successfully connected to the MySQL database! and Server running on port 5000. Keep this terminal running.

Frontend Setup
Navigate into the client directory (in a new terminal window):

cd ../client # If you're in the 'server' directory
# OR
# cd C:\Users\dks31\expense-tracker\client # If you're starting fresh


Install frontend dependencies:

npm install


Configure Tailwind CSS (CDN Approach):

Delete any existing tailwind.config.js and postcss.config.js files in the client directory if they exist.

Open src/index.css and ensure it does NOT contain @tailwind base; @tailwind components; @tailwind utilities;. If it does, remove those lines.

Open public/index.html and add the following lines just before the closing </head> tag:

<!-- Tailwind CSS CDN - This will bypass PostCSS build errors -->
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
<style>
  /* Apply Inter font globally */
  body {
    font-family: 'Inter', sans-serif;
  }
</style>


Save public/index.html.

Update API_BASE_URL in src/App.js:

If you plan to deploy your backend to a live server later, you'll need to update const API_BASE_URL = 'http://localhost:5000/api'; to your deployed backend's URL (e.g., 'https://your-backend-app.render.com/api'). For local development, http://localhost:5000/api is correct.

Running the Application
Ensure your Backend server is running (from "Backend Setup" step 6, npm start in the server directory).

Start the Frontend development server: In your client directory (in a separate terminal window), run:

npm start


This will usually open your application in your default web browser at http://localhost:3000.

API Endpoints
The backend provides the following RESTful API endpoints:

Authentication
POST /api/auth/signup - Register a new user.

POST /api/auth/login - Authenticate user and get a JWT token.

Transactions (Requires x-auth-token header for authorization)
POST /api/transactions - Add a new transaction.

GET /api/transactions - Get all transactions for the authenticated user (supports category, startDate, endDate query filters).

PUT /api/transactions/:id - Update a specific transaction.

DELETE /api/transactions/:id - Delete a specific transaction.

GET /api/transactions/summary - Get total income, expenses, and current balance (supports date and category filters).

GET /api/transactions/category-summary - Get transaction summary by category (supports date filters, for pie chart data).

Deployment
This project consists of a separate frontend (React) and backend (Node.js/Express.js) and requires a database (MySQL).

Frontend (React App): Can be deployed to static site hosting services like Netlify or Vercel. You would build the React app (npm run build) and deploy the resulting build folder.

Backend (Node.js/Express.js API): Requires a server-side hosting platform like Render, Heroku, or AWS Elastic Beanstalk.

Database (MySQL): Requires a hosted MySQL service, such as those provided by cloud platforms (AWS RDS, Google Cloud SQL) or specialized database hosting (e.g., PlanetScale).

Note: For the deployed frontend to communicate with the deployed backend, ensure the API_BASE_URL in client/src/App.js is updated to the live backend URL, and configure CORS on your backend to allow requests from your frontend's deployed domain.

Contributing
Feel free to fork this repository, make improvements, and submit pull requests.

License
This project is licensed under the ISC License.
