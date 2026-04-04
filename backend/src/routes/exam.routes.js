const express = require('express');
const examController = require('../controllers/examController');
const validate = require('../middlewares/validate.middleware');
const { createExamSchema, updateExamSchema } = require('../validations/examValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'TEACHER')); // Allowed access

router.post('/', authorize('ADMIN'), validate(createExamSchema), examController.createExam);
router.get('/', examController.getExams);
router.get('/:id', examController.getExam);
router.put('/:id', authorize('ADMIN'), validate(updateExamSchema), examController.updateExam);
router.delete('/:id', authorize('ADMIN'), examController.deleteExam);

module.exports = router;
