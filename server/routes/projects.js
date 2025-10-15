const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Application = require('../models/Application');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects with optional search and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, department, skills, status, page = 1, limit = 10 } = req.query;
    
    let query = { status: 'active' };
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by department
    if (department) {
      query.department = new RegExp(department, 'i');
    }
    
    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .populate('professor', 'name email department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('professor', 'name email department bio');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Professor only)
router.post('/', [
  auth,
  requireRole(['professor']),
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('department').trim().isLength({ min: 2 }).withMessage('Department is required'),
  body('duration').trim().isLength({ min: 1 }).withMessage('Duration is required'),
  body('timeCommitment').trim().isLength({ min: 1 }).withMessage('Time commitment is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const projectData = {
      ...req.body,
      professor: req.user._id
    };

    const project = new Project(projectData);
    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('professor', 'name email department');

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (Professor who owns the project)
router.put('/:id', [
  auth,
  requireRole(['professor']),
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('professor', 'name email department');

    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (Professor who owns the project)
router.delete('/:id', [auth, requireRole(['professor'])], async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user owns the project
    if (project.professor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    // Delete related applications
    await Application.deleteMany({ project: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/professor/my-projects
// @desc    Get projects created by the current professor
// @access  Private (Professor only)
router.get('/professor/my-projects', [auth, requireRole(['professor'])], async (req, res) => {
  try {
    const projects = await Project.find({ professor: req.user._id })
      .populate('professor', 'name email department')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Get professor projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

