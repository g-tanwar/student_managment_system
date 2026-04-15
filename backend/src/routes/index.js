const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');

const studentRoutes = require('./student.routes');
const teacherRoutes = require('./teacher.routes');
const classRoutes = require('./class.routes');
const sectionRoutes = require('./section.routes');
const subjectRoutes = require('./subject.routes');
const attendanceRoutes = require('./attendance.routes');
const feeRoutes = require('./fee.routes');
const examRoutes = require('./exam.routes');
const markRoutes = require('./mark.routes');
const noticeRoutes = require('./notice.routes');

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Mounted application routes
router.use('/auth', authRoutes);

router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/sections', sectionRoutes);
router.use('/subjects', subjectRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/fees', feeRoutes);
router.use('/exams', examRoutes);
router.use('/marks', markRoutes);
router.use('/notices', noticeRoutes);

module.exports = router;
