const teacherService = require('../services/teacherService');

const createTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.createTeacher(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const data = await teacherService.getTeachers(req.query);
    res.status(200).json({
      success: true,
      data: data.teachers,
      pagination: data.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.getTeacherById(req.params.id);
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

const deleteTeacher = async (req, res, next) => {
  try {
    await teacherService.softDeleteTeacher(req.params.id);
    res.status(200).json({ success: true, message: 'Teacher archived successfully and access revoked' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
};
