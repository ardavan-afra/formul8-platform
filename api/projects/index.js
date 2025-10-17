const Project = require('../../server/models/Project');
const { withDB } = require('../_lib/middleware');

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Get all projects
      const projects = await Project.find().populate('professor', 'name email department');
      res.json(projects);
    } else if (req.method === 'POST') {
      // Create new project (requires auth - you'll need to add auth middleware)
      res.status(501).json({ message: 'Create project not implemented yet' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = withDB(handler);
