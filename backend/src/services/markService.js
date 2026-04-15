const Mark = require('../models/Mark');
const Exam = require('../models/Exam');
const ApiError = require('../utils/ApiError');
const BaseRepository = require('../repositories/BaseRepository');

const markRepository = new BaseRepository(Mark);
const examRepository = new BaseRepository(Exam);

const verifyExamAndSubject = async (examId, subjectId) => {
  const exam = await examRepository.findById(examId);
  if (!exam) throw new ApiError(404, 'Reference Error: Designated Exam not found');

  // Verify subject mapping to restrict orphaned marks
  const isSubjectScheduled = exam.schedule.some((s) => s.subjectId.toString() === subjectId);
  if (!isSubjectScheduled) {
    throw new ApiError(400, 'Conflict: Attempting to submit marks for a Subject not legitimately scheduled in this physical Exam.');
  }
};

const submitSingleMark = async (data) => {
  if (data.obtainedMarks > data.totalMarks) {
    throw new ApiError(400, 'Logic Error: Obtained marks cannot statistically exceed Total marks');
  }

  await verifyExamAndSubject(data.examId, data.subjectId);

  const existing = await markRepository.findOne({ examId: data.examId, subjectId: data.subjectId, studentId: data.studentId });
  if (existing) {
    throw new ApiError(400, 'Duplicate protection triggered: Marks already successfully logged for this explicit combination');
  }

  return await markRepository.create(data);
};

const submitMarksBulk = async (data) => {
  const { examId, subjectId, totalMarks, records } = data;

  await verifyExamAndSubject(examId, subjectId);

  // Validate internals natively
  for (let rec of records) {
    if (rec.obtainedMarks > totalMarks) {
      throw new ApiError(400, `Logic Error: Student ${rec.studentId} obtained marks cannot exceed Total marks`);
    }
  }

  const studentIds = records.map((r) => r.studentId);

  // Security layer preventing half-commits if duplicates rest secretly inside payload
  const existingRecords = await markRepository.find({
    examId,
    subjectId,
    studentId: { $in: studentIds },
  });

  if (existingRecords.length > 0) {
    throw new ApiError(
      400,
      `Duplicate protection triggered: ${existingRecords.length} student(s) already carry evaluated marks for this domain. Aborting Bulk Insert.`
    );
  }

  const payload = records.map((r) => ({
    studentId: r.studentId,
    examId,
    subjectId,
    obtainedMarks: r.obtainedMarks,
    totalMarks,
    remarks: r.remarks,
  }));

  return await Mark.insertMany(payload);
};

const getMarksheetForStudent = async (studentId, query) => {
  const filter = { studentId };
  if (query.examId) filter.examId = query.examId;

  const marks = await markRepository.find(filter)
    .populate('examId', 'examName academicYear')
    .populate('subjectId', 'subjectName subjectCode')
    .sort({ createdAt: -1 });

  // Generate automated statistical aggregation wrapper
  let totalObtained = 0;
  let maxPossible = 0;

  marks.forEach((m) => {
    totalObtained += m.obtainedMarks;
    maxPossible += m.totalMarks;
  });

  const percentage = maxPossible > 0 ? ((totalObtained / maxPossible) * 100).toFixed(2) : 0;

  return { studentId, totalObtained, maxPossible, percentage, marks };
};

const getClassExamMarks = async (examId, query) => {
  const filter = { examId };
  if (query.subjectId) filter.subjectId = query.subjectId;

  // Use aggressive population to filter explicitly out by mapping target classroom
  const marks = await markRepository.find(filter)
    .populate({
      path: 'studentId',
      match: query.classId ? { classId: query.classId } : {},
      select: 'firstName lastName enrollmentNo classId sectionId',
    })
    .populate('subjectId', 'subjectName')
    .sort({ obtainedMarks: -1 }); // Rank highest to lowest naturally

  // Mongoose populates null for `studentId` if the `match` filter strictly fails. Strip them out.
  const validMarks = marks.filter((m) => m.studentId !== null);
  return validMarks;
};

module.exports = { submitSingleMark, submitMarksBulk, getMarksheetForStudent, getClassExamMarks };
