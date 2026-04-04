const Joi = require('joi');

const createSubjectSchema = Joi.object({
  subjectName: Joi.string().required(),
  subjectCode: Joi.string().required(),
  classId: Joi.string().hex().length(24).required().messages({
    'string.length': 'classId strictly requires a valid 24 character MongoDB ObjectId',
  }),
  teacherId: Joi.string().hex().length(24).messages({
    'string.length': 'teacherId must be a valid 24 character MongoDB ObjectId if provided',
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
});

const updateSubjectSchema = Joi.object({
  subjectName: Joi.string(),
  subjectCode: Joi.string(),
  classId: Joi.string().hex().length(24),
  teacherId: Joi.string().hex().length(24).allow(null, ''), // Allows unassigning teacher
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

module.exports = { createSubjectSchema, updateSubjectSchema };
