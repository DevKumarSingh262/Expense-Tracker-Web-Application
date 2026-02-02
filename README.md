# Expense Tracker App
A simple full-stack application to track income/expenses with visual reports.

## Features
- ✅ User login/signup with JWT authentication
- ➕ Add, edit, and delete income & expenses
- 📊 View spending by category (pie charts)
- 🔍 Filter transactions by date/category

## Screenshots
| Login Page | Dashboard |
|------------|-----------|
| ![Login](https://github.com/DevKumarSingh262/Expense-Tracker-Web-Application/blob/main/screenshots/Log-in.png?raw=true) | ![Dashboard](https://github.com/DevKumarSingh262/Expense-Tracker-Web-Application/blob/main/screenshots/Dashboard(expense_tracker).png?raw=true)|

## Technologies
**Frontend:** React, React Router, Axios  
**Backend:** Spring Boot, Spring Security, JWT  
**Database:** H2 (in-memory) / MySQL

## Quick Start
1. **Clone the repo**
   ```bash
   git clone https://github.com/DevKumarSingh262/Expense-Tracker-Web-Application.git
   cd expense-tracker
    ```
2. **Setup Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run  # Runs on http://localhost:8080
   ```
3. **Setup Frontend**
   ```bash
   cd expense-tracker-frontend
   npm install
   npm start  # Runs on http://localhost:3000
   ```
4. Run both servers
   - Backend: ```mvn spring-boot:run``` (in /backend)
   - Frontend: ```npm start``` (in /expense-tracker-frontend)

## API Reference
|   **Endpoint**	      | **Method** |  **Description**    |
|-----------------------|------------|---------------------|
|```/api/auth/register```| POST	    | User registration   |
|```/api/auth/login```   | POST      | User login (returns JWT) |
|```/api/transactions```| GET	       | Get all transactions|
|```/api/transactions```| POST       | Add new transaction |
|```/api/transactions/{id}```| PUT   | Update transaction  |
|```/api/transactions/{id}```| DELETE| Delete transaction  |
|```/api/dashboard/summary```| GET   | Get income/expense summary |
|```/api/dashboard/categories```| GET| Get category breakdown |

## Common Issues & Fixes
- **Database connection failed:** Verify H2 is configured correctly or update `application.properties` for MySQL
- **CORS errors:** Ensure `CorsConfig.java` allows `http://localhost:3000`
- **401 Unauthorized:** Check JWT token is valid and included in request headers

## Contributing
1. Fork the project
2. Create your branch (```git checkout -b feature/your-feature```)
3. Commit changes (```git commit -m 'Add some feature'```)
4. Push to branch (```git push origin feature/your-feature```)
5. Open a Pull Request

## License
ISC