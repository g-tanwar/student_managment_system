# Student Management System — Project Report

## 1. Problem Statement

Educational institutions face difficulty in managing student data manually. 
This system provides a digital solution to manage students, teachers, courses, 
attendance, marks, fees, and notices efficiently through a REST API backend.

---

## 2. Features

- JWT Based Authentication (Admin/Teacher roles)
- Student CRUD with soft delete (Archive)
- Teacher Management with linked User account
- Class and Section Management
- Subject Management with Teacher assignment
- Attendance Tracking (Single + Bulk) with duplicate prevention
- Exam Scheduling with Subject-wise marks
- Fee Management with payment history tracking
- Notice Board with audience targeting
- Role Based Access Control (RBAC)
- Input Validation using Joi
- Centralized Error Handling

---

## 3. Team Contributions

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Gourav Tanwar | Backend Developer | Node.js API, MongoDB Models, Services, Routes |
| Kashika Agarwal | Docs + UML + Testing | Report, Diagrams, Test Cases, README |
| Shrijan Sanidhya | Frontend Developer | UI, Forms, Dashboard |

---

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) |
| Validation | Joi |

---

## 5. Architecture

3-Tier Architecture:
- Tier 1: Frontend (UI)
- Tier 2: Backend (Node.js + Express.js)
- Tier 3: Database (MongoDB)

MVC Pattern:
- Model: Mongoose Schemas (User, Student, Teacher, Class, Section, Subject, Attendance, Exam, Mark, Fee, Notice)
- View: Frontend (HTML/CSS/JS)
- Controller: Express Controllers + Services

## 6. OOP Concepts Used

- Encapsulation: Data hidden in Mongoose models (password hidden by default)
- Inheritance: User → Teacher (linked via userId)
- Abstraction: Service layer abstracts business logic from controllers
- Polymorphism: Different report generation for marks, attendance, fees

## 7. Design Patterns Used

- Singleton Pattern: MongoDB connection (connectDB)
- MVC Pattern: Models, Controllers, Services separation

## 8. SOLID Principles

- Single Responsibility: Each service handles one entity only
- Open/Closed: Middleware can be extended without modifying routes
- Dependency Inversion: Controllers depend on services, not directly on models