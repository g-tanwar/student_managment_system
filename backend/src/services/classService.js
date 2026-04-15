const Class = require('../models/Class');
const ApiError = require('../utils/ApiError');
const BaseRepository = require('../repositories/BaseRepository');

const classRepository = new BaseRepository(Class);

const createClass = async (data) => {
  // Prevent duplicate names or codes
  const existingClass = await classRepository.findOne({
    $or: [{ className: data.className }, { classCode: data.classCode }],
  });
  
  if (existingClass) {
    throw new ApiError(400, 'A class with this exact Name or Code already exists');
  }

  return await classRepository.create(data);
};

const getClasses = async (query) => {
  const { page = 1, limit = 10, search, status } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;

  if (search) {
    filter.$or = [
      { className: { $regex: search, $options: 'i' } },
      { classCode: { $regex: search, $options: 'i' } },
    ];
  }

  const classes = await classRepository.find(filter)
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await classRepository.count(filter);

  return {
    classes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getClassById = async (id) => {
  const classDoc = await classRepository.findById(id);
  if (!classDoc) {
    throw new ApiError(404, 'Class mapping not found');
  }
  return classDoc;
};

const updateClass = async (id, updateData) => {
  const classDoc = await classRepository.updateById(id, updateData, { 
    new: true, 
    runValidators: true 
  });
  
  if (!classDoc) {
    throw new ApiError(404, 'Class mapping not found');
  }
  
  return classDoc;
};

const deleteClass = async (id) => {
  // Using status shifting to prevent foreign key breakages across the DB for historical data
  const classDoc = await classRepository.updateById(
    id, 
    { status: 'INACTIVE' }, 
    { new: true }
  );
  
  if (!classDoc) {
    throw new ApiError(404, 'Class mapping not found');
  }
  
  return true;
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};
