import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  VideoSettings as VideoSettingsIcon,
  Password as PasswordIcon,
  Language as LanguageIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleSettingsOpen = (event) => {
    setSettingsAnchor(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchor(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update theme here
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Video processing complete', message: 'Your video "Product Demo" has been processed', time: '5 min ago', read: false },
    { id: 2, title: 'New feature available', message: 'Try our new AI voiceover feature', time: '1 hour ago', read: false },
    { id: 3, title: 'Storage warning', message: 'You have used 85% of your storage', time: '2 hours ago', read: true },
    { id: 4, title: 'Weekly report', message: 'Your weekly video analytics report is ready', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper', 
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left side - Search */}
        <Box sx={{ flex: 1, maxWidth: 500 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search projects, videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          </form>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton onClick={handleNotificationsOpen}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton onClick={handleSettingsOpen}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Help */}
          <Tooltip title="Help & Support">
            <IconButton onClick={() => navigate('/help')}>
              <HelpIcon />
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Avatar
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main',
                cursor: 'pointer'
              }}
              onClick={handleMenuOpen}
            >
              {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
            </Avatar>
            
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" fontWeight="medium">
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* User Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 220, mt: 1 }
          }}
        >
          <MenuItem onClick={handleProfile}>
            <PersonIcon fontSize="small" sx={{ mr: 2 }} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <SettingsIcon fontSize="small" sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: { width: 380, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Notifications</Typography>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
              Mark all as read
            </Typography>
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <MenuItem 
                key={notification.id}
                sx={{ 
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  borderLeft: notification.read ? 'none' : '3px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle2" fontWeight="medium">
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
              View all notifications
            </Typography>
          </Box>
        </Menu>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsAnchor}
          open={Boolean(settingsAnchor)}
          onClose={handleSettingsClose}
          PaperProps={{
            sx: { width: 300 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Settings</Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  size="small"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {darkMode ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
                  <Typography variant="body2">Dark Mode</Typography>
                </Box>
              }
              sx={{ width: '100%', mb: 1 }}
            />
            
            <Divider sx={{ my: 2 }} />
            
            <List dense sx={{ p: 0 }}>
              <ListItem button onClick={() => navigate('/settings/video')}>
                <ListItemIcon>
                  <VideoSettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Video Settings" secondary="Quality, format, etc." />
              </ListItem>
              
              <ListItem button onClick={() => navigate('/settings/account')}>
                <ListItemIcon>
                  <PasswordIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Account Security" secondary="Password, 2FA" />
              </ListItem>
              
              <ListItem button onClick={() => navigate('/settings/notifications')}>
                <ListItemIcon>
                  <NotificationsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Notifications" secondary="Email, push notifications" />
              </ListItem>
              
              <ListItem button onClick={() => navigate('/settings/language')}>
                <ListItemIcon>
                  <LanguageIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Language" secondary="English, Spanish, etc." />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Version 1.0.0
              </Typography>
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                View all settings
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;