const Joi = require('joi');

const createTeacherSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  employeeId: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  dob: Joi.date().iso().required(),
  contactNumber: Joi.string().required(),
  address: Joi.string(),
  qualifications: Joi.array().items(Joi.string()),
  joinDate: Joi.date().iso(),
});

const updateTeacherSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
  dob: Joi.date().iso(),
  contactNumber: Joi.string(),
  address: Joi.string(),
  qualifications: Joi.array().items(Joi.string()),
  subjectsHandled: Joi.array().items(Joi.string().hex().length(24)),
  isActive: Joi.boolean(), // Used to toggle active/inactive explicitly
}).min(1);

module.exports = { createTeacherSchema, updateTeacherSchema };
