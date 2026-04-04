const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    audience: { 
      type: String, 
      enum: ['ALL', 'STUDENTS', 'TEACHERS'], 
      default: 'ALL' 
    },
    publishDate: { 
      type: Date, 
      default: Date.now 
    },
    expiryDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['ACTIVE', 'INACTIVE'], 
      default: 'ACTIVE' 
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  },
  { timestamps: true }
);

// Optimize fast querying when finding active dashboard feeds natively
noticeSchema.index({ status: 1, audience: 1, publishDate: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
