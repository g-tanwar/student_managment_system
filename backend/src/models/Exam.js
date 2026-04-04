const mongoose = require('mongoose');

const subjectScheduleSchema = new mongoose.Schema(
  {
    subjectId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Subject', 
      required: true 
    },
    examDate: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String, 
      required: true // e.g., "09:00 AM"
    }, 
    endTime: { 
      type: String, 
      required: true // e.g., "12:00 PM"
    },   
    maxMarks: { 
      type: Number, 
      required: true 
    },
    passingMarks: { 
      type: Number, 
      required: true 
    }
  },
  { _id: true }
);

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
      index: true
    },
    academicYear: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      index: true // Optional: applies to the whole class if omitted
    },
    schedule: [subjectScheduleSchema],
    status: {
      type: String,
      enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'PUBLISHED'],
      default: 'SCHEDULED'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
