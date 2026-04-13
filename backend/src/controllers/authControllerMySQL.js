const authService = require('../services/authServiceMySQL');

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user account
 * @access  Public
 */
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signupUser(email, password);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & return JWT
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private (requires valid JWT)
 */
const getMe = async (req, res, next) => {
  try {
    const data = await authService.getUserProfile(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/seed
 * @desc    Seed a default admin account (first-time setup only)
 * @access  Public (should be disabled in production)
 */
const seedAdmin = async (req, res, next) => {
  try {
    const data = await authService.seedDefaultAdmin();
    res.status(201).json({
      success: true,
      message: 'Default admin seeded successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, seedAdmin };
