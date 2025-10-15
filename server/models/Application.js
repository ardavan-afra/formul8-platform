const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true,
    maxlength: 1000
  },
  relevantExperience: {
    type: String,
    maxlength: 1000
  },
  motivation: {
    type: String,
    required: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  professorNotes: {
    type: String,
    maxlength: 1000
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure one application per student per project
applicationSchema.index({ student: 1, project: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

