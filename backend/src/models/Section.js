const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      index: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
    },
  },
  { timestamps: true }
);

// Prevent duplicate section names within the exact same class hierarchy
sectionSchema.index({ classId: 1, sectionName: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);
