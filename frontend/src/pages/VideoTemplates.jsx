import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const VideoTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Sample video templates
  const templates = [
    {
      id: 1,
      title: 'Product Demo',
      description: 'Perfect for showcasing software features',
      duration: '30-60 sec',
      category: 'Software',
      difficulty: 'Beginner',
      rating: 4.8,
      uses: '1.2k',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=225&fit=crop',
      features: ['Intro Scene', 'Feature Showcase', 'Call to Action']
    },
    {
      id: 2,
      title: 'How-to Tutorial',
      description: 'Step-by-step instructional video template',
      duration: '2-5 min',
      category: 'Education',
      difficulty: 'Intermediate',
      rating: 4.6,
      uses: '890',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w-400&h=225&fit=crop',
      features: ['Step-by-Step', 'Annotations', 'Summary']
    },
    {
      id: 3,
      title: 'Company Introduction',
      description: 'Professional company overview video',
      duration: '60-90 sec',
      category: 'Business',
      difficulty: 'Beginner',
      rating: 4.9,
      uses: '2.3k',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w-400&h=225&fit=crop',
      features: ['Logo Reveal', 'Team Intro', 'Mission Statement']
    },
    {
      id: 4,
      title: 'Social Media Ad',
      description: 'Eye-catching ads for social platforms',
      duration: '15-30 sec',
      category: 'Marketing',
      difficulty: 'Advanced',
      rating: 4.7,
      uses: '3.1k',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w-400&h=225&fit=crop',
      features: ['Quick Cuts', 'Text Overlays', 'Music Sync']
    },
    {
      id: 5,
      title: 'Event Promotion',
      description: 'Promote your events effectively',
      duration: '45-75 sec',
      category: 'Events',
      difficulty: 'Intermediate',
      rating: 4.5,
      uses: '560',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w-400&h=225&fit=crop',
      features: ['Date Display', 'Venue Showcase', 'RSVP Call']
    },
    {
      id: 6,
      title: 'Customer Testimonial',
      description: 'Showcase customer success stories',
      duration: '60-90 sec',
      category: 'Marketing',
      difficulty: 'Beginner',
      rating: 4.8,
      uses: '1.5k',
      thumbnail: 'https://images.unsplash.com/photo-1551836026-d5c2c2afb0a7?w-400&h=225&fit=crop',
      features: ['Interview Style', 'B-roll Footage', 'Quote Overlays']
    }
  ];

  const categories = ['All', 'Software', 'Education', 'Business', 'Marketing', 'Events'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(`Project created from "${selectedTemplate.title}" template!`);
      setOpenDialog(false);
      setSelectedTemplate(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }, 1500);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Video Templates
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Choose from professionally designed templates to get started quickly
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      </Box>

      {/* Templates Grid */}
      <Grid container spacing={3}>
        {filteredTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Thumbnail */}
              <CardMedia
                component="div"
                sx={{
                  height: 140,
                  position: 'relative',
                  bgcolor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${template.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}>
                    <PlayIcon />
                  </IconButton>
                </Box>
                <Chip
                  label={template.category}
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, bgcolor: 'white' }}
                />
              </CardMedia>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {template.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                {/* Template Info */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<InfoIcon fontSize="small" />}
                    label={template.duration}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${template.difficulty}`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<StarIcon fontSize="small" />}
                    label={template.rating}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Includes:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {template.features.map((feature, index) => (
                      <Chip
                        key={index}
                        label={feature}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Used {template.uses} times
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create from Template Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Use Template: {selectedTemplate?.title}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <LinearProgress sx={{ mb: 2 }} />
              <Typography>Creating project from template...</Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTemplate?.description}
              </Typography>
              
              <TextField
                fullWidth
                label="Project Name"
                defaultValue={`${selectedTemplate?.title} Project`}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={2}
                margin="normal"
              />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Template includes:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedTemplate?.features.map((feature, index) => (
                    <Chip key={index} label={feature} size="small" />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateFromTemplate}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoTemplates;