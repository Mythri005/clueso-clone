import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  VideoCameraBack as VideoIcon,
  Folder as FolderIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/projects/${project.id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log('Delete project:', project.id);
    handleMenuClose();
  };

  const handleShare = () => {
    console.log('Share project:', project.id);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const videoCount = project.videos?.length || 0;
  const lastVideo = project.videos?.[0];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        }
      }}
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Project Thumbnail */}
      {lastVideo?.thumbnail ? (
        <CardMedia
          component="img"
          height="140"
          image={lastVideo.thumbnail}
          alt={project.name}
          sx={{ bgcolor: 'grey.100' }}
        />
      ) : (
        <Box
          sx={{
            height: 140,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FolderIcon sx={{ fontSize: 48, color: 'white' }} />
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Action Menu */}
        <IconButton
          size="small"
          onClick={handleMenuOpen}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" sx={{ mr: 2 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleShare}>
            <ShareIcon fontSize="small" sx={{ mr: 2 }} />
            Share
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Project Info */}
        <Typography variant="h6" noWrap gutterBottom>
          {project.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap paragraph>
          {project.description || 'No description'}
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VideoIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {videoCount} {videoCount === 1 ? 'video' : 'videos'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimeIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(project.updatedAt)}
            </Typography>
          </Box>
        </Box>

        {/* Status Chip */}
        <Chip
          label={project.status}
          size="small"
          color={getStatusColor(project.status)}
          sx={{ textTransform: 'capitalize' }}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;