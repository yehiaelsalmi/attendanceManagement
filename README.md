# Employee Attendance and Payroll Management System

A full-stack web application for managing employee attendance, work hours, and payroll calculations. Built with React.js frontend and Node.js backend.

## Team Members
- Adham Khaled
- Yehia Amr
- Hania Amr
- Jana Amr

## Features

### User Management
- User registration with email and password
- Secure login system with JWT authentication
- User profile management
- Role-based access control

### Attendance Tracking
- Real-time check-in and check-out functionality
- Automatic timestamp recording
- Work hours calculation
- Attendance history view

### Payroll Management
- Hourly rate configuration per employee
- Automatic balance calculation based on work hours
- Monthly work history tracking
- Payroll statistics and reports

### Dashboard
- Overview of total hours worked
- Number of days worked
- Average hours per day
- Current balance based on hourly rate

## Tech Stack

### Frontend
- React.js
- Material-UI for responsive design
- Axios for API requests
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure
```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   └── App.js        # Main application component
│   └── package.json
│
└── BE/                    # Backend application
    ├── modules/          # Feature modules
    │   ├── user/        # User management
    │   └── workday/     # Attendance tracking
    ├── DB/              # Database models and connection
    └── index.js         # Server entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd BE
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/user/signup` - Register new user
- POST `/api/user/signin` - User login

### Attendance
- POST `/api/workday/checkIn` - Record check-in
- POST `/api/workday/checkOut` - Record check-out
- GET `/api/workday/getWorkHistory` - Get work history

### User Management
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update user profile

## Security Features
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- Input validation
- Error handling

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License. 