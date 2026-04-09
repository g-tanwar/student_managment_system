# Student Management System — Project Report

## 1. Problem Statement

Educational institutions face difficulty in managing student data manually. 
This system provides a complete digital solution — EduPortal — to manage 
students, teachers, attendance, marks, fees, and notices through a modern 
web application with role-based access.

---

## 2. Features

### Admin Features:
- JWT Based Authentication
- Student CRUD with soft delete
- Teacher Management with linked User account
- Class and Section Management
- Subject Management with Teacher assignment
- Bulk Attendance Marking with duplicate prevention
- Exam Scheduling with Subject-wise marks
- Fee Assignment (individual + class-wide) with payment history
- Notice Board with audience targeting (ALL/STUDENTS/TEACHERS)
- Role Based Access Control (RBAC)

### Student Features:
- View own Attendance with summary
- View own Fee status and payment history
- Upload Fee Receipt
- Notes Management
- Pomodoro Focus Timer
- Schedule Management
- Goals Tracker with progress tracking
- Profile Management

---

## 3. Team Contributions

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Kashika Agarwal | Docs + UML + Testing | Report, Diagrams, Test Cases, README |
| Gourav Tanwar | Backend Developer | Node.js API, MongoDB Models, Services, Routes, JWT Auth |
| Shrijan Sanidhya | Frontend Developer | React UI, Admin Pages, Student Dashboard, API Integration |

---

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) |
| Validation | Joi |
| Styling | CSS Modules |

---

## 5. Architecture

3-Tier Architecture:
- Tier 1: Frontend (React.js SPA)
- Tier 2: Backend (Node.js + Express.js REST API)
- Tier 3: Database (MongoDB Atlas)

MVC Pattern:
- Model: Mongoose Schemas
- View: React Components (SPA)
- Controller: Express Controllers + Services

---

## 6. Frontend Structure

- Auth: Login/Signup with JWT token storage
- Layout: Sidebar + TopNav with role-based routing
- Admin Pages: Student Management, Bulk Attendance, Exams, Fees, Marks
- Student Pages: Dashboard, Attendance, Fees, Notes, Pomodoro, Schedule, Goals, Profile
- Services: api.js (Axios), attendanceService, feeService, studentService
- Hooks: useAuth (AuthContext with JWT persistence)

---

## 7. OOP Concepts Used

- Encapsulation: Password hidden in User model, JWT token in localStorage
- Inheritance: User → Teacher (linked via userId)
- Abstraction: Service layer abstracts API calls from React components
- Polymorphism: Different report generation for marks, attendance, fees

---

## 8. Design Patterns Used

- Singleton Pattern: MongoDB connection (connectDB), Axios instance (api.js)
- MVC Pattern: Models, Controllers, Services separation
- Context Pattern: AuthContext for global auth state (React)
- Observer Pattern: useEffect hooks for data fetching

---

## 9. SOLID Principles

- Single Responsibility: Each service file handles one entity only
- Open/Closed: Middleware can be extended without modifying routes
- Dependency Inversion: Controllers depend on services, not directly on models
- Interface Segregation: Separate service files for attendance, fee, student