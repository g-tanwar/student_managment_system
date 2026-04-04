const classService = require('../services/classService');

const createClass = async (req, res, next) => {
  try {
    const classDoc = await classService.createClass(req.body);
    res.status(201).json({ success: true, data: classDoc });
  } catch (error) {
    next(error);
  }
};

const getClasses = async (req, res, next) => {
  try {
    const data = await classService.getClasses(req.query);
    res.status(200).json({
      success: true,
      data: data.classes,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getClass = async (req, res, next) => {
  try {
    const classDoc = await classService.getClassById(req.params.id);
    res.status(200).json({ success: true, data: classDoc });
  } catch (error) {
    next(error);
  }
};

const updateClass = async (req, res, next) => {
  try {
    const classDoc = await classService.updateClass(req.params.id, req.body);
    res.status(200).json({ success: true, data: classDoc });
  } catch (error) {
    next(error);
  }
};

const deleteClass = async (req, res, next) => {
  try {
    await classService.deleteClass(req.params.id);
    res.status(200).json({ success: true, message: 'Class archived successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
};
