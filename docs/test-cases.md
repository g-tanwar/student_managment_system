# Test Cases — Student Management System (EduPortal)

## 1. Authentication Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC01 | Admin Login Success | Valid email + password | JWT Token returned | ✅ Pass |
| TC02 | Admin Login Fail | Wrong password | 401 Unauthorized | ✅ Pass |
| TC03 | Login without token | No JWT header | 401 Token missing | ✅ Pass |
| TC04 | Access admin route as Teacher | Teacher JWT | 403 Forbidden | ✅ Pass |
| TC05 | Seed Admin | No admin exists | Admin created | ✅ Pass |
| TC06 | Seed Admin again | Admin exists | 400 Already exists | ✅ Pass |
| TC07 | Token expired | Old JWT | 401 Invalid token | ✅ Pass |
| TC08 | Get profile (GET /auth/me) | Valid Admin JWT | Admin profile returned | ✅ Pass |
| TC09 | Frontend login redirect | Valid credentials | Redirect to /dashboard | ✅ Pass |
| TC10 | Frontend logout | Click logout | Token cleared, redirect /login | ✅ Pass |

---

## 2. Student Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC11 | Add Student | Valid student data | 201 Student created | ✅ Pass |
| TC12 | Add Duplicate Student | Same enrollmentNo | 400 Already exists | ✅ Pass |
| TC13 | Get All Students | Valid JWT Admin | List of students | ✅ Pass |
| TC14 | Get Single Student | Valid student ID | Student object | ✅ Pass |
| TC15 | Get Invalid Student | Wrong ID | 404 Not found | ✅ Pass |
| TC16 | Update Student | Valid ID + data | Updated student | ✅ Pass |
| TC17 | Delete Student | Valid student ID | Student archived (Soft Delete) | ✅ Pass |
| TC18 | Add Student from UI | Fill form + Submit | Student added, list refreshed | ✅ Pass |
| TC19 | Delete Student from UI | Click Delete button | Confirm dialog, student removed | ✅ Pass |
| TC20 | View Students by Class | classId filter | Filtered student list | ✅ Pass |

---

## 3. Teacher Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC21 | Add Teacher | Valid teacher data | 201 Teacher + User created | ✅ Pass |
| TC22 | Add Teacher duplicate email | Same email | 400 Already exists | ✅ Pass |
| TC23 | Add Teacher duplicate employeeId | Same employeeId | 400 Already exists | ✅ Pass |
| TC24 | Get All Teachers | Valid JWT Admin | List of teachers | ✅ Pass |
| TC25 | Deactivate Teacher | Valid teacher ID | Teacher + User deactivated | ✅ Pass |

---

## 4. Attendance Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC26 | Mark Single Attendance | Valid student+date | 201 Attendance marked | ✅ Pass |
| TC27 | Mark Duplicate Attendance | Same student+date | 400 Duplicate error | ✅ Pass |
| TC28 | Mark Bulk Attendance | Class+Section+records | 201 All marked | ✅ Pass |
| TC29 | Bulk with duplicate in payload | Same studentId twice | 400 Payload error | ✅ Pass |
| TC30 | Get Daily Sheet | classId+sectionId+date | Attendance list | ✅ Pass |
| TC31 | Get Student Report | studentId | Summary + records | ✅ Pass |
| TC32 | Update Attendance | Valid ID + new status | Updated record | ✅ Pass |
| TC33 | Fetch Students in Bulk UI | Select Class+Section | Student list loaded | ✅ Pass |
| TC34 | Submit Bulk Attendance UI | Mark all + Submit | Success message shown | ✅ Pass |
| TC35 | Bulk UI without class/section | Click Fetch | Alert: select class and section | ✅ Pass |

---

## 5. Marks Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC36 | Submit Single Mark | Valid data | 201 Mark recorded | ✅ Pass |
| TC37 | Submit Mark exceeds total | obtainedMarks > totalMarks | 400 Logic error | ✅ Pass |
| TC38 | Submit Duplicate Mark | Same student+exam+subject | 400 Duplicate error | ✅ Pass |
| TC39 | Submit Bulk Marks | examId+subjectId+records | 201 All recorded | ✅ Pass |
| TC40 | Get Student Marksheet | Valid studentId | Marksheet + percentage | ✅ Pass |
| TC41 | Get Class Ranking | Valid examId | Ranked list high to low | ✅ Pass |

---

## 6. Fee Management Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC42 | Assign Fee to Student | Valid studentId | 201 Fee assigned | ✅ Pass |
| TC43 | Assign Fee to Class | Valid classId | 201 Bulk assigned | ✅ Pass |
| TC44 | Record Payment | Valid feeId + amount | Payment logged | ✅ Pass |
| TC45 | Overpay Fee | amount > outstanding | 400 Validation error | ✅ Pass |
| TC46 | Pay already PAID fee | PAID fee ID | 400 Already paid | ✅ Pass |
| TC47 | Get Defaulter Report | No input | Aggregated due list | ✅ Pass |
| TC48 | Student view own fees | Student JWT | Fee list with status | ✅ Pass |
| TC49 | Fee summary cards in UI | Load /fees page | Total/Paid/Due shown correctly | ✅ Pass |
| TC50 | Upload receipt in UI | Select file + Submit | Progress bar + success message | ✅ Pass |

---

## 7. Productivity Tools Test Cases (Student Dashboard)

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC51 | Add new goal | Title + deadline + priority | Goal added to list | ✅ Pass |
| TC52 | Add goal without title | Empty title | Button disabled | ✅ Pass |
| TC53 | Update goal progress | Drag slider | Progress bar updates | ✅ Pass |
| TC54 | Mark goal complete | Click Mark Complete | Progress = 100%, moved to Completed | ✅ Pass |
| TC55 | Pomodoro Start/Pause | Click Start/Pause | Timer counts down or pauses | ✅ Pass |
| TC56 | Pomodoro Reset | Click Reset | Timer resets to default minutes | ✅ Pass |
| TC57 | Add Note | Title + Content | Note saved and displayed | ✅ Pass |
| TC58 | Delete Note | Click Delete icon | Note removed from UI | ✅ Pass |
| TC59 | View Schedule | Load /schedule page | Timetable/events displayed | ✅ Pass |

---

## 8. Notice Board Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC60 | Create Notice | Valid data + Admin JWT | 201 Notice created | ✅ Pass |
| TC61 | Create Notice as Teacher | Teacher JWT | 403 Forbidden | ✅ Pass |
| TC62 | Get All Notices | Valid JWT | Notice list | ✅ Pass |
| TC63 | Get Notice by audience | audience=STUDENTS | Filtered + ALL notices | ✅ Pass |
| TC64 | Update Notice | Valid ID + data | Updated notice | ✅ Pass |
| TC65 | Delete Notice | Valid ID | Notice deleted | ✅ Pass |

---

## 9. Navigation, Profile & Routing Test Cases

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC66 | Access /dashboard without login | No token | Redirect to /login | ✅ Pass |
| TC67 | Access /login after login | Valid token | Redirect to /dashboard | ✅ Pass |
| TC68 | Unknown route | /xyz | Redirect to / (or 404 page) | ✅ Pass |
| TC69 | Sidebar navigation | Click Attendance | Navigate to /attendance | ✅ Pass |
| TC70 | Role-Based UI Rendering | Student logs in | Admin menus hidden | ✅ Pass |
| TC71 | View Profile | Click Profile icon | User details displayed | ✅ Pass |
| TC72 | Update Profile details | Change phone/address | Profile updated successfully | ✅ Pass |