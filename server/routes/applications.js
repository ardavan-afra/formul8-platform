const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Project = require('../models/Project');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/applications
// @desc    Submit an application for a project
// @access  Private (Student only)
router.post('/', [
  auth,
  requireRole(['student']),
  body('projectId').isMongoId().withMessage('Valid project ID is required'),
  body('coverLetter').trim().isLength({ min: 50 }).withMessage('Cover letter must be at least 50 characters'),
  body('motivation').trim().isLength({ min: 50 }).withMessage('Motivation must be at least 50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId, coverLetter, relevantExperience, motivation } = req.body;

    // Check if project exists and is active
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'active') {
      return res.status(400).json({ message: 'Project is not accepting applications' });
    }

    // Check if application deadline has passed
    if (project.applicationDeadline && new Date() > project.applicationDeadline) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: req.user._id,
      project: projectId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this project' });
    }

    // Create new application
    const application = new Application({
      student: req.user._id,
      project: projectId,
      professor: project.professor,
      coverLetter,
      relevantExperience,
      motivation
    });

    await application.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('student', 'name email department year gpa skills')
      .populate('project', 'title description department')
      .populate('professor', 'name email department');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/student/my-applications
// @desc    Get applications submitted by the current student
// @access  Private (Student only)
router.get('/student/my-applications', [auth, requireRole(['student'])], async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('project', 'title description department status')
      .populate('professor', 'name email department')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get student applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/professor/my-project-applications
// @desc    Get applications for projects created by the current professor
// @access  Private (Professor only)
router.get('/professor/my-project-applications', [auth, requireRole(['professor'])], async (req, res) => {
  try {
    const applications = await Application.find({ professor: req.user._id })
      .populate('student', 'name email department year gpa skills interests')
      .populate('project', 'title description department')
      .sort({ applicationDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get professor applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (accept/reject)
// @access  Private (Professor only)
router.put('/:id/status', [
  auth,
  requireRole(['professor']),
  body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected'),
  body('professorNotes').optional().trim().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, professorNotes } = req.body;

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if professor owns the project
    if (application.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // If accepting, check if project has capacity
    if (status === 'accepted') {
      const project = await Project.findById(application.project);
      if (project.currentStudents >= project.maxStudents) {
        return res.status(400).json({ message: 'Project has reached maximum capacity' });
      }
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        professorNotes,
        responseDate: new Date()
      },
      { new: true, runValidators: true }
    )
    .populate('student', 'name email department year gpa skills')
    .populate('project', 'title description department')
    .populate('professor', 'name email department');

    // Update project student count if accepted
    if (status === 'accepted') {
      await Project.findByIdAndUpdate(application.project, {
        $inc: { currentStudents: 1 }
      });
    }

    res.json(updatedApplication);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Withdraw an application
// @access  Private (Student who submitted the application)
router.delete('/:id', [auth, requireRole(['student'])], async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if student owns the application
    if (application.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    // Check if application is still pending
    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot withdraw application that has been processed' });
    }

    await Application.findByIdAndUpdate(req.params.id, { status: 'withdrawn' });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

