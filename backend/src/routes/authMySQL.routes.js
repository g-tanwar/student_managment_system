const express = require('express');
const authController = require('../controllers/authControllerMySQL');
const validate = require('../middlewares/validate.middleware');
const { loginSchema, signupSchema } = require('../validations/authValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// ── Public Routes ──
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/seed', authController.seedAdmin);

// ── Protected Routes ──
router.get('/me', protect, authController.getMe);

module.exports = router;
