const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const ApiError = require('../utils/ApiError');

const createSubject = async (data) => {
  // Prevent duplicate systemic codes globally
  const existingCode = await Subject.findOne({ subjectCode: data.subjectCode });
  if (existingCode) {
    throw new ApiError(400, 'A subject with this exact Subject Code already exists');
  }

  // Enforce referential checking for Class
  const existingClass = await Class.findById(data.classId);
  if (!existingClass) {
    throw new ApiError(404, 'Invalid Database Reference: Target Class mapping does not exist');
  }

  // Enforce referential checking if teacher is passed
  if (data.teacherId) {
    const existingTeacher = await Teacher.findById(data.teacherId);
    if (!existingTeacher) {
      throw new ApiError(404, 'Invalid Database Reference: Assigned Teacher profile does not exist');
    }
  }

  return await Subject.create(data);
};

const getSubjects = async (query) => {
  const { page = 1, limit = 10, search, status, classId, teacherId } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (classId) filter.classId = classId;
  if (teacherId) filter.teacherId = teacherId;

  if (search) {
    filter.$or = [
      { subjectName: { $regex: search, $options: 'i' } },
      { subjectCode: { $regex: search, $options: 'i' } },
    ];
  }

  const subjects = await Subject.find(filter)
    .populate('classId', 'className classCode status')
    .populate('teacherId', 'firstName lastName employeeId') // Optional population degrades safely
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Subject.countDocuments(filter);

  return {
    subjects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getSubjectById = async (id) => {
  const subject = await Subject.findById(id)
    .populate('classId', 'className classCode status')
    .populate('teacherId', 'firstName lastName employeeId');
    
  if (!subject) throw new ApiError(404, 'Subject lookup failed');
  return subject;
};

const updateSubject = async (id, updateData) => {
  // Validation guardrails for relationships updating
  if (updateData.classId) {
    const existingClass = await Class.findById(updateData.classId);
    if (!existingClass) throw new ApiError(404, 'Invalid Database Reference: Class lookup failed');
  }

  if (updateData.teacherId) {
    const existingTeacher = await Teacher.findById(updateData.teacherId);
    if (!existingTeacher) throw new ApiError(404, 'Invalid Database Reference: Teacher profile not found');
  }

  if (updateData.subjectCode) {
    const codeConflict = await Subject.findOne({ subjectCode: updateData.subjectCode, _id: { $ne: id } });
    if (codeConflict) throw new ApiError(400, 'Conflicting Update: Subject Code is assigned to another entity');
  }

  // Handle un-assigning teacher (translating empty string to null safely for mongoose objectId parsing)
  if (updateData.teacherId === '') {
     updateData.teacherId = null;
  }

  const subject = await Subject.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!subject) throw new ApiError(404, 'Subject lookup failed');

  return subject;
};

const deleteSubject = async (id) => {
  // Soft toggle vs Drop
  const subject = await Subject.findByIdAndUpdate(id, { status: 'INACTIVE' }, { new: true });
  if (!subject) throw new ApiError(404, 'Subject lookup failed');
  
  return true;
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
