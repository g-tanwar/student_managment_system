const express = require('express');
const markController = require('../controllers/markController');
const validate = require('../middlewares/validate.middleware');
const { submitMarkSchema, bulkSubmitMarkSchema } = require('../validations/markValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN', 'TEACHER')); // Both layers process grading inputs

router.post('/', validate(submitMarkSchema), markController.submitMark);
router.post('/bulk', validate(bulkSubmitMarkSchema), markController.submitBulk);

router.get('/student/:studentId', markController.getStudentMarksheet);
router.get('/exam/:examId', markController.getClassRanking);

module.exports = router;
