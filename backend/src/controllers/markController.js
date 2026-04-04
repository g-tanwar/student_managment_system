const markService = require('../services/markService');

const submitMark = async (req, res, next) => {
  try {
    const mark = await markService.submitSingleMark(req.body);
    res.status(201).json({ success: true, data: mark });
  } catch (error) {
    next(error);
  }
};

const submitBulk = async (req, res, next) => {
  try {
    const marks = await markService.submitMarksBulk(req.body);
    res.status(201).json({ success: true, message: `Effectively recorded ${marks.length} marks cleanly.` });
  } catch (error) {
    next(error);
  }
};

const getStudentMarksheet = async (req, res, next) => {
  try {
    const marksheet = await markService.getMarksheetForStudent(req.params.studentId, req.query);
    res.status(200).json({ success: true, data: marksheet });
  } catch (error) {
    next(error);
  }
};

const getClassRanking = async (req, res, next) => {
  try {
    const ranking = await markService.getClassExamMarks(req.params.examId, req.query);
    res.status(200).json({ success: true, count: ranking.length, data: ranking });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitMark, submitBulk, getStudentMarksheet, getClassRanking };
