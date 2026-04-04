const express = require('express');
const studentController = require('../controllers/studentController');
const validate = require('../middlewares/validate.middleware');
const { createStudentSchema, updateStudentSchema } = require('../validations/studentValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Middleware lock: Everything below this requires valid JWT + ADMIN Role
router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', validate(createStudentSchema), studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudent);
router.put('/:id', validate(updateStudentSchema), studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
