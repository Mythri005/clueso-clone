import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Alert,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { videoAPI } from '../../services/api';

const VideoUploader = ({ projectId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.includes('video/')) {
      setError('Please select a video file');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setError('File size must be less than 500MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', file.name);
    formData.append('projectId', projectId);

    try {
      const response = await videoAPI.upload(formData);
      onUploadComplete(response.data);
      setProgress(100);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload a video
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload a screen recording, get a studio-style video.
        </Typography>

        <Box
          sx={{
            border: dragActive ? '2px dashed #6366f1' : '2px dashed #e5e7eb',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            backgroundColor: dragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
            mt: 2,
            mb: 3,
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Drag and drop your video here
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <input
            accept="video/*"
            style={{ display: 'none' }}
            id="video-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="video-upload">
            <Button
              variant="contained"
              component="span"
              disabled={uploading}
              startIcon={<UploadIcon />}
            >
              Browse Files
            </Button>
          </label>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Supports MP4, MOV, AVI, MKV, WebM (Max 500MB)
          </Typography>
        </Box>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Uploading... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploader;