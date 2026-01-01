const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const prisma = new PrismaClient();

// Get all projects for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User ID not found in request' 
      });
    }

    const projects = await prisma.project.findMany({
      where: { userId: req.userId },
      include: {
        videos: {
          orderBy: { createdAt: 'desc' },
          take: 3
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
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch projects' 
    });
  }
});

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User ID not found in request' 
      });
    }

    const project = await prisma.project.findUnique({
      where: { 
        id: req.params.id
      },
      include: {
        videos: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    
    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    // Check if project belongs to user
    if (project.userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'Access denied' 
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch project' 
    });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User ID not found in request' 
      });
    }

    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false,
        error: 'Project name is required' 
      });
    }
    
    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        userId: req.userId
      }
    });
    
    res.status(201).json({
      success: true,
      data: {
        message: 'Project created successfully',
        ...project
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create project' 
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User ID not found in request' 
      });
    }

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
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
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
      data: {
        message: 'Project updated successfully',
        ...project
      }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update project' 
    });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'User ID not found in request' 
      });
    }

    const { id } = req.params;

    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!project) {
      return res.status(404).json({ 
        success: false,
        error: 'Project not found' 
      });
    }

    // Delete associated videos first
    await prisma.video.deleteMany({
      where: { projectId: id }
    });

    // Delete project
    await prisma.project.delete({
      where: { id }
    });

    res.json({
      success: true,
      data: {
        message: 'Project deleted successfully'
      }
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete project' 
    });
  }
});

module.exports = router;