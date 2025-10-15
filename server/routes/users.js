const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        bio: req.user.bio,
        skills: req.user.skills,
        interests: req.user.interests,
        gpa: req.user.gpa,
        year: req.user.year,
        avatar: req.user.avatar
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('gpa').optional().isFloat({ min: 0, max: 4.0 }).withMessage('GPA must be between 0 and 4.0'),
  body('year').optional().isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid year')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const allowedUpdates = ['name', 'bio', 'skills', 'interests', 'gpa', 'year', 'avatar'];
    const updates = {};

    // Only allow certain fields to be updated
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        gpa: user.gpa,
        year: user.year,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/departments
// @desc    Get list of departments
// @access  Public
router.get('/departments', async (req, res) => {
  try {
    const departments = await User.distinct('department');
    res.json(departments.sort());
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/skills
// @desc    Get list of all skills
// @access  Public
router.get('/skills', async (req, res) => {
  try {
    const skills = await User.distinct('skills');
    res.json(skills.sort());
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

