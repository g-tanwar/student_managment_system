const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwtUtils');
const RepositoryFactory = require('../factories/repositoryFactory');

const userRepository = RepositoryFactory.create('user');

const loginAdmin = async (email, password) => {
  // Try to find the user. Use +password to force selection since it's hidden by default
  const user = await userRepository.findOne({ email }).select('+password');
  
  if (!user) {
    throw new ApiError(401, 'Invalid credentials setup or unauthorized');
  }
  
  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  // Compare hash
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials setup or password');
  }

  // Build clean session
  const token = generateToken(user._id, user.role);
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

const getAdminProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new ApiError(404, 'User profile could not be found');
  return user;
};

const seedDefaultAdmin = async () => {
  const adminExists = await userRepository.findOne({ role: 'ADMIN' });
  if (adminExists) {
    throw new ApiError(400, 'Seed rejected: An admin account already exists');
  }

  const seedEmail = process.env.ADMIN_SEED_EMAIL || 'admin@school.com';
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedPassword) {
    throw new ApiError(500, 'Seed misconfigured: ADMIN_SEED_PASSWORD env var is required');
  }

  const admin = await userRepository.create({
    email: seedEmail,
    password: seedPassword,
    role: 'ADMIN',
  });

  const response = admin.toObject();
  delete response.password;
  
  return response;
};

const signupUser = async (email, password) => {
  let existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await userRepository.create({
    email,
    password, 
    role: 'STUDENT',
    isActive: true,
  });

  console.log(`[AUTH] New user account created via Signup: ${email}`);

  const token = generateToken(user._id, user.role);
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

module.exports = { loginAdmin, getAdminProfile, seedDefaultAdmin, signupUser };
