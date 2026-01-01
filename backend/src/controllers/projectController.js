const { prisma } = require('../config/database');

const projectController = {
  // Get all projects for user
  getAllProjects: async (req, res) => {
    try {
      const projects = await prisma.project.findMany({
        where: { userId: req.userId },
        include: {
          videos: {
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: {
              id: true,
              title: true,
              status: true,
              thumbnail: true,
              createdAt: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      res.json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      console.error('Get projects error:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  },

  // Get single project
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await prisma.project.findFirst({
        where: {
          id,
          userId: req.userId
        },
        include: {
          videos: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              title: true,
              description: true,
              status: true,
              thumbnail: true,
              duration: true,
              filesize: true,
              createdAt: true,
              processedAt: true
            }
          }
        }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Get project error:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  },

  // Create project
  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
      }

      const project = await prisma.project.create({
        data: {
          name,
          description: description || '',
          userId: req.userId
        },
        include: {
          videos: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  },

  // Update project
  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;

      // Check if project exists and belongs to user
      const existingProject = await prisma.project.findFirst({
        where: {
          id,
          userId: req.userId
        }
      });

      if (!existingProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          name: name || existingProject.name,
          description: description !== undefined ? description : existingProject.description,
          status: status || existingProject.status
        }
      });

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  },

  // Delete project
  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id,
          userId: req.userId
        },
        include: { videos: true }
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Delete associated videos first (cascade delete)
      if (project.videos.length > 0) {
        await prisma.video.deleteMany({
          where: { projectId: id }
        });
      }

      // Delete project
      await prisma.project.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Delete project error:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }
};

module.exports = projectController;