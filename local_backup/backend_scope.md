# Student Management System - Backend Architecture & Scope

## 1. Modules & Responsibilities

**Core Infrastructure**
- **Auth & Admin Module**
  - **Responsibilities:** Secure login, token (JWT) generation, password hashing (bcrypt), and Role-Based Access Control (RBAC). Management of system administrator profiles.
  - **Relationships:** Acts as a cross-cutting middleware used by all protected routes to verify identity and permissions.

- **Class & Section Module**
  - **Responsibilities:** Definition of physical/logical classes (e.g., Grade 10) and subsections (e.g., Section A, Section B). Defines capacity limits.
  - **Relationships:** Foundational entity. Students and Subjects belong to a Class. Teachers are assigned to manage specific Sections.

**Entity Management**
- **Teacher Module**
  - **Responsibilities:** Comprehensive CRUD for teacher profiles, employment info, and qualifications. 
  - **Relationships:** Assigned to a Section as a Class Teacher. Tied to specific Subjects as a Subject Teacher. Records records in Attendance and Marks modules.

- **Student Module**
  - **Responsibilities:** Complete management of student life cycle (enrollment, info updates, graduation), capturing personal details, parent/guardian contacts, and current academic standing.
  - **Relationships:** Assigned to exactly one Class and Section per academic year. Generates data for Attendance, Fee, and Marks modules.

- **Subject Module**
  - **Responsibilities:** Maintaining the academic curriculum. Determining mandatory vs. elective subjects for various grade levels.
  - **Relationships:** Tied to specific Classes. Taught by Teachers. Assessed via Exam Marks.

**Daily Operations**
- **Attendance Module**
  - **Responsibilities:** Recording daily or per-period presence/absence for students. Handling automated alerts for low attendance.
  - **Relationships:** Requires Student, Class, Section identifiers, and the Teacher marking the attendance. 

**Complex Domain (Financial & Academic)**
- **Fee Management Module**
  - **Responsibilities:** Structuring fee categories (tuition, transport), raising invoices, tracking part/full payments, and identifying fee defaulters.
  - **Relationships:** Directly tied to the Student profile.
  
- **Exam and Marks Module**
  - **Responsibilities:** Declaring examination schedules (e.g., First Term, Final Exam), recording raw marks for each subject per student, processing passing criteria, and producing structured data for report cards.
  - **Relationships:** Aggregates data from Student, Subject, Class, and Teacher.

- **Notice Management Module**
  - **Responsibilities:** Digital broadcasting of announcements, alerts, and circulars. Managing visibility (everyone vs. specific classes).
  - **Relationships:** Created by an Admin/Teacher. Target audience filters via Class/Section.

---

## 2. Data Relationships & Mongoose Strategy

For MongoDB/Mongoose, normalization vs. denormalization requires careful balance. Here is a production-oriented view:

- **Users/Admins:** Shared collection for authentication. `Role` enum (Admin, Teacher, Student).
- **Classes/Sections:** `Class` has many refs to `Section`. `Section` holds a `classTeacherId` (Ref: Teacher).
- **Students & Teachers:** Store detailed profiles in separate collections `StudentProfiles`, `TeacherProfiles` linked 1:1 to their `User` auth document. `StudentProfile` holds `classId` and `sectionId`.
- **Attendance Strategy:** Instead of one document per student per day (which explodes in size), structure it as **one document per Section per Day** containing an array of student statuses.
- **Marks:** Linked via an `Exam` collection. Each `Mark` document contains `studentId`, `subjectId`, `examId`, and the numerical score.

---

## 3. Phased Implementation Plan

Building an enterprise-level system in one go risks massive complexity bottlenecks. It is heavily recommended to divide the work into actionable phases.

### Phase 1: Minimum Viable Product (MVP)
*Goal: System foundation, digital onboarding, and handling essential daily operations.*
1. **Auth & Admin** (Roles, JWT, Security config)
2. **Class & Section Management** (Creating the school structure)
3. **Subject Management** (Mapping the curriculum)
4. **Teacher Management** (Staff onboarding)
5. **Student Management** (Enrolling the students)
6. **Attendance Management** (Critical daily interaction metric)

### Phase 2: Operations Expansion
*Goal: Bringing communication and academics online.*
1. **Notice Management** (Broadcasting updates efficiently)
2. **Exam & Marks Management** (Requires complex relationships, schema validation, and potentially grading logic depending on the curriculum)

### Phase 3: Financial Orchestration
*Goal: Secure monetary tracking.*
1. **Fee Management** (Highest risk module. Requires atomic transactions, robust ledger tracking, and potentially syncing with third-party payment gateways like Stripe or local banking APIs).
