const Joi = require('joi');

const assignFeeSchema = Joi.object({
  studentId: Joi.string().hex().length(24),
  classId: Joi.string().hex().length(24),
  feeType: Joi.string().required(),
  academicYear: Joi.string().required(),
  totalAmount: Joi.number().min(0).required(),
  dueDate: Joi.date().iso().required(),
}).xor('studentId', 'classId').messages({
  'object.xor': 'You must provide strictly either a studentId (for individual) or classId (for batch assignment), not both or neither.'
});

const recordPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('CASH', 'ONLINE', 'CHEQUE', 'BANK_TRANSFER').required(),
  paymentDate: Joi.date().iso(),
  remarks: Joi.string().allow('', null)
});

module.exports = { assignFeeSchema, recordPaymentSchema };
