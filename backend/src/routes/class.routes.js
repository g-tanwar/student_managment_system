const express = require('express');
const classController = require('../controllers/classController');
const validate = require('../middlewares/validate.middleware');
const { createClassSchema, updateClassSchema } = require('../validations/classValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', validate(createClassSchema), classController.createClass);
router.get('/', classController.getClasses);
router.get('/:id', classController.getClass);
router.put('/:id', validate(updateClassSchema), classController.updateClass);
router.delete('/:id', classController.deleteClass);

module.exports = router;
