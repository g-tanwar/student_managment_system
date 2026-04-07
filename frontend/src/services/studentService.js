import API from './api';

/**
 * studentService.js
 * All student-related API calls.
 */

/**
 * Fetch all students (admin use).
 * Hits: GET /api/v1/students
 */
export const getAllStudents = async (params = {}) => {
  const response = await API.get('/students', { params });
  return response.data; // { success, data }
};

/**
 * Fetch a single student by ID (admin use).
 * Hits: GET /api/v1/students/:id
 */
export const getStudentById = async (id) => {
  const response = await API.get(`/students/${id}`);
  return response.data;
};

/**
 * Create a new student (admin use).
 * Hits: POST /api/v1/students
 */
export const createStudent = async (studentData) => {
  const response = await API.post('/students', studentData);
  return response.data;
};

/**
 * Update a student (admin use).
 * Hits: PUT /api/v1/students/:id
 */
export const updateStudent = async (id, studentData) => {
  const response = await API.put(`/students/${id}`, studentData);
  return response.data;
};

/**
 * Delete a student (admin use).
 * Hits: DELETE /api/v1/students/:id
 */
export const deleteStudent = async (id) => {
  const response = await API.delete(`/students/${id}`);
  return response.data;
};
