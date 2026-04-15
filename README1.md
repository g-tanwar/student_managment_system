#  Student Management System

A complete full-stack web application designed to efficiently manage student records, track academic progress, and streamline administrative tasks. 

**Live Demo:** [Student Management System](https://student-managment-system-eta-self.vercel.app)

---

##  Features

* **User Authentication:** Secure login for admins, teachers, and students.
* **Dashboard:** An intuitive overview of key metrics and recent activities.
* **Student Records:** Easily add, update, view, and delete student information (CRUD operations).
* **Database Integration:** Secure and reliable data storage.
* **Responsive Design:** Fully functional across desktops, tablets, and mobile devices.

---

##  Tech Stack

* **Frontend:** JavaScript, HTML5, CSS3 , React.js 
* **Backend:** Node.js, Express.js
* **Database:**  MongoDB
* **Deployment:** Vercel

---

##  Folder Structure

The repository is organized as follows:

```text
 student_managment_system
 ┣  backend/        # Server-side logic, API routes, and controllers
 ┣  database/       # Database schemas, models, and connection scripts
 ┣  diagrams/       # System architecture and ER diagrams
 ┣  docs/           # Project documentation and notes
 ┣  frontend/       # Client-side UI components and styling
 ┣  local_backup/   # Local backups for code or database
 ┣  package.json    # Project dependencies and scripts
 ┗  README.md       # Project overview

  Local Setup & Installation
To run this project locally on your machine, follow these steps:

1. Clone the repository:
git clone [https://github.com/g-tanwar/student_managment_system.git](https://github.com/g-tanwar/student_managment_system.git)
cd student_managment_system
2. Install Dependencies:
Navigate to both the frontend and backend directories and install the required npm packages.

Bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if applicable)
cd ../frontend
npm install
3. Environment Variables:
Create a .env file in the backend directory and add your database credentials and secret keys.

Code snippet
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
4. Run the Application:

Bash
# Start the backend server
cd backend
npm start

# Start the frontend server
cd ../frontend
npm start
```

##  System Architecture & Diagrams

To understand the core workflow, database design, and object interactions, we have structured visual models. These explain the internal mechanisms and data flow of the application:

* **Class Diagram:** Shows the OOP structure, inheritance, and relationships between users and system entities.
* **Use Case Diagram:** Illustrates role-based access control (Admin, Teacher, Student) and system capabilities.
* **Sequence Diagram:** Explains the step-by-step API execution and JWT verification (e.g., Bulk Attendance flow).
* **ER Diagram:** Details the MongoDB schema design and entity references using Crow's Foot notation.

>  *You can explore all detailed diagrams in the [diagrams/](./diagrams/) and [docs/](./docs/) folders.*

---

##  Contributing

Contributions, issues, and feature requests are highly welcome! Whether you are fixing a bug or adding a new feature, your help is appreciated.

**How to contribute:**
1. **Fork** the repository.
2. **Create** your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the Branch (`git push origin feature/AmazingFeature`).
5. **Open** a Pull Request.

Feel free to check the [issues page](https://github.com/g-tanwar/student_managment_system/issues) if you are looking for ideas on what to contribute.

---

##  License

This project is open-source and distributed under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it as per the license terms.