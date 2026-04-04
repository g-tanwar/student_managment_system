# REST API Contract (v1)

**Base URL:** `/api/v1`

## Global Formats

**Success Response:**
```json
{
  "success": true,
  "data": { ... } // or [...]
}
```

**Custom Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ "Detailed validation errors if any" ]
}
```

---

## 1. Auth Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | **POST** | Authenticate user & get token | `{ "email", "password" }` | None | None | `{ "token", "user": {} }` |
| `/auth/me` | **GET** | Get current logged-in user details | None | None | None | `{ "user": {} }` |
| `/auth/logout` | **POST** | Invalidate token (if blacklist used) | None | None | None | `{ "message": "Logged out" }` |

## 2. Classes Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/classes` | **GET** | List all classes | None | None | `isActive` | `[{ class }]` |
| `/classes` | **POST** | Create a new class | `{ "name", "numericValue", "description" }` | None | None | `{ class }` |
| `/classes/:id` | **GET** | Get a single class | None | `id` | None | `{ class }` |
| `/classes/:id` | **PUT** | Update a class | `{ ...updates }`| `id` | None | `{ class }` |
| `/classes/:id` | **DELETE**| Soft-delete a class | None | `id` | None | `{ success }` |

## 3. Sections Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/classes/:classId/sections`| **GET** | List sections for a class | None | `classId` | `isActive` | `[{ section }]` |
| `/sections` | **POST** | Create a new section | `{ "name", "classId", "capacity" }` | None | None | `{ section }` |
| `/sections/:id` | **PUT** | Update a section | `{ ...updates }`| `id` | None | `{ section }` |
| `/sections/:id` | **DELETE**| Soft-delete a section | None | `id` | None | `{ success }` |

## 4. Teachers Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/teachers` | **GET** | List all teachers | None | None | None | `[{ teacher }]` |
| `/teachers` | **POST** | Create teacher & auth User | `{ ...teacherInfo, "email", "password" }` | None | None | `{ teacher }` |
| `/teachers/:id` | **GET** | Get a single teacher | None | `id` | None | `{ teacher }` |
| `/teachers/:id` | **PUT** | Update teacher details | `{ ...updates }`| `id` | None | `{ teacher }` |

## 5. Students Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/students` | **GET** | List students (filterable) | None | None | `classId`, `sectionId`, `status`, `search` | `[{ student }]` |
| `/students` | **POST** | Admit a new student | `{ ...studentInfo, "classId", "sectionId" }` | None | None | `{ student }` |
| `/students/:id` | **GET** | Get student full profile | None | `id` | None | `{ student }` |
| `/students/:id` | **PUT** | Update student details | `{ ...updates }`| `id` | None | `{ student }` |

## 6. Subjects Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/subjects` | **GET** | List subjects | None | None | `classId`, `type` | `[{ subject }]` |
| `/subjects` | **POST** | Create a subject | `{ "name", "code", "type", "classId", "teacherId" }`| None | None | `{ subject }` |
| `/subjects/:id` | **PUT** | Update a subject | `{ ...updates }`| `id` | None | `{ subject }` |

## 7. Attendance Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/attendances` | **GET** | Fetch attendance sheet | None | None | `sectionId`, `date` (YYYY-MM-DD)| `{ attendance_document }` |
| `/attendances` | **POST** | Submit sheet for a day | `{ "sectionId", "date", "records": [{studentId, status}] }`| None | None | `{ attendance }` |
| `/attendances/:id` | **PUT** | Edit existing attendance sheet| `{ "records" }` (Full array override) | `id` | None | `{ attendance }` |

## 8. Fees Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/fees` | **GET** | Get fee invoices | None | None | `studentId`, `status`, `academicYear`| `[{ fee }]` |
| `/fees` | **POST** | Assign new fee to student | `{ "studentId", "feeType", "totalAmount", "dueDate" }`| None | None | `{ fee }` |
| `/fees/:id` | **GET** | Get fee details | None | `id` | None | `{ fee }` |
| `/fees/:id/pay` | **POST** | Process fee payment | `{ "amountPaid", "paymentMode" }` | `id` | None | `{ updated_fee }` |

## 9. Exams Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/exams` | **GET** | List exams | None | None | `academicYear`, `status` | `[{ exam }]` |
| `/exams` | **POST** | Declare new exam | `{ "name", "academicYear", "classes", "startDate", "endDate" }`| None | None | `{ exam }` |
| `/exams/:id` | **PUT** | Update exam schedule / status | `{ ...updates }`| `id` | None | `{ exam }` |

## 10. Marks Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/exams/:examId/marks`| **GET** | Get marks for an exam | None | `examId` | `subjectId`, `sectionId`, `studentId`| `[{ mark }]` |
| `/marks/bulk` | **POST** | Batch insert section marks | `{ "examId", "subjectId", "marks": [{studentId, marksObtained, maxMarks}] }`| None | None | `{ "insertedCount": N }` |
| `/marks/:id` | **PUT** | Update single student's mark | `{ "marksObtained", "remarks" }`| `id` | None | `{ mark }` |

## 11. Notices Module
| Endpoint | Method | Purpose | Req. Body | Route Params | Query Params | Success Response |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| `/notices` | **GET** | List active notices | None | None | `targetAudience`, `classId` | `[{ notice }]` |
| `/notices` | **POST** | Publish a notice | `{ "title", "content", "targetAudience", "targetClasses" }`| None | None | `{ notice }` |
| `/notices/:id` | **PUT** | Update a notice | `{ ...updates }`| `id` | None | `{ notice }` |
| `/notices/:id` | **DELETE** | Soft-delete a notice | None | `id` | None | `{ success }` |
