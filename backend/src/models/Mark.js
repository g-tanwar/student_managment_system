const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
      index: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
      index: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Critical Application Guardrail: 
// A single student can NEVER be graded simultaneously twice for exact matching Subject and Match Term Examination physically.
markSchema.index({ studentId: 1, examId: 1, subjectId: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
