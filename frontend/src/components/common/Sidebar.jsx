import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  Home as HomeIcon,
  Folder as FolderIcon,
  VideoCameraBack as VideoIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Search as SearchIcon,
  AutoFixHigh as AutoFixHighIcon,
  Update as UpdateIcon,
  Translate as TranslateIcon,
  Upload as UploadIcon,
  Videocam as VideocamIcon,
  PictureAsPdf as SlidesIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainMenuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'All Projects', icon: <FolderIcon />, path: '/projects' },
    { text: 'Video Templates', icon: <VideoIcon />, path: '/templates' },
  ];

  const toolsMenuItems = [
    { text: 'Auto-update', icon: <UpdateIcon />, path: '/auto-update', badge: 'New' },
    { text: 'Team', icon: <GroupIcon />, path: '/team' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  ];

  const aiToolsItems = [
    { text: 'Cuts', description: 'Trim videos automatically', icon: <AutoFixHighIcon /> },
    { text: 'Auto-update', description: 'Update content automatically', icon: <UpdateIcon /> },
    { text: 'Translator', description: 'Translate in 70+ languages', icon: <TranslateIcon /> },
  ];

  const bottomMenuItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Trash', icon: <DeleteIcon />, path: '/trash', badge: '7 days' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleCreateProject = async () => {
    try {
      // This would be implemented with your API
      // For now, navigate to projects page
      navigate('/projects');
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleNewVideo = () => {
    // Show creation options
    alert('Choose: Record screen, Upload video, or Upload slide deck');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold', 
          color: '#6366f1',
          letterSpacing: '-0.5px'
        }}>
          Clueso
        </Typography>
      </Box>
      
      {/* New Video Button */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box 
          onClick={handleNewVideo}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 1.5,
            backgroundColor: 'white',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#f8fafc',
              borderColor: '#6366f1',
              boxShadow: '0 2px 4px rgba(99, 102, 241, 0.1)'
            }
          }}
        >
          <AddIcon sx={{ color: '#6366f1' }} />
          <Typography variant="body2" fontWeight="medium">
            New video
          </Typography>
        </Box>
      </Box>
      
      {/* Search */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1,
          backgroundColor: 'white',
          borderRadius: 2,
          border: '1px solid #e5e7eb'
        }}>
          <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            Search...
          </Typography>
        </Box>
      </Box>

      <Divider />
      
      {/* Main Menu */}
      <List sx={{ px: 2, pt: 2 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#6366f1',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? 'white' : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? '600' : '400'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Creation Options */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          Create from
        </Typography>
      </Box>
      
      <List sx={{ px: 2, pb: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => {
              // Record screen functionality
              alert('Screen recording feature would open here');
            }}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#6366f1' }}>
              <VideocamIcon />
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <ListItemText 
                primary="Record screen"
                secondary="Turn screen recording into studio-style video"
                primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => {
              // Upload video functionality
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = 'video/*';
              fileInput.click();
            }}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#8b5cf6' }}>
              <UploadIcon />
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <ListItemText 
                primary="Upload a video"
                secondary="Upload screen recording, get studio-style video"
                primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton 
            onClick={() => {
              // Upload slide deck functionality
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.accept = '.ppt,.pptx,.pdf,.key';
              fileInput.click();
            }}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#10b981' }}>
              <SlidesIcon />
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <ListItemText 
                primary="Upload a slide deck"
                secondary="Turn presentations into engaging videos"
                primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* AI Tools Section */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          AI tools
        </Typography>
      </Box>
      
      <List sx={{ px: 2 }}>
        {aiToolsItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, color: '#6366f1' }}>
                {item.icon}
              </ListItemIcon>
              <Box sx={{ flex: 1 }}>
                <ListItemText 
                  primary={item.text}
                  secondary={item.description}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: '500' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Recent Projects */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight="medium">
          Recent projects
        </Typography>
      </Box>
      
      {/* Bottom Menu */}
      <List sx={{ mt: 'auto', px: 2 }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
              {item.badge && (
                <Chip 
                  label={item.badge} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    backgroundColor: item.text === 'Trash' ? '#fee2e2' : '#f0f9ff',
                    color: item.text === 'Trash' ? '#dc2626' : '#0369a1'
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* User Profile */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e5e7eb',
        backgroundColor: 'white'
      }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
          onClick={() => navigate('/settings')}
        >
          <Avatar sx={{ 
            width: 40, 
            height: 40, 
            bgcolor: '#6366f1',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              {user?.name || 'My Profile'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || 'myinfo@team.com'}
            </Typography>
          </Box>
        </Box>
        
        <ListItemButton 
          onClick={logout}
          sx={{ 
            borderRadius: 2,
            color: '#dc2626',
            '&:hover': {
              backgroundColor: '#fee2e2'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;