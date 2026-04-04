const express = require('express');
const noticeController = require('../controllers/noticeController');
const validate = require('../middlewares/validate.middleware');
const { createNoticeSchema, updateNoticeSchema } = require('../validations/noticeValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

// Allow Admins to generate feeds explicitly. 
// Standard Teachers / Students would only be authorized to GET globally.
router.post('/', authorize('ADMIN'), validate(createNoticeSchema), noticeController.createNotice);

// GET routes remain natively guarded simply by being logged in via the base `protect` above
router.get('/', noticeController.getNotices);
router.get('/:id', noticeController.getNotice);

// Modifications securely locked
router.put('/:id', authorize('ADMIN'), validate(updateNoticeSchema), noticeController.updateNotice);
router.delete('/:id', authorize('ADMIN'), noticeController.deleteNotice);

module.exports = router;
