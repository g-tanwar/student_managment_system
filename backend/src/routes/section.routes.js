const express = require('express');
const sectionController = require('../controllers/sectionController');
const validate = require('../middlewares/validate.middleware');
const { createSectionSchema, updateSectionSchema } = require('../validations/sectionValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.post('/', validate(createSectionSchema), sectionController.createSection);
router.get('/', sectionController.getSections);
router.get('/:id', sectionController.getSection);
router.put('/:id', validate(updateSectionSchema), sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);

module.exports = router;
