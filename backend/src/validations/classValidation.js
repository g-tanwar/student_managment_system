const Joi = require('joi');

const createClassSchema = Joi.object({
  className: Joi.string().required(),
  classCode: Joi.string().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
});

const updateClassSchema = Joi.object({
  className: Joi.string(),
  classCode: Joi.string(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE'),
}).min(1);

module.exports = { createClassSchema, updateClassSchema };
