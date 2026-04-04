# Student Management System

A web-based Student Task Management System built using Node.js, MongoDB, and HTML/CSS/JS. This system allows administrators to manage students, teachers, attendance, marks, fees and notices efficiently.

---

## 🚀 Features

- JWT Based Authentication (Admin/Teacher roles)
- Add / Update / Delete Students
- Teacher Management
- Class and Section Management
- Attendance Tracking (Single + Bulk)
- Marks Management with Exam Scheduling
- Fee Management with Payment History
- Notice Board
- Role Based Access Control (RBAC)

---

## 🏗️ Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | HTML, CSS, JS        |
| Backend   | Node.js (Express.js) |
| Database  | MongoDB              |
| Auth      | JWT                  |
| Validation| Joi                  |

---

## 👥 Team Members & Contributions

| Name            | Role                  |
|-----------------|-----------------------|
| Gourav Tanwar   | Backend Developer     |
| Kashika Agarwal | Docs + UML + Testing  |
| Shrijan Sanidhya| Frontend Developer    |

---

## 📁 Project Structure

student_managment_system/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validations/
├── diagrams/
│   ├── class-diagram.txt
│   ├── er-diagram.txt
│   ├── sequence-diagram.txt
│   ├── use-case.txt
│   └── diagram.txt
├── docs/
│   ├── report.md
│   └── test-cases.md
└── frontend/
    └── index.html

---

## ⚙️ How to Run

1. Clone the repository
git clone https://github.com/g-tanwar/student_managment_system.git

2. Install dependencies
npm install

3. Setup environment variables
cp .env.example .env

4. Run the backend
node src/server.js

5. Open frontend/index.html in browser

---

## 📄 License
MIT License