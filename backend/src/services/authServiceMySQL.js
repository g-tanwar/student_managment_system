const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserMySQL');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');

/**
 * Pre-generate salt for bcrypt (avoids regenerating on every call).
 * Salt rounds of 10 balances security vs. hashing speed (~10 hashes/sec).
 * Going to 12 doubles the time; 10 is the recommended sweet spot.
 */
const SALT_ROUNDS = 10;

/**
 * Hash a plain-text password using bcrypt.
 * @param {string} plainPassword
 * @returns {Promise<string>} bcrypt hash (60 chars)
 */
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * Signup — Register a new user account.
 *
 * Flow:
 *  1. Check for duplicate email (indexed lookup)
 *  2. Hash password with bcrypt
 *  3. Insert user row
 *  4. Generate JWT and return
 *
 * @param {string} email
 * @param {string} password
 * @param {string} [role='STUDENT']
 * @returns {Promise<{ user: Object, token: string }>}
 */
const signupUser = async (email, password, role = 'STUDENT') => {
  // 1. Check for existing user (uses UNIQUE index → fast)
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // 2. Hash the password (async, non-blocking)
  const hashedPassword = await hashPassword(password);

  // 3. Insert user
  const user = await UserModel.create({
    email,
    password: hashedPassword,
    role,
  });

  console.log(`[AUTH] New user registered: ${email} (role: ${role})`);

  // 4. Generate JWT
  const token = generateToken(user.id, user.role);

  return { user, token };
};

/**
 * Login — Authenticate an existing user.
 *
 * Flow:
 *  1. Fetch user by email (include password hash)
 *  2. Verify account is active
 *  3. Compare password with bcrypt
 *  4. Generate JWT and return
 *
 * Security: Uses the same error message for "user not found" and
 * "wrong password" to prevent email enumeration attacks.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: Object, token: string }>}
 */
const loginUser = async (email, password) => {
  // 1. Fetch user with password hash
  const user = await UserModel.findByEmail(email, true);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2. Check active status
  if (!user.is_active) {
    throw new ApiError(403, 'This account has been deactivated. Contact admin.');
  }

  // 3. Compare password (bcrypt.compare is timing-safe)
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 4. Strip password from response
  const { password: _, ...safeUser } = user;

  // 5. Generate JWT
  const token = generateToken(safeUser.id, safeUser.role);

  return { user: safeUser, token };
};

/**
 * Get user profile by ID.
 *
 * @param {number} userId
 * @returns {Promise<Object>}
 */
const getUserProfile = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

/**
 * Seed a default admin account (for first-time setup).
 *
 * @returns {Promise<Object>} Created admin user (no password)
 */
const seedDefaultAdmin = async () => {
  const exists = await UserModel.adminExists();
  if (exists) {
    throw new ApiError(400, 'An admin account already exists');
  }

  const hashedPassword = await hashPassword('password123');
  const admin = await UserModel.create({
    email: 'admin@school.com',
    password: hashedPassword,
    role: 'ADMIN',
  });

  console.log('[AUTH] Default admin account seeded');
  return admin;
};

module.exports = { signupUser, loginUser, getUserProfile, seedDefaultAdmin };
