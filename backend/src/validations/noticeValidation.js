const Joi = require('joi');

const createNoticeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  audience: Joi.string().valid('ALL', 'STUDENTS', 'TEACHERS'),
  publishDate: Joi.date().iso(), // Optional, defaults to now mathematically in Schema if missing
  // Safely ensure expiry comes after publish logically during payload inception
  expiryDate: Joi.date().iso().required(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE')
});

const updateNoticeSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  audience: Joi.string().valid('ALL', 'STUDENTS', 'TEACHERS'),
  publishDate: Joi.date().iso(),
  expiryDate: Joi.date().iso(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE')
}).min(1);

module.exports = { createNoticeSchema, updateNoticeSchema };
