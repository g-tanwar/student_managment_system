const ApiError = require('../utils/ApiError');
const RepositoryFactory = require('../factories/repositoryFactory');

const {
  subject: subjectRepository,
  class: classRepository,
  teacher: teacherRepository,
} = RepositoryFactory.createMany(['subject', 'class', 'teacher']);

const createSubject = async (data) => {
  // Prevent duplicate systemic codes globally
  const existingCode = await subjectRepository.findOne({ subjectCode: data.subjectCode });
  if (existingCode) {
    throw new ApiError(400, 'A subject with this exact Subject Code already exists');
  }

  // Enforce referential checking for Class
  const existingClass = await classRepository.findById(data.classId);
  if (!existingClass) {
    throw new ApiError(404, 'Invalid Database Reference: Target Class mapping does not exist');
  }

  // Enforce referential checking if teacher is passed
  if (data.teacherId) {
    const existingTeacher = await teacherRepository.findById(data.teacherId);
    if (!existingTeacher) {
      throw new ApiError(404, 'Invalid Database Reference: Assigned Teacher profile does not exist');
    }
  }

  return await subjectRepository.create(data);
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

  const subjects = await subjectRepository.find(filter)
    .populate('classId', 'className classCode status')
    .populate('teacherId', 'firstName lastName employeeId') // Optional population degrades safely
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await subjectRepository.count(filter);

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
  const subject = await subjectRepository.findById(id)
    .populate('classId', 'className classCode status')
    .populate('teacherId', 'firstName lastName employeeId');
    
  if (!subject) throw new ApiError(404, 'Subject lookup failed');
  return subject;
};

const updateSubject = async (id, updateData) => {
  // Validation guardrails for relationships updating
  if (updateData.classId) {
    const existingClass = await classRepository.findById(updateData.classId);
    if (!existingClass) throw new ApiError(404, 'Invalid Database Reference: Class lookup failed');
  }

  if (updateData.teacherId) {
    const existingTeacher = await teacherRepository.findById(updateData.teacherId);
    if (!existingTeacher) throw new ApiError(404, 'Invalid Database Reference: Teacher profile not found');
  }

  if (updateData.subjectCode) {
    const codeConflict = await subjectRepository.findOne({ subjectCode: updateData.subjectCode, _id: { $ne: id } });
    if (codeConflict) throw new ApiError(400, 'Conflicting Update: Subject Code is assigned to another entity');
  }

  // Handle un-assigning teacher (translating empty string to null safely for mongoose objectId parsing)
  if (updateData.teacherId === '') {
     updateData.teacherId = null;
  }

  const subject = await subjectRepository.updateById(id, updateData, { new: true, runValidators: true });
  if (!subject) throw new ApiError(404, 'Subject lookup failed');

  return subject;
};

const deleteSubject = async (id) => {
  // Soft toggle vs Drop
  const subject = await subjectRepository.updateById(id, { status: 'INACTIVE' }, { new: true });
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
