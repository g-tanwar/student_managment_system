const subjectService = require('../services/subjectService');

const createSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

const getSubjects = async (req, res, next) => {
  try {
    const data = await subjectService.getSubjects(req.query);
    res.status(200).json({
      success: true,
      data: data.subjects,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id, req.body);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    await subjectService.deleteSubject(req.params.id);
    res.status(200).json({ success: true, message: 'Subject archived successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
};
