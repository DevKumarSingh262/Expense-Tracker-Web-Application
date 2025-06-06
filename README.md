# Expense Tracker App

A simple full-stack application to track income/expenses with visual reports.

## Features
- ✅ User login/signup
- ➕ Add income & expenses
- 📊 View spending by category (charts)
- 🔍 Filter transactions by date/category

## Screenshots
| Login Page | Dashboard |
|------------|-----------|
| ![Login](login.png) | ![Dashboard](dashboard.png) |

## Technologies
**Frontend:** React, Tailwind CSS  
**Backend:** Node.js, Express  
**Database:** MySQL  

## Quick Start
1. **Clone the repo**
   ```bash
   git clone https://github.com/DevKumarSingh262/Expense-Tracker-Web-Application.git
   cd expense-tracker
    ```
2. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env  # Edit with your DB credentials
   ```
3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
4. Run both servers
   - Backend: ```npm start ```(in /server)
   - Frontend: ```npm start```(in /client)

## API Reference

   **Endpoint**	      | **Method** |  **Description**    |
------------------------|------------|---------------------|
```/api/auth/signup```	| POST	    | User registration   |
------------------------|------------|---------------------|
```/api/transactions```	| GET	       | Get all transactions|

