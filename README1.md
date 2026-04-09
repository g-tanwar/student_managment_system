# Student Management System

A web-based Student Task Management System — EduPortal — built using 
React.js, Node.js, and MongoDB. This system allows administrators to manage 
students, teachers, attendance, marks, fees and notices efficiently, while 
students can track their own attendance, fees, goals and more.

---

## 🚀 Features

- JWT Based Authentication (Admin/Teacher/Student roles)
- Add / Update / Delete Students
- Teacher Management
- Class and Section Management
- Bulk Attendance Marking
- Marks Management with Exam Scheduling
- Fee Management with Payment History
- Notice Board
- Role Based Access Control (RBAC)
- Student Dashboard (Attendance, Fees, Goals, Notes, Pomodoro)

---

## 🏗️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React.js, React Router  |
| Backend    | Node.js (Express.js)    |
| Database   | MongoDB (Mongoose)      |
| Auth       | JWT                     |
| Validation | Joi                     |
| Styling    | CSS Modules             |

---

## 👥 Team Members & Contributions

| Name             | Role                  |
|------------------|-----------------------|
| Gourav Tanwar    | Backend Developer     |
| Kashika Agarwal  | Docs + UML + Testing  |
| Shrijan Sanidhya | Frontend Developer    |

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
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── layout/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   └── student/
│       ├── services/
│       └── styles/
├── diagrams/
│   ├── class-diagram.txt
│   ├── er-diagram.txt
│   ├── sequence-diagram.txt
│   ├── use-case.txt
│   └── diagram.txt
└── docs/
├── report.md
└── test-cases.md

---

## ⚙️ How to Run

1. Clone the repository
```bash
git clone https://github.com/g-tanwar/student_managment_system.git
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Run the backend
```bash
node src/server.js
```

5. Install frontend dependencies
```bash
cd frontend
npm install
```

6. Run the frontend
```bash
npm run dev
```

---

## 📄 License
MIT License