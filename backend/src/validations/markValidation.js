const Joi = require('joi');

const submitMarkSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  examId: Joi.string().hex().length(24).required(),
  subjectId: Joi.string().hex().length(24).required(),
  obtainedMarks: Joi.number().min(0).required(),
  totalMarks: Joi.number().min(1).required(),
  remarks: Joi.string().allow('', null),
});

const bulkSubmitMarkSchema = Joi.object({
  examId: Joi.string().hex().length(24).required(),
  subjectId: Joi.string().hex().length(24).required(),
  totalMarks: Joi.number().min(1).required(),
  records: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().hex().length(24).required(),
        obtainedMarks: Joi.number().min(0).required(),
        remarks: Joi.string().allow('', null),
      })
    )
    .min(1)
    .required(),
});

module.exports = { submitMarkSchema, bulkSubmitMarkSchema };
