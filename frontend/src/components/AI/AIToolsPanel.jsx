import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Switch,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  TextFields as TextFieldsIcon,
  ZoomIn as ZoomInIcon,
  VolumeUp as VolumeUpIcon,
  ContentCut as ContentCutIcon,
} from '@mui/icons-material';
import { videoAPI } from '../../services/api';

const AIToolsPanel = ({ video, onProcessVideo }) => {
  const [processing, setProcessing] = useState(false);
  const [tools, setTools] = useState([
    { id: 'transcript', name: 'Transcription', enabled: true, icon: <TextFieldsIcon /> },
    { id: 'script', name: 'Perfect Script', enabled: true, icon: <AutoFixHighIcon /> },
    { id: 'captions', name: 'Auto Captions', enabled: true, icon: <TextFieldsIcon /> },
    { id: 'cuts', name: 'Smart Cuts', enabled: true, icon: <ContentCutIcon /> },
    { id: 'voiceover', name: 'AI Voiceover', enabled: false, icon: <VolumeUpIcon /> },
    { id: 'zoom', name: 'Auto Zoom', enabled: true, icon: <ZoomInIcon /> },
  ]);

  const handleProcessVideo = async () => {
    if (!video) return;
    
    setProcessing(true);
    try {
      await videoAPI.process(video.id);
      onProcessVideo(video.id);
      
      // Start polling for status updates
      const interval = setInterval(async () => {
        try {
          const statusResponse = await videoAPI.getStatus(video.id);
          if (statusResponse.data.status === 'completed' || statusResponse.data.status === 'failed') {
            clearInterval(interval);
            setProcessing(false);
            onProcessVideo(video.id); // Refresh video data
          }
        } catch (error) {
          console.error('Status check failed:', error);
          clearInterval(interval);
          setProcessing(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Failed to process video:', error);
      setProcessing(false);
    }
  };

  const toggleTool = (toolId) => {
    setTools(tools.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  if (!video) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Tools
          </Typography>
          <Alert severity="info">
            Select a video to use AI tools
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isProcessed = video.status === 'completed';

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Tools
        </Typography>
        
        {video.status === 'processing' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Processing in progress: {video.processingProgress}%
          </Alert>
        )}

        {isProcessed && (
          <Alert severity="success" sx={{ mb: 2 }}>
            AI processing completed!
          </Alert>
        )}

        <List>
          {tools.map((tool) => (
            <ListItem
              key={tool.id}
              secondaryAction={
                <Switch
                  edge="end"
                  checked={tool.enabled}
                  onChange={() => toggleTool(tool.id)}
                  disabled={processing || isProcessed}
                />
              }
            >
              <Box sx={{ mr: 2, color: '#6366f1' }}>
                {tool.icon}
              </Box>
              <ListItemText 
                primary={tool.name}
                secondary={isProcessed && video[tool.id] ? "Completed" : "Ready"}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Button
          variant="contained"
          fullWidth
          onClick={handleProcessVideo}
          disabled={!video || processing || isProcessed}
        >
          {processing ? 'Processing...' : 'Process with AI'}
        </Button>

        {isProcessed && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              AI Results:
            </Typography>
            {video.transcript && (
              <Chip 
                label="Transcript" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {video.aiScript && (
              <Chip 
                label="Script" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {video.captions && (
              <Chip 
                label="Captions" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            )}
            {video.cuts && (
              <Chip 
                label="Cuts" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AIToolsPanel;