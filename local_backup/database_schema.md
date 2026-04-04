# Database Design Specification (MongoDB/Mongoose)

## Global Constraints
- **Timestamps:** All collections implicitly have `createdAt` and `updatedAt`.
- **Soft Deletes:** Critical business entities use `isActive` or `status` flags rather than physical deletions.

## 1. Users (`users`)
Responsible for authentication, basic profiling, and RBAC implementation.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `email` | String | Yes | | Unique, Indexed |
| `password` | String | Yes | | Hashed (bcrypt) |
| `role` | String | Yes | Enum: `['ADMIN', 'TEACHER', 'STUDENT']` | Indexed |
| `isActive` | Boolean | No | default: `true` | |
| `lastLogin` | Date | No | | |

## 2. Classes (`classes`)
Represents generic grades or yearly levels (e.g., Grade 10).

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | | e.g. "Grade 10", Indexed |
| `numericValue`| Number | Yes | | For easy sorting, e.g. `10` |
| `description` | String | No | | |
| `isActive` | Boolean | No | default: `true` | |

## 3. Sections (`sections`)
Sub-divisions of Classes (e.g., Section A, Section B).

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | | e.g. "A", "B" |
| `classId` | ObjectId | Yes | Ref: `Class` | Indexed |
| `classTeacherId`| ObjectId | No | Ref: `Teacher` | |
| `capacity` | Number | No | | Max students allowed |
| `isActive` | Boolean | No | default: `true` | |

* **Indexes:** Compound unique index on `{ classId: 1, name: 1 }` (Ensures no duplicate sections per class).

## 4. Teachers (`teachers`)
Profiles for teaching staff.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | ObjectId | Yes | Ref: `User` | Unique, Indexed (Links to Auth) |
| `employeeId` | String | Yes | | Unique, Indexed |
| `firstName` | String | Yes | | |
| `lastName` | String | Yes | | |
| `gender` | String | Yes | Enum: `['MALE', 'FEMALE', 'OTHER']` | |
| `dob` | Date | Yes | | |
| `contactNumber`| String | Yes | | |
| `address` | String | No | | |
| `qualifications`| [String] | No | | Array of degrees/certs |
| `joinDate` | Date | No | | |

## 5. Students (`students`)
Profiles for students.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `userId` | ObjectId | No | Ref: `User` | Unique, Indexed (If they have login) |
| `enrollmentNo` | String | Yes | | Unique, Indexed |
| `rollNo` | Number | No | | Resets per section |
| `firstName` | String | Yes | | |
| `lastName` | String | Yes | | |
| `gender` | String | Yes | Enum: `['MALE', 'FEMALE', 'OTHER']` | |
| `dob` | Date | Yes | | |
| `bloodGroup` | String | No | | |
| `address` | String | No | | |
| `parentName` | String | Yes | | |
| `parentContact`| String | Yes | | |
| `classId` | ObjectId | Yes | Ref: `Class` | Indexed |
| `sectionId` | ObjectId | Yes | Ref: `Section` | Indexed |
| `status` | String | Yes | Enum: `['ACTIVE', 'SUSPENDED', 'ALUMNI']` | default: `'ACTIVE'` |

## 6. Subjects (`subjects`)

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | | e.g. "Physics" |
| `code` | String | Yes | | Unique, Indexed (e.g., "PHY101") |
| `type` | String | Yes | Enum: `['MANDATORY', 'ELECTIVE']` | |
| `classId` | ObjectId | Yes | Ref: `Class` | |
| `teacherId` | ObjectId | No | Ref: `Teacher` | Current subject teacher |

## 7. Attendances (`attendances`)
**Optimization:** Storing attendance as *One Document Per Section Per Day* to prevent massive DB growth.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `date` | Date | Yes | | Strip time, Indexed |
| `classId` | ObjectId | Yes | Ref: `Class` | |
| `sectionId` | ObjectId | Yes | Ref: `Section` | |
| `recordedBy` | ObjectId | Yes | Ref: `Teacher` | Who marked it |
| `records` | [Object] | Yes | See Sub-schema below | |

**`records` Array Sub-schema:**
- `studentId` (ObjectId, Ref: `Student`, Required)
- `status` (String, Enum: `['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY']`, Required)
- `remarks` (String, Optional)
* **Indexes:** Compound unique index on `{ sectionId: 1, date: 1 }` (Only one attendance sheet per section per day).

## 8. Exams (`exams`)
Defines the examination period explicitly.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | | e.g. "Mid-Term Examination" |
| `academicYear` | String | Yes | | e.g. "2023-2024" |
| `startDate` | Date | No | | |
| `endDate` | Date | No | | |
| `classes` | [ObjectId]| No | Ref: `Class` | Classes participating |
| `status` | String | Yes | Enum: `['SCHEDULED', 'ONGOING', 'COMPLETED', 'PUBLISHED']` | default:`'SCHEDULED'` |

## 9. Marks (`marks`)
Raw score entry bridging a student, a subject, and an exam event.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `examId` | ObjectId | Yes | Ref: `Exam` | Indexed |
| `studentId` | ObjectId | Yes | Ref: `Student` | Indexed |
| `subjectId` | ObjectId | Yes | Ref: `Subject` | Indexed |
| `marksObtained`| Number | Yes | | |
| `maxMarks` | Number | Yes | | Generally 100 |
| `remarks` | String | No | | Teacher comments |

* **Indexes:** Compound unique index on `{ examId: 1, studentId: 1, subjectId: 1 }` (Prevents duplicate marks for the same subject mapping).

## 10. Fees (`fees`)
Directly tied to the individual student liability.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `studentId` | ObjectId | Yes | Ref: `Student` | Indexed |
| `feeType` | String | Yes | | e.g., "Tuition Fee", "Transport" |
| `academicYear` | String | Yes | | |
| `totalAmount` | Number | Yes | | Baseline charge |
| `amountPaid` | Number | Yes | | default: `0` |
| `dueDate` | Date | Yes | | Indexed (Find overdue) |
| `paymentDate` | Date | No | | When completed |
| `paymentMode` | String | No | Enum: `['CASH', 'ONLINE', 'CHEQUE', 'NONE']` | |
| `status` | String | Yes | Enum: `['PAID', 'UNPAID', 'PARTIALLY_PAID', 'OVERDUE']` | Indexed |

## 11. Notices (`notices`)
For systemic communication.

| Field | Type | Required | Reference / Enum | Details/Indexes |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | | |
| `content` | String | Yes | | Markdown or HTML |
| `authorId` | ObjectId | Yes | Ref: `User` | |
| `targetAudience`| String | Yes | Enum: `['ALL', 'TEACHERS', 'STUDENTS', 'SPECIFIC_CLASSES']` | |
| `targetClasses`| [ObjectId]| No | Ref: `Class` | Valid if above is `SPECIFIC_CLASSES`|
| `isActive` | Boolean | No | default: `true` | |
