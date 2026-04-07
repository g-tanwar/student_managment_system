const express = require('express');
const feeController = require('../controllers/feeController');
const validate = require('../middlewares/validate.middleware');
const { assignFeeSchema, recordPaymentSchema } = require('../validations/feeValidation');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// ── Student self-service routes (any authenticated user) ──────────────────────
router.get('/me', protect, feeController.fetchMyFees);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.use(protect);
router.use(authorize('ADMIN'));

// Basic Reporting logic
router.get('/', feeController.fetchFeeInvoices);
router.get('/reports/due', feeController.generateDefaulterReport);

// Core Transaction mechanics
router.post('/assign', validate(assignFeeSchema), feeController.issueFee);
router.post('/:id/pay', validate(recordPaymentSchema), feeController.processPayment);

module.exports = router;
