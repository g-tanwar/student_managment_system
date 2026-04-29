#  Student Management System (EduPortal) — Project Report

**Live Demo:** [student-managment-system-eta-self.vercel.app](https://student-managment-system-eta-self.vercel.app)  
**Repository:** [GitHub - g-tanwar/student_managment_system](https://github.com/g-tanwar/student_managment_system)

---

## 1. Problem Statement

Educational institutions face difficulty in managing student data manually. This system provides a complete digital solution — **EduPortal** — to manage students, teachers, attendance, marks, fees, and notices through a modern, responsive web application with role-based access. It bridges the communication gap and automates administrative workflows.

---

## 2. Key Features

###  Admin Features:
- **Authentication:** JWT-Based secure login.
- **Student Management:** Complete CRUD operations with soft delete functionality.
- **Teacher Management:** Linked User accounts for faculty members.
- **Academic Setup:** Class, Section, and Subject Management with specific Teacher assignments.
- **Attendance Module:** Bulk Attendance Marking with duplicate entry prevention.
- **Examination System:** Exam Scheduling with Subject-wise marks entry.
- **Fee Management:** Fee Assignment (individual + class-wide) along with detailed payment history tracking.
- **Notice Board:** Audience-targeted announcements (ALL / STUDENTS / TEACHERS).
- **Access Control:** Strict Role-Based Access Control (RBAC) ensuring data security.

###  Student Features:
- **Dashboard:** Personalized overview of academic status.
- **Attendance Tracking:** View own attendance records along with a generated summary.
- **Fee Portal:** View fee status, payment history, and upload fee receipts directly.
- **Productivity Tools:** - Notes Management
  - Pomodoro Focus Timer for study sessions
  - Schedule Management
  - Goals Tracker with visual progress tracking
- **Profile:** Manage personal profile details.

---

## 3. Team Contributions

| Member Name | Role | Core Responsibilities |
|-------------|------|-----------------------|
| **Kashika Agarwal** | Docs + UML + Testing | Project Report, ER/System Diagrams, Test Cases, README creation |
| **Gourav Tanwar** | Backend Developer | Node.js API, MongoDB Models, Services, Routes, JWT Authentication |
| **Shrijan Sanidhya** | Frontend Developer | React UI, Admin Pages, Student Dashboard, API Integration |

---

## 4. Technology Stack

| Layer / Domain | Technology Used |
|----------------|-----------------|
| **Frontend** | React.js, React Router, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Validation** | Joi |
| **Styling** | CSS Modules |
| **Deployment** | Vercel (Frontend/Fullstack hosting) |

---

## 5. System Architecture

**3-Tier Architecture:**
- **Tier 1 (Presentation):** Frontend React.js Single Page Application (SPA).
- **Tier 2 (Application):** Backend Node.js + Express.js REST API.
- **Tier 3 (Data):** Database hosted on MongoDB Atlas.

**MVC Design Pattern:**
- **Model:** Mongoose Schemas defining database collections.
- **View:** React Components rendering the SPA UI.
- **Controller:** Express Controllers handling business logic, supported by Service layers.

---

## 6. Project & Folder Structure

The application codebase is modularly divided to separate client and server concerns:

```text
 student_managment_system
 ┣  backend/        # Node.js server, API routes, controllers, and services
 ┣  database/       # Database connection scripts and seeders
 ┣  diagrams/       # UML, ER Diagrams, and architecture layouts
 ┣  docs/           # Documentation, including this project report
 ┣  frontend/       # React.js application, components, and pages
 ┣  local_backup/   # Local environment backups
 ┗  package.json    # Root dependencies

 ```
 ---

## 7. Frontend Structure & Routing
Auth Module: Login/Signup with secure JWT token storage in local environment.

Layout: Persistent Sidebar and TopNav implementing role-based routing constraints.

Admin Pages: Dedicated screens for Student Management, Bulk Attendance, Exams, Fees, and Marks.

Student Pages: Interactive Dashboard, Attendance viewer, Fees module, Notes, Pomodoro, Schedule, Goals, and Profile settings.

Services: Centralized api.js (using Axios), attendanceService, feeService, studentService.

Hooks: Custom useAuth hook utilizing Context API for global JWT persistence.

---

## 8. Object-Oriented Programming (OOP) Concepts Applied
Encapsulation: Sensitive data (like passwords) hidden within User models; JWT tokens encapsulated in client storage.

Inheritance: General User identity inherited by Teacher profiles (linked via userId).

Abstraction: The Service layer abstracts complex external API calls away from the React UI components.

Polymorphism: Utilizing varied report generation methods and structures for different modules (marks, attendance, fees).

---

## 9. Software Design Patterns
Singleton Pattern: Assured single instance for MongoDB connection (connectDB) and Axios HTTP client (api.js).

MVC Pattern: Clear separation of Models, Controllers, and Services in the backend.

Context Pattern: AuthContext utilized for managing global authentication state across the React app.

Observer Pattern: React useEffect hooks acting as observers for state changes and data fetching.

---

## 10. SOLID Principles Implemented
Single Responsibility (SRP): Each service file is strictly responsible for handling operations related to one entity only (e.g., student, fee).

Open/Closed (OCP): Middleware configurations allow the application to be extended (e.g., adding new auth strategies) without modifying existing core routes.

Dependency Inversion (DIP): Controllers depend on intermediate service modules rather than directly interacting with database models.

Interface Segregation (ISP): Distinct, specialized service files exist for attendance, fees, and students to prevent monolithic dependency.
