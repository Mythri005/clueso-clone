import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  TextField
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
  Videocam as VideocamIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { projectAPI, videoAPI } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoMenuAnchor, setVideoMenuAnchor] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  // Fetch project data
  const fetchProject = useCallback(async () => {
    try {
      const response = await projectAPI.getById(id);
      const projectData = response.data?.data || response.data;
      setProject(projectData);
      setProjectName(projectData?.name || '');
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setError('Failed to load project');
    }
  }, [id]);

  // Fetch videos data
  const fetchVideos = useCallback(async () => {
    try {
      const response = await videoAPI.getByProject(id);
      const videoData = response.data?.data || [];
      setVideos(Array.isArray(videoData) ? videoData : []);
      
      if (videoData.length > 0 && !selectedVideo) {
        setSelectedVideo(videoData[0]);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [id, selectedVideo]);

  // Check video status
  const checkVideoStatus = useCallback(async (videoId) => {
    try {
      const response = await videoAPI.getStatus(videoId);
      const statusData = response.data?.data || response.data;
      
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, ...statusData }
          : video
      ));
      
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(prev => ({ ...prev, ...statusData }));
      }
      
      if (statusData.status === 'completed' || statusData.status === 'failed') {
        setProcessing(prev => ({ ...prev, [videoId]: false }));
      }
    } catch (error) {
      console.error('Failed to check video status:', error);
    }
  }, [selectedVideo]);

  // Initial data loading
  useEffect(() => {
    if (id && id !== 'new') {
      fetchProject();
      fetchVideos();
    }
  }, [id, fetchProject, fetchVideos]);

  // Poll for video status updates
  useEffect(() => {
    const interval = setInterval(() => {
      videos.forEach(video => {
        if (video.status === 'processing' && !processing[video.id]) {
          checkVideoStatus(video.id);
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [videos, processing, checkVideoStatus]);

  const handleUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', file.name);
      formData.append('projectId', id);
      
      const response = await videoAPI.upload(formData, (progress) => {
        setUploadProgress(progress);
      });
      
      const newVideo = response.data?.data || response.data;
      setVideos(prev => [newVideo, ...prev]);
      setSelectedVideo(newVideo);
      setSuccess('Video uploaded successfully!');
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleProcessVideo = async (videoId) => {
    setProcessing(prev => ({ ...prev, [videoId]: true }));
    setError('');
    setSuccess('');

    try {
      await videoAPI.process(videoId);
      setSuccess('AI processing started!');
      
      // Update local state immediately
      setVideos(prev => prev.map(video => 
        video.id === videoId 
          ? { ...video, status: 'processing', processingProgress: 10 }
          : video
      ));
      
      if (selectedVideo?.id === videoId) {
        setSelectedVideo(prev => ({ 
          ...prev, 
          status: 'processing', 
          processingProgress: 10 
        }));
      }
    } catch (err) {
      setError(err.message || 'Processing failed');
      setProcessing(prev => ({ ...prev, [videoId]: false }));
    }
  };

  const handleDeleteVideo = async () => {
    if (!selectedVideoId) return;
    
    try {
      await videoAPI.delete(selectedVideoId);
      setVideos(prev => prev.filter(v => v.id !== selectedVideoId));
      
      if (selectedVideo?.id === selectedVideoId) {
        setSelectedVideo(videos.find(v => v.id !== selectedVideoId) || null);
      }
      
      setSuccess('Video deleted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to delete video');
    } finally {
      handleVideoMenuClose();
    }
  };

  const handleUpdateProject = async () => {
    try {
      await projectAPI.update(id, { name: projectName });
      setProject(prev => ({ ...prev, name: projectName }));
      setIsEditing(false);
      setSuccess('Project updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update project');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid video file (MP4, WebM, OGG, MOV)');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      
      handleUpload(file);
    }
  };

  const handleVideoMenuOpen = (event, videoId) => {
    event.stopPropagation();
    setVideoMenuAnchor(event.currentTarget);
    setSelectedVideoId(videoId);
  };

  const handleVideoMenuClose = () => {
    setVideoMenuAnchor(null);
    setSelectedVideoId(null);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return { icon: <CheckCircleIcon color="success" />, color: 'success', label: 'Completed' };
      case 'processing':
        return { icon: <ScheduleIcon color="warning" />, color: 'warning', label: 'Processing' };
      case 'failed':
        return { icon: <ErrorIcon color="error" />, color: 'error', label: 'Failed' };
      default:
        return { icon: <ScheduleIcon color="disabled" />, color: 'default', label: 'Pending' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            {isEditing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  size="small"
                  autoFocus
                />
                <Button size="small" onClick={handleUpdateProject}>Save</Button>
                <Button size="small" onClick={() => setIsEditing(false)}>Cancel</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" onClick={() => setIsEditing(true)} sx={{ cursor: 'pointer' }}>
                  {project?.name || 'Project'}
                </Typography>
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              {project?.description || 'No description'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <input
            ref={fileInputRef}
            accept="video/*"
            style={{ display: 'none' }}
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Upload Video'}
          </Button>
        </Box>
      </Box>

      {/* Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Video List */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Videos ({videos.length})
              </Typography>
              
              {videos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <VideocamIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No videos yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload your first video to get started
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Video
                  </Button>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {videos.map((video) => {
                    const statusConfig = getStatusConfig(video.status);
                    return (
                      <Card
                        key={video.id}
                        sx={{
                          mb: 2,
                          cursor: 'pointer',
                          border: selectedVideo?.id === video.id ? '2px solid #6366f1' : '1px solid #e5e7eb',
                          position: 'relative',
                          '&:hover': {
                            boxShadow: 2,
                          }
                        }}
                        onClick={() => setSelectedVideo(video)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" noWrap>
                                {video.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                {statusConfig.icon}
                                <Chip
                                  label={statusConfig.label}
                                  size="small"
                                  color={statusConfig.color}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                {new Date(video.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            
                            <IconButton
                              size="small"
                              onClick={(e) => handleVideoMenuOpen(e, video.id)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          
                          {video.status === 'processing' && (
                            <Box sx={{ mt: 2 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={video.processingProgress || 0} 
                              />
                              <Typography variant="caption" color="text.secondary">
                                {video.processingProgress || 0}% processed
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Video Details & AI Tools */}
        <Grid item xs={12} md={8}>
          {selectedVideo ? (
            <>
              {/* Video Preview */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      {selectedVideo.title}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoId(selectedVideo.id);
                        handleDeleteVideo();
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                  
                  <Box sx={{ 
                    height: 300, 
                    bgcolor: 'black', 
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <VideocamIcon sx={{ fontSize: 64, color: 'grey.600' }} />
                    <Typography variant="body2" color="grey.400" sx={{ mt: 2 }}>
                      Video Preview
                    </Typography>
                    
                    {selectedVideo.filepath && (
                      <Box sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                        <Typography variant="caption" color="grey.400">
                          Ready to play
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>File:</strong> {selectedVideo.filename}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" align="right">
                        <strong>Size:</strong> {(selectedVideo.filesize / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Status:</strong> {selectedVideo.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary" align="right">
                        <strong>Uploaded:</strong> {new Date(selectedVideo.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* AI Tools Panel */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Tools
                  </Typography>
                  
                  {selectedVideo.status === 'completed' ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      ✅ AI processing completed successfully!
                    </Alert>
                  ) : selectedVideo.status === 'processing' ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      ⏳ AI processing in progress... {selectedVideo.processingProgress || 0}%
                    </Alert>
                  ) : selectedVideo.status === 'failed' ? (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      ❌ AI processing failed: {selectedVideo.errorMessage || 'Unknown error'}
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      📋 Ready for AI processing
                    </Alert>
                  )}

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available AI Features:
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        { name: 'Transcription', desc: 'Convert speech to text' },
                        { name: 'Smart Cuts', desc: 'Auto-edit video segments' },
                        { name: 'Auto Captions', desc: 'Generate video captions' },
                        { name: 'Voiceover', desc: 'Add AI voice narration' },
                        { name: 'Auto Zoom', desc: 'Smart zoom on key moments' },
                        { name: 'Script Writing', desc: 'Generate video script' }
                      ].map((tool) => (
                        <Grid item xs={6} sm={4} key={tool.name}>
                          <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                              {tool.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {tool.desc}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => handleProcessVideo(selectedVideo.id)}
                    disabled={selectedVideo.status === 'processing' || processing[selectedVideo.id]}
                    sx={{ mt: 2 }}
                  >
                    {selectedVideo.status === 'processing' || processing[selectedVideo.id] 
                      ? 'Processing...' 
                      : 'Process with AI'}
                  </Button>

                  {selectedVideo.status === 'completed' && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        AI Results:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedVideo.transcript && (
                          <Chip label="Transcript" size="small" color="primary" />
                        )}
                        {selectedVideo.captions && (
                          <Chip label="Captions" size="small" color="primary" />
                        )}
                        {selectedVideo.cuts && (
                          <Chip label="Smart Cuts" size="small" color="primary" />
                        )}
                        {selectedVideo.voiceover && (
                          <Chip label="Voiceover" size="small" color="primary" />
                        )}
                        {selectedVideo.zoomPoints && (
                          <Chip label="Zoom Points" size="small" color="primary" />
                        )}
                        {selectedVideo.aiScript && (
                          <Chip label="AI Script" size="small" color="primary" />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <CardContent>
                <VideocamIcon sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  No video selected
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Select a video from the list or upload a new one
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Video
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Video Context Menu */}
      <Menu
        anchorEl={videoMenuAnchor}
        open={Boolean(videoMenuAnchor)}
        onClose={handleVideoMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedVideoId) {
            const video = videos.find(v => v.id === selectedVideoId);
            setSelectedVideo(video);
            handleVideoMenuClose();
          }
        }}>
          Select Video
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedVideoId) {
            handleProcessVideo(selectedVideoId);
            handleVideoMenuClose();
          }
        }}>
          Process with AI
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleDeleteVideo} 
          sx={{ color: 'error.main' }}
        >
          Delete Video
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProjectDetail;