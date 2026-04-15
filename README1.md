# 🎓 Student Management System

A complete full-stack web application designed to efficiently manage student records, track academic progress, and streamline administrative tasks. 

**Live Demo:** [Student Management System](https://student-managment-system-eta-self.vercel.app)

---

## 🚀 Features

* **User Authentication:** Secure login for admins, teachers, and students.
* **Dashboard:** An intuitive overview of key metrics and recent activities.
* **Student Records:** Easily add, update, view, and delete student information (CRUD operations).
* **Database Integration:** Secure and reliable data storage.
* **Responsive Design:** Fully functional across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

* **Frontend:** JavaScript, HTML5, CSS3 , React.js 
* **Backend:** Node.js, Express.js
* **Database:**  MongoDB
* **Deployment:** Vercel

---

## 📂 Folder Structure

The repository is organized as follows:

```text
📦 student_managment_system
 ┣ 📂 backend/        # Server-side logic, API routes, and controllers
 ┣ 📂 database/       # Database schemas, models, and connection scripts
 ┣ 📂 diagrams/       # System architecture and ER diagrams
 ┣ 📂 docs/           # Project documentation and notes
 ┣ 📂 frontend/       # Client-side UI components and styling
 ┣ 📂 local_backup/   # Local backups for code or database
 ┣ 📜 package.json    # Project dependencies and scripts
 ┗ 📜 README.md       # Project overview

 ⚙️ Local Setup & Installation
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
📊 System Architecture & Diagrams
To understand the core workflow and database design, please refer to the diagrams/ and docs/ folders. It includes detailed ER diagrams and architectural layouts that explain how different components interact.

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to contribute.

📄 License
This project is open-source and available under the MIT License.


