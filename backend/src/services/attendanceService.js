const ApiError = require('../utils/ApiError');
const Attendance = require('../models/Attendance');
const RepositoryFactory = require('../factories/repositoryFactory');

const attendanceRepository = RepositoryFactory.create('attendance');

// Normalizes an incoming ISO date to pure midnight UTC to prevent time-shift duplication
const normalizeDate = (dateString) => {
  const d = new Date(dateString);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const markSingle = async (data, userId) => {
  const date = normalizeDate(data.date);

  const existing = await attendanceRepository.findOne({ studentId: data.studentId, date });
  if (existing) {
    throw new ApiError(400, 'Duplicate Error: Attendance has already been marked for this student on this date');
  }

  const record = { ...data, date, markedBy: userId };
  return await attendanceRepository.create(record);
};

const markBulk = async (data, userId) => {
  const { classId, sectionId, date: inputDate, records } = data;
  const date = normalizeDate(inputDate);
  const studentIds = records.map((r) => r.studentId);

  // Verification 1: Are there duplicates inside the request itself?
  const uniqueStudents = new Set(studentIds);
  if (uniqueStudents.size !== studentIds.length) {
    throw new ApiError(400, 'Payload Error: contains duplicate student entries in the records array');
  }

  // Verification 2: Does any student already have an attendance record for this exact day?
  const existingRecords = await attendanceRepository.find({
    studentId: { $in: studentIds },
    date,
  });

  if (existingRecords.length > 0) {
    throw new ApiError(
      400,
      `Duplicate Error: Attendance algorithm aborted. ${existingRecords.length} student(s) already have attendance marked on this date.`
    );
  }

  const attendanceDocs = records.map((record) => ({
    studentId: record.studentId,
    classId,
    sectionId,
    date,
    status: record.status,
    markedBy: userId,
  }));

  // insertMany enforces atomicity by default on the cluster level
  return await Attendance.insertMany(attendanceDocs);
};

const getDailySheet = async (query) => {
  const { classId, sectionId, date } = query;
  
  if (!classId || !sectionId || !date) {
    throw new ApiError(400, 'Missing mandatory filters: classId, sectionId, and date must be provided via query params');
  }

  const targetDate = normalizeDate(date);

  return await attendanceRepository.find({ classId, sectionId, date: targetDate })
    .populate('studentId', 'firstName lastName enrollmentNo')
    .populate('markedBy', 'email role');
};

const getStudentReport = async (studentId, query) => {
  const { startDate, endDate } = query;
  const filter = { studentId };

  if (startDate && endDate) {
    filter.date = {
      $gte: normalizeDate(startDate),
      $lte: normalizeDate(endDate),
    };
  }

  const records = await attendanceRepository.find(filter).sort({ date: -1 });

  // Compute Aggregations natively without heavy map-reduce
  const summary = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    TOTAL_DAYS: records.length,
  };

  records.forEach((record) => {
    summary[record.status] += 1;
  });

  return { summary, records };
};

const updateAttendanceStatus = async (id, status) => {
  const record = await attendanceRepository.updateById(id, { status }, { new: true, runValidators: true });

  if (!record) throw new ApiError(404, 'Target Attendance record could not be found');
  return record;
};

module.exports = {
  markSingle,
  markBulk,
  getDailySheet,
  getStudentReport,
  updateAttendanceStatus,
};
