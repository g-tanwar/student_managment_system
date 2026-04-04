const Joi = require('joi');

const createSectionSchema = Joi.object({
  sectionName: Joi.string().required(),
  classId: Joi.string().hex().length(24).required().messages({
    'string.length': 'classId strictly requires a valid 24 character MongoDB ObjectId',
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
});

const updateSectionSchema = Joi.object({
  sectionName: Joi.string(),
  classId: Joi.string().hex().length(24).messages({
    'string.length': 'classId strictly requires a valid 24 character MongoDB ObjectId',
  }),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

module.exports = { createSectionSchema, updateSectionSchema };
