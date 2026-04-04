const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      required: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Maps to the active Auth session token
      required: true,
    },
  },
  { timestamps: true }
);

// CRITICAL DB OPTIMIZATION: 
// 1. Prevent duplicate attendance natively. A student can only have 1 attendance record per calendar day.
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

// 2. High performance fetching index for pulling a whole classroom's daily sheet instantly
attendanceSchema.index({ classId: 1, sectionId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
