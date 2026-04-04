const Joi = require('joi');

const createStudentSchema = Joi.object({
  enrollmentNo: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  dob: Joi.date().iso().required(),
  parentName: Joi.string().required(),
  parentContact: Joi.string().required(),
  classId: Joi.string().hex().length(24).required().messages({
    'string.length': 'classId must be a valid 24 character MongoDB ObjectId',
  }),
  sectionId: Joi.string().hex().length(24).required().messages({
    'string.length': 'sectionId must be a valid 24 character MongoDB ObjectId',
  }),
});

const updateStudentSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dob: Joi.date().iso(),
  parentName: Joi.string(),
  parentContact: Joi.string(),
  classId: Joi.string().hex().length(24),
  sectionId: Joi.string().hex().length(24),
  status: Joi.string().valid('ACTIVE', 'SUSPENDED', 'ALUMNI'),
}).min(1);

module.exports = { createStudentSchema, updateStudentSchema };
