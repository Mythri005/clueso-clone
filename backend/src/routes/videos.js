const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const videoController = require('../controllers/videoController');
const router = express.Router();
const prisma = new PrismaClient();

// Upload video
router.post('/upload', authenticateToken, upload.single('video'), videoController.uploadVideo);

// Get all videos for project
router.get('/project/:projectId', authenticateToken, videoController.getVideosByProject);

// Get single video
router.get('/:id', authenticateToken, videoController.getVideoById);

// Process video with AI
router.post('/:id/process', authenticateToken, videoController.processVideo);

// Get video processing status
router.get('/:id/status', authenticateToken, videoController.getVideoStatus);

// Delete video
router.delete('/:id', authenticateToken, videoController.deleteVideo);

module.exports = router;