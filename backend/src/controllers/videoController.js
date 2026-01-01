const { prisma } = require('../config/database');
const path = require('path');
const fs = require('fs');
const MockAIService = require('../services/mockAIService');

const videoController = {
  // Upload video
  uploadVideo: async (req, res) => {
    try {
      if (!req.userId) {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'No video file uploaded' 
        });
      }

      const { title, description, projectId } = req.body;

      if (!projectId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ 
          success: false,
          error: 'Project ID is required' 
        });
      }

      // Validate project exists and belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.userId
        }
      });

      if (!project) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ 
          success: false,
          error: 'Project not found' 
        });
      }

      // Create video record
      const video = await prisma.video.create({
        data: {
          title: title || req.file.originalname,
          description: description || '',
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
          filesize: req.file.size,
          filetype: req.file.mimetype,
          projectId: projectId,
          status: 'pending'
        }
      });

      res.status(201).json({
        success: true,
        data: {
          message: 'Video uploaded successfully',
          ...video
        }
      });
    } catch (error) {
      console.error('Upload video error:', error);
      
      // Clean up file on error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        success: false,
        error: 'Failed to upload video' 
      });
    }
  },

  // Get videos by project
  getVideosByProject: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      const { projectId } = req.params;

      // Verify project belongs to user
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: req.userId
        }
      });

      if (!project) {
        return res.status(404).json({ 
          success: false,
          error: 'Project not found' 
        });
      }

      const videos = await prisma.video.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: videos,
        count: videos.length
      });
    } catch (error) {
      console.error('Get videos error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch videos' 
      });
    }
  },

  // Get single video
  getVideoById: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      const { id } = req.params;

      const video = await prisma.video.findFirst({
        where: { id },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              userId: true
            }
          }
        }
      });

      if (!video) {
        return res.status(404).json({ 
          success: false,
          error: 'Video not found' 
        });
      }

      // Verify user owns the video
      if (video.project.userId !== req.userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }

      res.json({
        success: true,
        data: video
      });
    } catch (error) {
      console.error('Get video error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch video' 
      });
    }
  },

  // Process video with AI
  processVideo: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      const { id } = req.params;

      const video = await prisma.video.findFirst({
        where: { id },
        include: {
          project: {
            select: { userId: true }
          }
        }
      });

      if (!video) {
        return res.status(404).json({ 
          success: false,
          error: 'Video not found' 
        });
      }

      // Verify user owns the video
      if (video.project.userId !== req.userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }

      // Update status to processing
      await prisma.video.update({
        where: { id: video.id },
        data: { 
          status: 'processing', 
          processingProgress: 10,
          errorMessage: null
        }
      });

      // Start AI processing in background
      setTimeout(() => {
        videoController.startAIProcessing(video.id);
      }, 100);

      res.json({
        success: true,
        message: 'AI processing started',
        data: {
          videoId: video.id,
          status: 'processing'
        }
      });
    } catch (error) {
      console.error('Process video error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to start processing' 
      });
    }
  },

  // Background AI processing function
  startAIProcessing: async (videoId) => {
    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId }
      });

      if (!video) {
        console.error(`Video ${videoId} not found for processing`);
        return;
      }

      // Simulate progressive processing
      const progressSteps = [20, 40, 60, 80, 100];
      for (const progress of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await prisma.video.update({
          where: { id: videoId },
          data: { processingProgress: progress }
        });
      }

      // Get mock AI results
      const aiResults = await MockAIService.processVideo(video);

      // Update video with AI results
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'completed',
          processingProgress: 100,
          transcript: aiResults.transcript,
          aiScript: aiResults.aiScript,
          captions: aiResults.captions,
          cuts: aiResults.cuts,
          voiceover: aiResults.voiceover,
          zoomPoints: aiResults.zoomPoints,
          processedAt: new Date()
        }
      });

      console.log(`✅ AI processing completed for video: ${video.title}`);
    } catch (error) {
      console.error('❌ AI processing error:', error);
      await prisma.video.update({
        where: { id: videoId },
        data: { 
          status: 'failed',
          errorMessage: error.message 
        }
      });
    }
  },

  // Get video processing status
  getVideoStatus: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      const { id } = req.params;

      const video = await prisma.video.findFirst({
        where: { id },
        include: {
          project: {
            select: { userId: true }
          }
        }
      });

      if (!video) {
        return res.status(404).json({ 
          success: false,
          error: 'Video not found' 
        });
      }

      // Verify user owns the video
      if (video.project.userId !== req.userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }

      res.json({
        success: true,
        data: {
          id: video.id,
          status: video.status,
          processingProgress: video.processingProgress,
          errorMessage: video.errorMessage
        }
      });
    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get status' 
      });
    }
  },

  // Delete video
  deleteVideo: async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ 
          success: false,
          error: 'User ID not found in request' 
        });
      }

      const { id } = req.params;

      const video = await prisma.video.findFirst({
        where: { id },
        include: {
          project: {
            select: { userId: true }
          }
        }
      });

      if (!video) {
        return res.status(404).json({ 
          success: false,
          error: 'Video not found' 
        });
      }

      // Verify user owns the video
      if (video.project.userId !== req.userId) {
        return res.status(403).json({ 
          success: false,
          error: 'Access denied' 
        });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '../../../uploads', video.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await prisma.video.delete({ where: { id } });

      res.json({
        success: true,
        message: 'Video deleted successfully'
      });
    } catch (error) {
      console.error('Delete video error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to delete video' 
      });
    }
  }
};

module.exports = videoController;