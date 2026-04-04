# Test Cases — Student Management System

## 1. Authentication Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC01 | Admin Login Success | Valid email + password | JWT Token returned | ✅ Pass |
| TC02 | Admin Login Fail | Wrong password | 401 Unauthorized | ✅ Pass |
| TC03 | Login without token | No JWT header | 401 Token missing | ✅ Pass |
| TC04 | Access admin route as Teacher | Teacher JWT | 403 Forbidden | ✅ Pass |
| TC05 | Seed Admin | No admin exists | Admin created | ✅ Pass |
| TC06 | Seed Admin again | Admin exists | 400 Already exists | ✅ Pass |

---

## 2. Student Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC07 | Add Student | Valid student data | 201 Student created | ✅ Pass |
| TC08 | Add Duplicate Student | Same enrollmentNo | 400 Already exists | ✅ Pass |
| TC09 | Get All Students | Valid JWT Admin | List of students | ✅ Pass |
| TC10 | Get Single Student | Valid student ID | Student object | ✅ Pass |
| TC11 | Get Invalid Student | Wrong ID | 404 Not found | ✅ Pass |
| TC12 | Update Student | Valid ID + data | Updated student | ✅ Pass |
| TC13 | Delete Student | Valid student ID | Student archived | ✅ Pass |

---

## 3. Teacher Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC14 | Add Teacher | Valid teacher data | 201 Teacher created | ✅ Pass |
| TC15 | Add Teacher duplicate email | Same email | 400 Already exists | ✅ Pass |
| TC16 | Add Teacher duplicate employeeId | Same employeeId | 400 Already exists | ✅ Pass |
| TC17 | Get All Teachers | Valid JWT Admin | List of teachers | ✅ Pass |
| TC18 | Deactivate Teacher | Valid teacher ID | Teacher archived | ✅ Pass |

---

## 4. Attendance Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC19 | Mark Single Attendance | Valid student+date | 201 Attendance marked | ✅ Pass |
| TC20 | Mark Duplicate Attendance | Same student+date | 400 Duplicate error | ✅ Pass |
| TC21 | Mark Bulk Attendance | Class+Section+records | 201 All marked | ✅ Pass |
| TC22 | Bulk with duplicate in payload | Same studentId twice | 400 Payload error | ✅ Pass |
| TC23 | Get Daily Sheet | classId+sectionId+date | Attendance list | ✅ Pass |
| TC24 | Get Student Report | studentId | Summary + records | ✅ Pass |
| TC25 | Update Attendance | Valid ID + new status | Updated record | ✅ Pass |

---

## 5. Marks Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC26 | Submit Single Mark | Valid data | 201 Mark recorded | ✅ Pass |
| TC27 | Submit Mark exceeds total | obtainedMarks > totalMarks | 400 Logic error | ✅ Pass |
| TC28 | Submit Duplicate Mark | Same student+exam+subject | 400 Duplicate error | ✅ Pass |
| TC29 | Submit Bulk Marks | examId+subjectId+records | 201 All recorded | ✅ Pass |
| TC30 | Get Student Marksheet | Valid studentId | Marksheet + percentage | ✅ Pass |
| TC31 | Get Class Ranking | Valid examId | Ranked list | ✅ Pass |

---

## 6. Fee Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC32 | Assign Fee to Student | Valid studentId | 201 Fee assigned | ✅ Pass |
| TC33 | Assign Fee to Class | Valid classId | 201 Bulk assigned | ✅ Pass |
| TC34 | Record Payment | Valid feeId + amount | Payment logged | ✅ Pass |
| TC35 | Overpay Fee | amount > outstanding | 400 Validation error | ✅ Pass |
| TC36 | Pay already PAID fee | PAID fee ID | 400 Already paid | ✅ Pass |
| TC37 | Get Defaulter Report | No input | Aggregated due list | ✅ Pass |

---

## 7. Notice Board Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC38 | Create Notice | Valid data + Admin JWT | 201 Notice created | ✅ Pass |
| TC39 | Create Notice as Teacher | Teacher JWT | 403 Forbidden | ✅ Pass |
| TC40 | Get All Notices | Valid JWT | Notice list | ✅ Pass |
| TC41 | Get Notice by audience | audience=STUDENTS | Filtered notices | ✅ Pass |
| TC42 | Update Notice | Valid ID + data | Updated notice | ✅ Pass |
| TC43 | Delete Notice | Valid ID | Notice deleted | ✅ Pass |