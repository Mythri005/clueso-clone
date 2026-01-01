import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Slider,
  Typography,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  Settings as SettingsIcon,
  ClosedCaption as CaptionsIcon,
  ZoomIn as ZoomIcon
} from '@mui/icons-material';

const VideoPlayer = ({ video }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoomPoints, setZoomPoints] = useState([]);
  const [cuts, setCuts] = useState([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = muted;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [volume, muted, playbackRate]);

  useEffect(() => {
    // Parse JSON strings from database
    if (video?.zoomPoints) {
      try {
        const points = typeof video.zoomPoints === 'string' 
          ? JSON.parse(video.zoomPoints)
          : video.zoomPoints;
        setZoomPoints(points || []);
      } catch {
        setZoomPoints([]);
      }
    }

    if (video?.cuts) {
      try {
        const cutData = typeof video.cuts === 'string'
          ? JSON.parse(video.cuts)
          : video.cuts;
        setCuts(cutData || []);
      } catch {
        setCuts([]);
      }
    }
  }, [video]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Check for zoom points
      const currentZoom = zoomPoints.find(point => 
        Math.abs(point.timestamp - videoRef.current.currentTime) < 0.5
      );
      
      if (currentZoom && containerRef.current) {
        containerRef.current.style.transform = `scale(${currentZoom.scale})`;
        containerRef.current.style.transition = `transform ${currentZoom.duration}s ease`;
      }

      // Check for cuts
      const currentCut = cuts.find(cut => 
        videoRef.current.currentTime >= cut.start && videoRef.current.currentTime <= cut.end
      );
      
      if (currentCut) {
        console.log(`Currently in cut: ${currentCut.reason}`);
      }
    }
  };

  const handleSeek = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (videoRef.current) {
      videoRef.current.volume = newValue;
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const videoUrl = video?.filepath 
    ? `http://localhost:5000${video.filepath}`
    : '';

  if (!videoUrl) {
    return (
      <Box sx={{ 
        height: 400, 
        bgcolor: 'grey.100', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 2
      }}>
        <Typography color="text.secondary">No video selected</Typography>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box 
          ref={containerRef}
          sx={{ 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 1,
            bgcolor: 'black'
          }}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {/* Video Element */}
          <video
            ref={videoRef}
            src={videoUrl}
            style={{ 
              width: '100%', 
              height: '400px',
              display: 'block'
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {/* Video Info Overlay */}
          {video?.title && (
            <Box sx={{ 
              position: 'absolute', 
              top: 16, 
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'white', 
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    fontWeight: 'bold'
                  }}
                >
                  {video.title}
                </Typography>
                {video.duration && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'white', 
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)' 
                    }}
                  >
                    Duration: {formatTime(video.duration)}
                  </Typography>
                )}
              </Box>
              
              {/* AI Features Badges */}
              <Stack direction="row" spacing={1}>
                {video.transcript && (
                  <Chip 
                    label="Transcript" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  />
                )}
                {video.captions && (
                  <Chip 
                    label="Captions" 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  />
                )}
                {cuts.length > 0 && (
                  <Chip 
                    label={`${cuts.length} Cuts`}
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                  />
                )}
              </Stack>
            </Box>
          )}

          {/* Controls Overlay */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            p: 2,
            transition: 'opacity 0.3s',
            opacity: showControls ? 1 : 0
          }}>
            {/* Progress Bar */}
            <Slider
              value={currentTime}
              min={0}
              max={duration || 100}
              onChange={handleSeek}
              sx={{ 
                color: 'white',
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12,
                }
              }}
            />

            {/* Control Buttons */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mt: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Play/Pause */}
                <IconButton onClick={handlePlayPause} sx={{ color: 'white' }}>
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </IconButton>

                {/* Time Display */}
                <Typography variant="body2" sx={{ color: 'white', minWidth: 100 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>

                {/* Volume Control */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton onClick={() => setMuted(!muted)} sx={{ color: 'white' }}>
                    {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                  </IconButton>
                  <Slider
                    value={volume}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={handleVolumeChange}
                    sx={{ 
                      width: 80,
                      color: 'white',
                      '& .MuiSlider-thumb': {
                        width: 10,
                        height: 10,
                      }
                    }}
                  />
                </Box>

                {/* Playback Speed */}
                <Tooltip title="Playback Speed">
                  <IconButton sx={{ color: 'white' }}>
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <select 
                  value={playbackRate}
                  onChange={(e) => handlePlaybackRate(parseFloat(e.target.value))}
                  style={{
                    background: 'transparent',
                    color: 'white',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="0.5">0.5x</option>
                  <option value="0.75">0.75x</option>
                  <option value="1">1x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Captions */}
                {video.captions && (
                  <Tooltip title="Captions">
                    <IconButton sx={{ color: 'white' }}>
                      <CaptionsIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Zoom Points */}
                {zoomPoints.length > 0 && (
                  <Tooltip title={`${zoomPoints.length} Zoom Points`}>
                    <IconButton sx={{ color: 'white' }}>
                      <ZoomIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {/* Fullscreen */}
                <IconButton onClick={handleFullscreen} sx={{ color: 'white' }}>
                  <FullscreenIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Play/Pause Center Button */}
          {!playing && (
            <IconButton
              onClick={handlePlayPause}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)',
                }
              }}
              size="large"
            >
              <PlayIcon fontSize="large" />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;