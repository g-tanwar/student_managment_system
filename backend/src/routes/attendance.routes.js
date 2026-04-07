const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const validate = require('../middlewares/validate.middleware');
const { markSingleSchema, bulkMarkSchema, updateSchema } = require('../validations/attendanceValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// ── Student self-service routes (any authenticated user) ──────────────────────
// Must be declared BEFORE the authorize('ADMIN', 'TEACHER') wall below
router.get('/me', protect, attendanceController.fetchMyAttendance);

// ── Admin / Teacher routes ────────────────────────────────────────────────────
router.use(protect);
router.use(authorize('ADMIN', 'TEACHER'));

router.post('/', validate(markSingleSchema), attendanceController.registerSingle);
router.post('/bulk', validate(bulkMarkSchema), attendanceController.registerBulk);

router.get('/daily', attendanceController.fetchDailySheet);
router.get('/student/:studentId', attendanceController.fetchStudentReport);

router.put('/:id', validate(updateSchema), attendanceController.modifyAttendance);

module.exports = router;
