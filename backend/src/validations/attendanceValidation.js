const Joi = require('joi');

const markSingleSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  classId: Joi.string().hex().length(24).required(),
  sectionId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE').required(),
});

const bulkMarkSchema = Joi.object({
  classId: Joi.string().hex().length(24).required(),
  sectionId: Joi.string().hex().length(24).required(),
  date: Joi.date().iso().required(),
  records: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE').required(),
      })
    )
    .min(1)
    .required()
    .messages({ 'array.min': 'Must submit at least 1 student attendance record' }),
});

const updateSchema = Joi.object({
  status: Joi.string().valid('PRESENT', 'ABSENT', 'LATE').required(),
});

module.exports = { markSingleSchema, bulkMarkSchema, updateSchema };
