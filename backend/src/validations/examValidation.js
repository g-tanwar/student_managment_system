const Joi = require('joi');

const subjectScheduleJoi = Joi.object({
  subjectId: Joi.string().hex().length(24).required(),
  examDate: Joi.date().iso().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  maxMarks: Joi.number().min(1).required(),
  passingMarks: Joi.number().min(0).required()
});

const createExamSchema = Joi.object({
  examName: Joi.string().required(),
  academicYear: Joi.string().required(),
  classId: Joi.string().hex().length(24).required(),
  sectionId: Joi.string().hex().length(24).allow(null, ''),
  schedule: Joi.array().items(subjectScheduleJoi).min(1).required(),
  status: Joi.string().valid('SCHEDULED', 'ONGOING', 'COMPLETED', 'PUBLISHED')
});

const updateExamSchema = Joi.object({
  examName: Joi.string(),
  academicYear: Joi.string(),
  classId: Joi.string().hex().length(24),
  sectionId: Joi.string().hex().length(24).allow(null, ''),
  schedule: Joi.array().items(subjectScheduleJoi),
  status: Joi.string().valid('SCHEDULED', 'ONGOING', 'COMPLETED', 'PUBLISHED')
}).min(1);

module.exports = { createExamSchema, updateExamSchema };
