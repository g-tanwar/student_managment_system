const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');
const StudentRepository = require('../repositories/StudentRepository');

const studentRepository = new StudentRepository(Student);

const createStudent = async (studentData) => {
  const existingStudent = await studentRepository.findOne({ enrollmentNo: studentData.enrollmentNo });
  if (existingStudent) {
    throw new ApiError(400, 'A student with this enrollment number already exists');
  }

  const student = await studentRepository.create(studentData);
  return student;
};

const getStudents = async (query) => {
  const { page = 1, limit = 10, search, classId, sectionId, status } = query;
  const skip = (page - 1) * limit;

  // Build Filter object
  const filter = { isActive: true };
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status) filter.status = status;

  if (search) {
    // Regex based search on string fields
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { enrollmentNo: { $regex: search, $options: 'i' } },
    ];
  }

  const students = await studentRepository
    .find(filter)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await studentRepository.count(filter);

  return {
    students,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getStudentById = async (id) => {
  const student = await studentRepository.findActiveById(id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return student;
};

const updateStudent = async (id, updateData) => {
  const student = await studentRepository.updateActiveById(id, updateData);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return student;
};

const softDeleteStudent = async (id) => {
  const student = await studentRepository.softDeleteById(id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }
  return true;
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  softDeleteStudent,
};
