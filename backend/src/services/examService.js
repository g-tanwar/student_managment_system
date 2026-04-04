const Exam = require('../models/Exam');
const Class = require('../models/Class');
const Section = require('../models/Section');
const Subject = require('../models/Subject');
const ApiError = require('../utils/ApiError');

const createExam = async (data) => {
  // Validate parent Class existence
  const existingClass = await Class.findById(data.classId);
  if (!existingClass) throw new ApiError(404, 'Database Validation: Class not found');

  // Validate optional Section mapping logically
  if (data.sectionId) {
    const existingSection = await Section.findById(data.sectionId);
    if (!existingSection) throw new ApiError(404, 'Database Validation: Section not found');
    
    // Cross-check that the section natively belongs to this exact class id
    if (existingSection.classId.toString() !== data.classId) {
      throw new ApiError(400, 'Hierarchy Mismatch: The requested section does not belong to the mapped class');
    }
  }

  // Validate internal Subjects block
  const subjectIds = data.schedule.map(s => s.subjectId);
  // Ensure we don't accidentally schedule a subject that isn't taught in this specific class
  const verifiedSubjects = await Subject.countDocuments({ 
    _id: { $in: subjectIds }, 
    classId: data.classId 
  });
  
  if (verifiedSubjects !== subjectIds.length) {
    throw new ApiError(400, 'Payload Mismatch: One or more scheduled subjects DO NOT belong to the assigned Class');
  }

  // Math sanity check limits
  for (let s of data.schedule) {
    if (s.passingMarks > s.maxMarks) {
      throw new ApiError(400, 'Logical constraint failed: passingMarks cannot exceed maxMarks mathematically');
    }
  }

  return await Exam.create(data);
};

const getExams = async (query) => {
  const { page = 1, limit = 10, classId, sectionId, status, academicYear } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (classId) filter.classId = classId;
  if (sectionId) filter.sectionId = sectionId;
  if (status) filter.status = status;
  if (academicYear) filter.academicYear = academicYear;

  const exams = await Exam.find(filter)
    .populate('classId', 'className classCode')
    .populate('sectionId', 'sectionName')
    .populate('schedule.subjectId', 'subjectName subjectCode')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Exam.countDocuments(filter);

  return { exams, pagination: { total, page: Number(page), limit: Number(limit) } };
};

const getExamById = async (id) => {
  const exam = await Exam.findById(id)
    .populate('classId', 'className classCode')
    .populate('sectionId', 'sectionName')
    .populate('schedule.subjectId', 'subjectName subjectCode');
    
  if (!exam) throw new ApiError(404, 'Exam schedule lookup failed');
  return exam;
};

const updateExam = async (id, updateData) => {
  // If schedule is updated natively, we should validate it ideally, but native mongoose runValidators intercepts structural issues
  const exam = await Exam.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!exam) throw new ApiError(404, 'Exam schedule lookup failed');
  return exam;
};

const deleteExam = async (id) => {
  // Exam schedules can be hard-deleted if they haven't been published/processed or soft-deleted 
  const exam = await Exam.findByIdAndDelete(id);
  if (!exam) throw new ApiError(404, 'Exam schedule lookup failed');
  return true;
};

module.exports = { createExam, getExams, getExamById, updateExam, deleteExam };
