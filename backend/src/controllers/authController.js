const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginAdmin(email, password);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authService.getAdminProfile(req.user.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const seedAdmin = async (req, res, next) => {
  try {
    const data = await authService.seedDefaultAdmin();
    res.status(201).json({ success: true, message: 'Default admin seeded successfully', data });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.signupUser(email, password);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, seedAdmin, signup };
