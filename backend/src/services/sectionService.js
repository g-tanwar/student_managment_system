const ApiError = require('../utils/ApiError');
const RepositoryFactory = require('../factories/repositoryFactory');

const { section: sectionRepository, class: classRepository } = RepositoryFactory.createMany(['section', 'class']);

const createSection = async (data) => {
  // Validate that the mapping class explicitly exists securely
  const existingClass = await classRepository.findById(data.classId);
  if (!existingClass) {
    throw new ApiError(404, 'Invalid Database Reference: The assigned Class does not exist');
  }

  // Double down on checking combinations to block DB rejection errors manually
  const existingSection = await sectionRepository.findOne({ classId: data.classId, sectionName: data.sectionName });
  if (existingSection) {
    throw new ApiError(400, 'A Section with this exact name already exists in the requested Class');
  }

  return await sectionRepository.create(data);
};

const getSections = async (query) => {
  const { page = 1, limit = 10, search, status, classId } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (classId) filter.classId = classId;

  if (search) {
    filter.sectionName = { $regex: search, $options: 'i' };
  }

  const sections = await sectionRepository.find(filter)
    .populate('classId', 'className classCode status')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await sectionRepository.count(filter);

  return {
    sections,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getSectionById = async (id) => {
  const section = await sectionRepository.findById(id).populate('classId', 'className classCode status');
  if (!section) {
    throw new ApiError(404, 'Section lookup failed');
  }
  return section;
};

const updateSection = async (id, updateData) => {
  // Defensive logic checking constraints if class mapping gets updated
  if (updateData.classId) {
    const existingClass = await classRepository.findById(updateData.classId);
    if (!existingClass) {
      throw new ApiError(404, 'Invalid Database Reference: Target Class mapping does not exist');
    }
  }

  // Checks combinations to avoid compound unique DB crashes 
  if (updateData.sectionName || updateData.classId) {
    const targetSection = await sectionRepository.findById(id);
    if (!targetSection) throw new ApiError(404, 'Section not found');

    const checkingClassId = updateData.classId || targetSection.classId;
    const checkingSectionName = updateData.sectionName || targetSection.sectionName;

    const duplicateCheck = await sectionRepository.findOne({
      _id: { $ne: id }, // Compare others only
      classId: checkingClassId,
      sectionName: checkingSectionName
    });

    if (duplicateCheck) {
      throw new ApiError(400, 'Conflict: This Section name is already assigned inside the target Class structure');
    }
  }

  const section = await sectionRepository.updateById(id, updateData, { 
    new: true, 
    runValidators: true 
  });
  
  return section;
};

const deleteSection = async (id) => {
  const section = await sectionRepository.updateById(
    id, 
    { status: 'INACTIVE' }, 
    { new: true }
  );
  
  if (!section) {
    throw new ApiError(404, 'Section lookup failed');
  }
  
  return true;
};

module.exports = {
  createSection,
  getSections,
  getSectionById,
  updateSection,
  deleteSection,
};
