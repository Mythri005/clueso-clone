import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  Stop as StopIcon,
  FiberManualRecord as RecordIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material';
import { videoAPI } from '../../services/api';

const ScreenRecorder = ({ projectId, onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      setError('');
      
      // Request screen and audio permissions
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          cursor: "always",
          frameRate: { ideal: 30, max: 60 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Request microphone for voiceover
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      // Combine streams
      const combinedStream = new MediaStream([
        ...displayStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      setMediaStream(combinedStream);

      // Create media recorder
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        await uploadRecording(blob);
        
        // Clean up streams
        combinedStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      };

      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error: ' + event.error.message);
        stopRecording();
      };

      setMediaRecorder(recorder);
      recorder.start(1000); // Collect data every second
      setRecording(true);
      setRecordedChunks(chunks);

      // Start timer
      let time = 0;
      timerRef.current = setInterval(() => {
        if (!paused) {
          time++;
          setRecordingTime(time);
        }
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(err.message || 'Failed to start recording. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setRecording(false);
    setPaused(false);
    setRecordingTime(0);
  };

  const togglePause = () => {
    if (!mediaRecorder) return;

    if (paused) {
      mediaRecorder.resume();
    } else {
      mediaRecorder.pause();
    }
    setPaused(!paused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadRecording = async (blob) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video', blob, `recording-${Date.now()}.webm`);
      formData.append('title', `Screen Recording ${new Date().toLocaleString()}`);
      formData.append('projectId', projectId);

      const response = await videoAPI.upload(formData);
      onRecordingComplete(response.data);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload recording: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Record Screen
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Turn screen recording into a studio-style video.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ 
          border: '2px dashed', 
          borderColor: recording ? 'error.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          bgcolor: recording ? 'error.light' : 'grey.50',
          mb: 3
        }}>
          <VideocamIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
          
          {recording ? (
            <Box>
              <Chip 
                icon={<RecordIcon />} 
                label="RECORDING" 
                color="error" 
                sx={{ mb: 2 }}
              />
              <Typography variant="h4" color="error.main" gutterBottom>
                {formatTime(recordingTime)}
              </Typography>
              <Typography variant="body2" color="error.dark">
                Recording your screen and audio...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                Ready to record
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Click start to begin screen recording with audio
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!recording ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<RecordIcon />}
              onClick={startRecording}
              disabled={uploading}
              size="large"
            >
              Start Recording
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={paused ? <PlayIcon /> : <PauseIcon />}
                onClick={togglePause}
                disabled={uploading}
              >
                {paused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<StopIcon />}
                onClick={stopRecording}
                disabled={uploading}
              >
                Stop & Save
              </Button>
            </>
          )}
        </Box>

        {recording && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Recording Tips:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              • Make sure to allow screen sharing when prompted<br/>
              • Speak clearly for best audio quality<br/>
              • Close unnecessary applications for better performance
            </Typography>
          </Box>
        )}

        {uploading && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" gutterBottom>
              Uploading recording...
            </Typography>
            <LinearProgress />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ScreenRecorder;