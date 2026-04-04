# Student Management System - Postman Test Scenarios

## 1. Auth Module
### `POST /api/v1/auth/login`
- **Test Case Title:** Administrator Login Token Retrieval
- **Request Body:** `{ "email": "admin@school.com", "password": "password123" }`
- **Expected Response:** `200 OK` + `{ success: true, token: "ey...", user: {...} }`
- **Edge Case:** Prevent login if profile `isActive` boolean is toggled to `false` (Suspended).
- **Invalid Input Case:** Submitting email format that fails regex validation (`admin_school.com`).
- **Auth Failure Case:** Password strictly mismatched (`401 Unauthorized` + generic error).

---

## 2. Student Module
### `POST /api/v1/students`
- **Test Case Title:** Register New Student Hierarchy
- **Request Body:** `{ "enrollmentNo": "S001", "firstName": "Alice", "dob": "2010-06-15T00:00:00Z", "classId": "65...", "sectionId": "65..." }`
- **Expected Response:** `201 Created`
- **Edge Case:** Request identical `enrollmentNo` which violates MongoDB unique indexing (`400 Bad Request`).
- **Invalid Input Case:** Invalid 24-character hexadecimal MongoDB ObjectId string inside `classId`.
- **Auth Failure Case:** Submitting the POST request without passing the Bearer JWT token in the `Authorization` header (`401 Unauthorized`).

### `GET /api/v1/students?search=Alice&page=1`
- **Test Case Title:** Filtered Pagination Access
- **Request URL:** `/api/v1/students?search=Alice&page=1&limit=5`
- **Expected Response:** `200 OK` (JSON body containing an active `pagination{}` map object alongside the `data` array).
- **Edge Case:** Requesting Page `9999` where zero records exist (Must safely return an empty array `[]` rather than throwing `404`).
- **Invalid Input Case:** Submitting negative values for `limit`.
- **Auth Failure Case:** Expired JWT token blocks endpoint query natively.

---

## 3. Teacher Module
### `POST /api/v1/teachers`
- **Test Case Title:** Full Profile & Auth Generation
- **Request Body:** `{ "email": "teacher@school.com", "password": "securepass", "employeeId": "E123", "firstName": "Bob", "gender": "MALE", "dob": "..." }`
- **Expected Response:** `201 Created`
- **Edge Case:** Database gracefully aborts User creation natively if target `employeeId` already exists within the system parameters.
- **Invalid Input Case:** Sending unauthorized fields dynamically (e.g., trying to set `"role": "SUPERADMIN"` natively). Joi should explicitly strip/reject it.
- **Auth Failure Case:** An established `<TEACHER>` token attempts to create another teacher (`403 Forbidden`).

---

## 4. Class Module
### `POST /api/v1/classes`
- **Test Case Title:** Scaffold Class Layer
- **Request Body:** `{ "className": "Grade 10", "classCode": "G10" }`
- **Expected Response:** `201 Created`
- **Edge Case:** Re-creating a class that currently sits as `INACTIVE` logically.
- **Invalid Input Case:** Missing the `classCode` parameter completely.
- **Auth Failure Case:** Headers entirely blank.

---

## 5. Section Module
### `PUT /api/v1/sections/:id`
- **Test Case Title:** Patch Existing Section
- **Request Body:** `{ "sectionName": "B" }`
- **Expected Response:** `200 OK` + Updated data frame.
- **Edge Case:** Changing `sectionName` to "B", when Section "B" already actively exists attached to that identical `classId` globally (`400 DB Collision`).
- **Invalid Input Case:** Setting URL `:id` to a string like `abc` instead of Hex (`500/400 ObjectId Cast Error`).
- **Auth Failure Case:** Malformed Token structure provided.

---

## 6. Subject Module
### `POST /api/v1/subjects`
- **Test Case Title:** Attach Subject Curriculum
- **Request Body:** `{ "subjectName": "Mathematics", "subjectCode": "MATH101", "classId": "65...", "teacherId": "65..." }`
- **Expected Response:** `201 Created`
- **Edge Case:** Passing a `teacherId` string that validates correctly as a proper Hex code, but points to a physically deleted user profile (`404 Referential Integrity Check`).
- **Invalid Input Case:** Missing `subjectName`.
- **Auth Failure Case:** Invalid permission scopes (`403 Forbidden`).

---

## 7. Attendance Module
### `POST /api/v1/attendances/bulk`
- **Test Case Title:** Batch Submission Homeroom Logic
- **Request Body:** `{ "classId": "...", "sectionId": "...", "date": "2023-10-31", "records": [{"studentId": "...", "status": "PRESENT"}] }`
- **Expected Response:** `201 Created` + `message: Successfully marked N attendances.`
- **Edge Case:** Submitting the identical array bulk block *twice* exactly causing Mongo unique compound duplicate rejection.
- **Invalid Input Case:** Array payload formatting logically broken, bypassing Joi requirements for minimum array length (`min(1)`).
- **Auth Failure Case:** Unrecognized token signature.

---

## 8. Fee Module
### `POST /api/v1/fees/:id/pay`
- **Test Case Title:** Financial Payment Transaction Processor
- **Request Body:** `{ "amount": 2500, "paymentMethod": "CASH", "remarks": "First Term Installment" }`
- **Expected Response:** `200 OK` (Status transitions safely mapping to `PARTIALLY_PAID`).
- **Edge Case:** Submitting an `amount` property that mathematically overtakes the actual outstanding `dueAmount` calculated virtually on the server.
- **Invalid Input Case:** Sending string text `"two thousand"` inside the numerical `amount` value map.
- **Auth Failure Case:** `<STUDENT>` or outsider trying to forge a paid invoice receipt API call.

---

## 9. Exam Module
### `POST /api/v1/exams`
- **Test Case Title:** Schedule Term Definitions
- **Request Body:** `{ "examName": "Mid Terms", "academicYear": "2023", "classId": "...", "schedule": [{"subjectId": "...", "examDate": "2023-11-01T00:00:00Z", "startTime": "09:00", "endTime": "11:00", "maxMarks": 100, "passingMarks": 40}] }`
- **Expected Response:** `201 Created`
- **Edge Case:** The JSON attempts to designate `passingMarks: 60` safely beside `maxMarks: 50`. Service algorithm drops request (`400 Bad Request`).
- **Invalid Input Case:** Supplying `startTime` formatting outside established bounds explicitly.
- **Auth Failure Case:** Manipulated HTTP routing headers.

---

## 10. Marks Module
### `POST /api/v1/marks/bulk`
- **Test Case Title:** Class Grading Engine
- **Request Body:** `{ "examId": "...", "subjectId": "...", "totalMarks": 100, "records": [{"studentId": "...", "obtainedMarks": 85}] }`
- **Expected Response:** `201 Created`
- **Edge Case:** Attempting to assign grades inside an `examId` context mapping directly to a target `subjectId` that was actually never technically listed directly inside the exam's structural schedule map.
- **Invalid Input Case:** Attempting to provide `obtainedMarks` statistically marked beneath `0`.
- **Auth Failure Case:** Rejection natively without parsing.

---

## 11. Notice Module
### `GET /api/v1/notices?audience=STUDENTS`
- **Test Case Title:** Targeted Feed Generation
- **Request:** Explicit Query Parameter usage `?audience=STUDENTS`
- **Expected Response:** `200 OK` -> Will generate array blocks combining messages intended specifically for `"STUDENTS"` universally merged mathematically with global `"ALL"` categorized signals seamlessly.
- **Edge Case:** Testing visibility parameters confirming Notices bearing active `expiryDates` natively hidden depending on DB implementations logic.
- **Invalid Input Case:** Passing a strictly undefined audience scope like `?audience=PARENTS`. Joi blocks enum mismatch.
- **Auth Failure Case:** Valid credentials not provided.
