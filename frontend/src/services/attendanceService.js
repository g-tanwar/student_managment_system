import API from './api';

/**
 * attendanceService.js
 * All attendance-related API calls for the student front-end.
 */

/**
 * Fetch the logged-in student's own attendance records.
 * Hits: GET /api/v1/attendances/me
 * Returns: { data: [], summary: { PRESENT, ABSENT, LATE, TOTAL_DAYS } }
 */
export const getMyAttendance = async (params = {}) => {
  const response = await API.get('/attendances/me', { params });
  return response.data; // { success, data, summary }
};

/**
 * Fetch a specific student's attendance (admin/teacher use).
 * Hits: GET /api/v1/attendances/student/:studentId
 */
export const getStudentAttendance = async (studentId, params = {}) => {
  const response = await API.get(`/attendances/student/${studentId}`, { params });
  return response.data;
};
