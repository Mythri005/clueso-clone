import React, { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Alert,
  Tabs,
  Tab,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Password as PasswordIcon,
  Notifications as NotificationsIcon,
  VideoSettings as VideoSettingsIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Smartphone as SmartphoneIcon,
  Cloud as CloudIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Tech Corp',
    jobTitle: 'Product Manager',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    processingUpdates: true,
    weeklyReports: false,
    
    // Video Settings
    videoQuality: 'high',
    autoProcess: true,
    defaultFormat: 'mp4',
    watermarkEnabled: false,
    
    // Language & Region
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Storage
    storageLimit: 100, // GB
    autoCleanup: false,
    backupEnabled: true
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (section) => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`${section} settings saved successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    // Implement data export
    alert('Export feature coming soon!');
  };

  const tabs = [
    { label: 'Profile', icon: <PersonIcon /> },
    { label: 'Security', icon: <SecurityIcon /> },
    { label: 'Notifications', icon: <NotificationsIcon /> },
    { label: 'Video Settings', icon: <VideoSettingsIcon /> },
    { label: 'Language', icon: <LanguageIcon /> },
    { label: 'Storage', icon: <StorageIcon /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your account settings and preferences
      </Typography>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable">
          {tabs.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab.label} 
              icon={tab.icon} 
              iconPosition="start"
              sx={{ minHeight: 64 }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Profile Settings */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon /> Profile Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={settings.name}
                  onChange={(e) => handleSettingChange('name', e.target.value)}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleSettingChange('email', e.target.value)}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={settings.company}
                  onChange={(e) => handleSettingChange('company', e.target.value)}
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  value={settings.jobTitle}
                  onChange={(e) => handleSettingChange('jobTitle', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Profile')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon /> Security Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorEnabled}
                      onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">Two-Factor Authentication</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Change Password
                </Typography>
                
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={settings.currentPassword}
                  onChange={(e) => handleSettingChange('currentPassword', e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Security')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Update Security'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Notifications Settings */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon /> Notification Preferences
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Email Notifications"
                  secondary="Receive updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SmartphoneIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Receive browser notifications"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <VideoSettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Processing Updates"
                  secondary="Get notified when video processing completes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.processingUpdates}
                    onChange={(e) => handleSettingChange('processingUpdates', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CloudIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Weekly Reports"
                  secondary="Receive weekly analytics reports"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={settings.weeklyReports}
                    onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Notifications')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Video Settings */}
      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VideoSettingsIcon /> Video Processing Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Video Quality</InputLabel>
                  <Select
                    value={settings.videoQuality}
                    label="Video Quality"
                    onChange={(e) => handleSettingChange('videoQuality', e.target.value)}
                  >
                    <MenuItem value="low">Low (480p)</MenuItem>
                    <MenuItem value="medium">Medium (720p)</MenuItem>
                    <MenuItem value="high">High (1080p)</MenuItem>
                    <MenuItem value="ultra">Ultra (4K)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Default Format</InputLabel>
                  <Select
                    value={settings.defaultFormat}
                    label="Default Format"
                    onChange={(e) => handleSettingChange('defaultFormat', e.target.value)}
                  >
                    <MenuItem value="mp4">MP4</MenuItem>
                    <MenuItem value="webm">WebM</MenuItem>
                    <MenuItem value="mov">MOV</MenuItem>
                    <MenuItem value="avi">AVI</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoProcess}
                      onChange={(e) => handleSettingChange('autoProcess', e.target.checked)}
                    />
                  }
                  label="Automatically process videos with AI after upload"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.watermarkEnabled}
                      onChange={(e) => handleSettingChange('watermarkEnabled', e.target.checked)}
                    />
                  }
                  label="Add watermark to processed videos"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Video')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Video Settings'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Language Settings */}
      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon /> Language & Region
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={settings.language}
                    label="Language"
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                    <MenuItem value="ja">Japanese</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={settings.timezone}
                    label="Timezone"
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">Eastern Time (EST)</MenuItem>
                    <MenuItem value="PST">Pacific Time (PST)</MenuItem>
                    <MenuItem value="CET">Central European Time (CET)</MenuItem>
                    <MenuItem value="IST">Indian Standard Time (IST)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.dateFormat}
                    label="Date Format"
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Language')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Language Settings'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Storage Settings */}
      {activeTab === 5 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StorageIcon /> Storage Management
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Storage Limit: {settings.storageLimit} GB
                </Typography>
                <Slider
                  value={settings.storageLimit}
                  onChange={(e, value) => handleSettingChange('storageLimit', value)}
                  min={10}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value} GB`}
                />
                <Typography variant="caption" color="text.secondary">
                  Adjust your storage limit. Additional charges may apply for higher limits.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoCleanup}
                      onChange={(e) => handleSettingChange('autoCleanup', e.target.checked)}
                    />
                  }
                  label="Auto-cleanup old videos"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Automatically delete videos older than 30 days
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backupEnabled}
                      onChange={(e) => handleSettingChange('backupEnabled', e.target.checked)}
                    />
                  }
                  label="Enable cloud backup"
                />
                <Typography variant="caption" color="text.secondary" display="block">
                  Backup your videos to cloud storage
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Data Management
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportData}
                  sx={{ mr: 2 }}
                >
                  Export All Data
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => alert('This will delete all your data. Are you sure?')}
                >
                  Delete All Data
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => handleSave('Storage')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Storage Settings'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Account Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  12
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Projects
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  47
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Videos Processed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {settings.storageLimit} GB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Storage Limit
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  85%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Storage Used
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Settings;