import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Alert,
  AlertTitle,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  HourglassEmpty as HourglassIcon
} from '@mui/icons-material';

const ProcessingStatus = ({ video, refresh }) => {
  if (!video) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: <HourglassIcon color="disabled" />,
          color: 'default',
          title: 'Ready for Processing',
          message: 'Video is uploaded and ready for AI processing.'
        };
      case 'processing':
        return {
          icon: <CircularProgress size={24} />,
          color: 'warning',
          title: 'Processing with AI',
          message: 'Your video is being enhanced with AI tools.'
        };
      case 'completed':
        return {
          icon: <CheckCircleIcon color="success" />,
          color: 'success',
          title: 'Processing Complete',
          message: 'AI processing finished successfully.'
        };
      case 'failed':
        return {
          icon: <ErrorIcon color="error" />,
          color: 'error',
          title: 'Processing Failed',
          message: video.errorMessage || 'Something went wrong during processing.'
        };
      default:
        return {
          icon: null,
          color: 'info',
          title: 'Unknown Status',
          message: 'Status information unavailable.'
        };
    }
  };

  const config = getStatusConfig(video.status);

  return (
    <Fade in={true}>
      <Box sx={{ mb: 3 }}>
        <Alert 
          severity={config.color}
          icon={config.icon}
          sx={{ mb: 2 }}
        >
          <AlertTitle>{config.title}</AlertTitle>
          {config.message}
        </Alert>

        {video.status === 'processing' && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.processingProgress || 0}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={video.processingProgress || 0}
              sx={{ height: 8, borderRadius: 4 }}
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Processing: {video.processingProgress < 50 ? 'Analyzing content' : 
                          video.processingProgress < 80 ? 'Generating AI enhancements' : 
                          'Finalizing results'}
            </Typography>
          </Box>
        )}

        {video.status === 'completed' && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.contrastText">
              ✅ AI enhancements applied:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {video.transcript && <Typography variant="caption" sx={{ bgcolor: 'white', px: 1, borderRadius: 1 }}>Transcript</Typography>}
              {video.aiScript && <Typography variant="caption" sx={{ bgcolor: 'white', px: 1, borderRadius: 1 }}>Script</Typography>}
              {video.captions && <Typography variant="caption" sx={{ bgcolor: 'white', px: 1, borderRadius: 1 }}>Captions</Typography>}
              {video.cuts && <Typography variant="caption" sx={{ bgcolor: 'white', px: 1, borderRadius: 1 }}>Smart Cuts</Typography>}
            </Box>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default ProcessingStatus;