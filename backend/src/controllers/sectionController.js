const sectionService = require('../services/sectionService');

const createSection = async (req, res, next) => {
  try {
    const section = await sectionService.createSection(req.body);
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

const getSections = async (req, res, next) => {
  try {
    const data = await sectionService.getSections(req.query);
    res.status(200).json({
      success: true,
      data: data.sections,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getSection = async (req, res, next) => {
  try {
    const section = await sectionService.getSectionById(req.params.id);
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

const updateSection = async (req, res, next) => {
  try {
    const section = await sectionService.updateSection(req.params.id, req.body);
    res.status(200).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

const deleteSection = async (req, res, next) => {
  try {
    await sectionService.deleteSection(req.params.id);
    res.status(200).json({ success: true, message: 'Section archived successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection,
};
