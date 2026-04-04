const express = require('express');
const teacherController = require('../controllers/teacherController');
const validate = require('../middlewares/validate.middleware');
const { createTeacherSchema, updateTeacherSchema } = require('../validations/teacherValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', validate(createTeacherSchema), teacherController.createTeacher);
router.get('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacher);
router.put('/:id', validate(updateTeacherSchema), teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
