const ApiError = require('../utils/ApiError');
const RepositoryFactory = require('../factories/repositoryFactory');

const { teacher: teacherRepository, user: userRepository } = RepositoryFactory.createMany(['teacher', 'user']);

const createTeacher = async (data) => {
  const { email, password, ...teacherData } = data;

  const existingUser = await userRepository.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'A user account with this email already exists');
  }

  const existingTeacher = await teacherRepository.findOne({ employeeId: teacherData.employeeId });
  if (existingTeacher) {
    throw new ApiError(400, 'A teacher with this Employee ID already exists');
  }

  const user = await userRepository.create({ email, password, role: 'TEACHER' });

  try {
    const teacher = await teacherRepository.create({ ...teacherData, userId: user._id });
    return teacher;
  } catch (error) {
    // Cleanup orphaned auth account if profile fails to map
    await userRepository.deleteById(user._id);
    throw error;
  }
};

const getTeachers = async (query) => {
  const { page = 1, limit = 10, search, isActive } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true'; // allows pulling suspended teachers if queried explicitly
  } else {
    filter.isActive = true; // default fetch active only
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  const teachers = await teacherRepository.find(filter)
    .populate('userId', 'email role isActive')
    .populate('subjectsHandled', 'name code') // Safely degrades if Subject models aren't present yet
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await teacherRepository.count(filter);

  return {
    teachers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getTeacherById = async (id) => {
  const teacher = await teacherRepository.findById(id)
    .populate('userId', 'email role isActive')
    .populate('subjectsHandled', 'name code');

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }
  return teacher;
};

const updateTeacher = async (id, updateData) => {
  // If subjectsHandled is sent, mongo overwrites the whole array natively keeping it clean assignment
  const teacher = await teacherRepository.updateById(id, updateData, { 
    new: true, 
    runValidators: true 
  });

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }
  
  // If explicitly suspending/activating from the route, sync security block to Auth Account
  if (updateData.isActive !== undefined) {
    await userRepository.updateById(teacher.userId, { isActive: updateData.isActive });
  }

  return teacher;
};

const softDeleteTeacher = async (id) => {
  const teacher = await teacherRepository.updateById(
    id,
    { isActive: false },
    { new: true }
  );

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  // Deactivate login capabilities seamlessly during soft drop
  await userRepository.updateById(teacher.userId, { isActive: false });
  return true;
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  softDeleteTeacher,
};
