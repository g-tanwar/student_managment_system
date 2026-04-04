const attendanceService = require('../services/attendanceService');

const registerSingle = async (req, res, next) => {
  try {
    // req.user.id is securely injected by our Auth middleware
    const record = await attendanceService.markSingle(req.body, req.user.id);
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

const registerBulk = async (req, res, next) => {
  try {
    const records = await attendanceService.markBulk(req.body, req.user.id);
    res.status(201).json({ success: true, message: `Successfully marked ${records.length} attendances` });
  } catch (error) {
    next(error);
  }
};

const fetchDailySheet = async (req, res, next) => {
  try {
    const sheet = await attendanceService.getDailySheet(req.query);
    res.status(200).json({ success: true, count: sheet.length, data: sheet });
  } catch (error) {
    next(error);
  }
};

const fetchStudentReport = async (req, res, next) => {
  try {
    const report = await attendanceService.getStudentReport(req.params.studentId, req.query);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

const modifyAttendance = async (req, res, next) => {
  try {
    const { status } = req.body;
    const record = await attendanceService.updateAttendanceStatus(req.params.id, status);
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSingle,
  registerBulk,
  fetchDailySheet,
  fetchStudentReport,
  modifyAttendance,
};
