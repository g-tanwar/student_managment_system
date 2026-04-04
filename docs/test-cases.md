# Test Cases — Student Management System

## Test Case Table

| TC ID | Test Case | Input | Expected Output | Status |
|-------|-----------|-------|-----------------|--------|
| TC01 | Add Student | Name, Roll No, Course | Student added successfully | ✅ Pass |
| TC02 | Delete Student | Roll No | Student removed from list | ✅ Pass |
| TC03 | Update Student | Roll No, New Data | Student info updated | ✅ Pass |
| TC04 | View All Students | None | List of all students displayed | ✅ Pass |
| TC05 | Assign Course | Student ID, Course ID | Course assigned successfully | ✅ Pass |
| TC06 | Mark Attendance | Student ID, Date | Attendance recorded | ✅ Pass |
| TC07 | Add Duplicate Student | Same Roll No | Error: Student already exists | ✅ Pass |
| TC08 | Delete Non-existing Student | Wrong Roll No | Error: Student not found | ✅ Pass |
| TC09 | Add Marks | Student ID, Subject, Marks | Marks saved successfully | ✅ Pass |
| TC10 | Generate Report | Student ID | Report displayed | ✅ Pass |