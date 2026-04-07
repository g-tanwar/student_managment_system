const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate.middleware');
const { loginSchema, signupSchema } = require('../validations/authValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/seed', authController.seedAdmin);
router.get('/me', protect, authorize('ADMIN'), authController.getMe);

module.exports = router;
