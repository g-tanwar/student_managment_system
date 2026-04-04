const Fee = require('../models/Fee');
const Student = require('../models/Student');
const ApiError = require('../utils/ApiError');

// PART A: Assign fee to a single student or batch to an entire class
const assignFee = async (data) => {
  const { studentId, classId, feeType, academicYear, totalAmount, dueDate } = data;

  if (studentId) {
    const student = await Student.findById(studentId);
    if (!student) throw new ApiError(404, 'Student not found');

    const fee = await Fee.create({
      studentId,
      classId: student.classId, // Pull dynamically from the student profile
      feeType,
      academicYear,
      totalAmount,
      dueDate,
    });
    return { assignedCount: 1, fees: [fee] };

  } else if (classId) {
    // Blanket class assignment grabs all currently enrolled active students
    const students = await Student.find({ classId, isActive: true });
    
    if (!students.length) {
      throw new ApiError(404, 'Class contains no active students to assign fees to');
    }

    const feeDocs = students.map((student) => ({
      studentId: student._id,
      classId: student.classId,
      feeType,
      academicYear,
      totalAmount,
      dueDate,
    }));

    const fees = await Fee.insertMany(feeDocs);
    return { assignedCount: fees.length, fees };
  }
};

// PART B: Logging transactions securely
const recordPayment = async (feeId, paymentData, userId) => {
  const fee = await Fee.findById(feeId);
  if (!fee) throw new ApiError(404, 'Primary Fee invoice not found');

  if (fee.status === 'PAID') {
    throw new ApiError(400, 'This invoice has already been fully paid');
  }

  const outstanding = fee.totalAmount - fee.paidAmount;

  if (paymentData.amount > outstanding) {
    throw new ApiError(400, `Payment validation rejected: Attempted to pay ${paymentData.amount} but only ${outstanding} is currently due.`);
  }

  // Update tallies
  fee.paidAmount += paymentData.amount;

  if (fee.paidAmount >= fee.totalAmount) {
    fee.status = 'PAID';
  } else if (fee.paidAmount > 0) {
    fee.status = 'PARTIALLY_PAID';
  }

  // Atomically push historical tracker entry
  fee.payments.push({
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    remarks: paymentData.remarks,
    paymentDate: paymentData.paymentDate || new Date(),
    recordedBy: userId,
  });

  await fee.save();
  return fee;
};

// REPORTING ENDPOINTS
const getFeeInvoices = async (query) => {
  const { page = 1, limit = 10, studentId, classId, status, academicYear } = query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (studentId) filter.studentId = studentId;
  if (classId) filter.classId = classId;
  if (status) filter.status = status;
  if (academicYear) filter.academicYear = academicYear;

  const fees = await Fee.find(filter)
    .populate('studentId', 'firstName lastName enrollmentNo')
    .populate('classId', 'className')
    .skip(Number(skip))
    .limit(Number(limit))
    .sort({ dueDate: 1 });

  const total = await Fee.countDocuments(filter);

  return { fees, pagination: { total, page: Number(page), limit: Number(limit) } };
};

const getAggregatedDueReport = async () => {
    // Generate a quick snapshot summation grouping by class
    const report = await Fee.aggregate([
        { $match: { status: { $ne: 'PAID' } } },
        { 
            $project: {
                classId: 1,
                dueAmount: { $subtract: ["$totalAmount", "$paidAmount"] }
            }
        },
        {
            $group: {
                _id: "$classId",
                totalStudentsDues: { $sum: 1 },
                totalAmountDue: { $sum: "$dueAmount" }
            }
        }
    ]);
    
    // Explicit populate to translate raw ids
    return await Fee.populate(report, { path: '_id', model: 'Class', select: 'className classCode' });
};

module.exports = { assignFee, recordPayment, getFeeInvoices, getAggregatedDueReport };
