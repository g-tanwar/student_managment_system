const examService = require('../services/examService');

const createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

const getExams = async (req, res, next) => {
  try {
    const data = await examService.getExams(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

const getExam = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(req.params.id);
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

const updateExam = async (req, res, next) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body);
    res.status(200).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

const deleteExam = async (req, res, next) => {
  try {
    await examService.deleteExam(req.params.id);
    res.status(200).json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getExams,
  getExam,
  updateExam,
  deleteExam,
};
