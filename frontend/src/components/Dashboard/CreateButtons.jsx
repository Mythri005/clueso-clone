import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  Upload as UploadIcon,
  PictureAsPdf as SlidesIcon,
} from '@mui/icons-material';

const CreateButtons = ({ onCreateProject }) => {
  const navigate = useNavigate();

  const creationOptions = [
    {
      title: 'Record screen',
      description: 'Turn screen recording into a studio-style video.',
      icon: <VideocamIcon fontSize="large" />,
      color: '#6366f1',
      onClick: () => {
        const projectId = 'new'; // You'd create a project first in real app
        navigate(`/projects/${projectId}?record=true`);
      }
    },
    {
      title: 'Upload a video',
      description: 'Upload a screen recording, get a studio-style video.',
      icon: <UploadIcon fontSize="large" />,
      color: '#8b5cf6',
      onClick: () => {
        const projectId = 'new';
        navigate(`/projects/${projectId}?upload=true`);
      }
    },
    {
      title: 'Upload a slide deck',
      description: 'Turn presentations into engaging videos.',
      icon: <SlidesIcon fontSize="large" />,
      color: '#10b981',
      onClick: () => {
        const projectId = 'new';
        navigate(`/projects/${projectId}?slides=true`);
      }
    },
  ];

  return (
    <Grid container spacing={3}>
      {creationOptions.map((option) => (
        <Grid item xs={12} md={4} key={option.title}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
            onClick={option.onClick}
          >
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: option.color, mb: 2 }}>
                {option.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {option.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CreateButtons;