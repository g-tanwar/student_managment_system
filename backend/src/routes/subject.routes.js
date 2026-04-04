const express = require('express');
const subjectController = require('../controllers/subjectController');
const validate = require('../middlewares/validate.middleware');
const { createSubjectSchema, updateSubjectSchema } = require('../validations/subjectValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', validate(createSubjectSchema), subjectController.createSubject);
router.get('/', subjectController.getSubjects);
router.get('/:id', subjectController.getSubject);
router.put('/:id', validate(updateSubjectSchema), subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
