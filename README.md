<div align="center">
  <h1> Student Management System</h1>
  <p><strong>A complete full-stack web application designed to efficiently manage student records, track academic progress, and streamline administrative tasks.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](#)
  [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://student-managment-system-eta-self.vercel.app)

  <h3>
    <a href="https://student-managment-system-eta-self.vercel.app"> Live Demo</a>
    <span> | </span>
    <a href="#-getting-started">💻 Local Setup</a>
    <span> | </span>
    <a href="#-architecture--design-patterns"> Architecture</a>
  </h3>
</div>

---

## Overview

The **Student Management System** is built to bridge the gap between administrators, teachers, and students. By providing a scalable, secure, and user-friendly platform, this system eliminates manual record-keeping and enhances institutional productivity.

---

## Key Features

- ** Role-Based Authentication:** Secure access control tailored for Admins, Teachers, and Students using JWT.
- ** Interactive Dashboard:** An intuitive, at-a-glance overview of key metrics, attendance rates, and recent institutional activities.
- ** Complete Student Records:** Effortlessly perform CRUD (Create, Read, Update, Delete) operations on student profiles, grades, and fee records.
- ** Fully Responsive Design:** Fluid UI that works flawlessly across desktops, tablets, and mobile devices.
- ** Cloud Database Integration:** Secure, reliable, and fast data storage powered by MongoDB Atlas.

---

## Tech Stack

**Frontend Interface**
- **React.js** - UI Components & State Management
- **HTML5 & CSS3** - Markup & Styling
- **JavaScript (ES6+)** - Client-side scripting

**Backend Architecture**
- **Node.js** - Server Environment
- **Express.js** - RESTful API Framework
- **Mongoose** - Object Data Modeling (ODM)

**Database & Deployment**
- **MongoDB** - NoSQL Database
- **Vercel** - Frontend Hosting & CI/CD Pipeline

---

##  Architecture & Design Patterns

We pride ourselves on writing clean, maintainable, and scalable code. This project strictly adheres to **Software Design and Software Engineering (SDSE)** principles:

* **SOLID Principles:** The backend follows a strict layered architecture (Controllers -> Services -> Repositories) ensuring the Single Responsibility Principle and Dependency Inversion.
* **Encapsulation & Abstraction:** We utilize the **Repository Pattern** to abstract database queries away from the business logic. 
* **Factory Pattern:** We employ a `RepositoryFactory` to centralize the dynamic instantiation of database repositories, ensuring the code remains Open for extension but Closed for modification.

>  *For a deep dive into our design patterns, read the [SDSE Concepts Guide](./docs/sdse_concepts_guide.md).*

---

##  Folder Structure

```text
student_managment_system/
 ┣ backend/            # Server-side logic (Controllers, Services, Factories)
 ┣ database/           # Database connection scripts & seeding
 ┣ diagrams/           # UML, System architecture, and ER diagrams
 ┣ docs/               # Technical documentation & API contracts
 ┣ frontend/           # React.js client-side UI components and styling
 ┣ local_backup/       # Local development backups
 ┣ package.json        # Global project dependencies
 ┗ README.md           # Project documentation
```

---

##  Getting Started

Follow these instructions to set up the project locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/g-tanwar/student_managment_system.git
cd student_managment_system
```

### 2. Install Dependencies
You will need to install packages for both the backend and frontend.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory and configure your secrets:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Run the Application

Open two separate terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev    # Or 'npm start'
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev    # Or 'npm start'
```

The application should now be running at `http://localhost:5173` (or port 3000 depending on Vite/CRA).

---

## System Diagrams

To understand the core workflow, database design, and object interactions, explore our visual models in the `diagrams/` folder:

* **Class Diagram:** OOP structure and relationships.
* **Use Case Diagram:** Role-based access capabilities.
* **Sequence Diagram:** Step-by-step API execution (e.g., Auth Flow).
* **ER Diagram:** MongoDB schema design and entity references.

---

##  Contributing

Contributions, issues, and feature requests are highly welcome! 

1. **Fork** the repository
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the Branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

##  License

This project is open-source and distributed under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it as per the license terms.
