const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { 
      type: String, 
      enum: ['CASH', 'ONLINE', 'CHEQUE', 'BANK_TRANSFER'], 
      required: true 
    },
    remarks: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { _id: true, timestamps: true }
);

const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,     
    },
    feeType: {
      type: String,
      required: true, // e.g., 'Tuition Fee', 'Transport Fee'
    },
    academicYear: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID'],
      default: 'UNPAID',
    },
    payments: [paymentSchema], // Embedded subdoc array to natively track history logs
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual property to dynamically compute outstanding balance
feeSchema.virtual('dueAmount').get(function () {
  return this.totalAmount - this.paidAmount;
});

module.exports = mongoose.model('Fee', feeSchema);
