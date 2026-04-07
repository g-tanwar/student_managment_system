const feeService = require('../services/feeService');

// Student self-service: fetch own fee records
const fetchMyFees = async (req, res, next) => {
  try {
    const studentId = req.user.id || req.user._id;
    const data = await feeService.getFeeInvoices({ studentId, limit: 50 });
    res.status(200).json({ success: true, data: data.fees });
  } catch (error) {
    next(error);
  }
};

// Part A implementation
const issueFee = async (req, res, next) => {
  try {
    const result = await feeService.assignFee(req.body);
    res.status(201).json({ success: true, message: `Successfully assigned fees to ${result.assignedCount} entity/entities` });
  } catch (error) {
    next(error);
  }
};

// Part B implementation
const processPayment = async (req, res, next) => {
  try {
    // req.user.id injected by auth.middleware
    const updatedFee = await feeService.recordPayment(req.params.id, req.body, req.user.id);
    res.status(200).json({ success: true, message: 'Payment successfully logged', data: updatedFee });
  } catch (error) {
    next(error);
  }
};

// Reporting
const fetchFeeInvoices = async (req, res, next) => {
  try {
    const data = await feeService.getFeeInvoices(req.query);
    res.status(200).json({ success: true, count: data.fees.length, data: data.fees, pagination: data.pagination });
  } catch (error) {
    next(error);
  }
};

const generateDefaulterReport = async (req, res, next) => {
  try {
    const report = await feeService.getAggregatedDueReport();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

module.exports = { fetchMyFees, issueFee, processPayment, fetchFeeInvoices, generateDefaulterReport };
