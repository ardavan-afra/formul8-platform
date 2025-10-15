const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['document', 'image', 'video', 'link', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  requirements: {
    gpa: {
      type: Number,
      min: 0,
      max: 4.0
    },
    year: [{
      type: String,
      enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']
    }],
    prerequisites: [{
      type: String,
      trim: true
    }]
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  timeCommitment: {
    type: String,
    required: true,
    trim: true
  },
  compensation: {
    type: String,
    enum: ['unpaid', 'stipend', 'course_credit', 'hourly'],
    default: 'unpaid'
  },
  compensationAmount: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  maxStudents: {
    type: Number,
    default: 1,
    min: 1
  },
  currentStudents: {
    type: Number,
    default: 0,
    min: 0
  },
  materials: [materialSchema],
  tags: [{
    type: String,
    trim: true
  }],
  applicationDeadline: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
projectSchema.index({
  title: 'text',
  description: 'text',
  department: 'text',
  skills: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Project', projectSchema);

