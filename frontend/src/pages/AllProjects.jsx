import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider,
  InputAdornment,
  Pagination,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Videocam as VideocamIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { projectAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [projectsPerPage] = useState(9);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on search term
    const filtered = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Sort projects
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'videos':
          return (b.videos?.length || 0) - (a.videos?.length || 0);
        default:
          return 0;
      }
    });
    
    setFilteredProjects(sorted);
  }, [projects, searchTerm, sortBy]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      const projectData = response.data?.data || [];
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await projectAPI.create({
        name: 'New Project',
        description: 'Project created from All Projects'
      });
      navigate(`/projects/${response.data.data.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to create project');
    }
  };

  const handleMenuOpen = (event, projectId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handleDeleteProject = async () => {
    if (!selectedProjectId) return;
    
    try {
      await projectAPI.delete(selectedProjectId);
      setProjects(prev => prev.filter(p => p.id !== selectedProjectId));
    } catch (error) {
      setError('Failed to delete project');
    } finally {
      handleMenuClose();
    }
  };

  const handleArchiveProject = async () => {
    if (!selectedProjectId) return;
    
    try {
      await projectAPI.update(selectedProjectId, { status: 'archived' });
      setProjects(prev => prev.map(p => 
        p.id === selectedProjectId ? { ...p, status: 'archived' } : p
      ));
    } catch (error) {
      setError('Failed to archive project');
    } finally {
      handleMenuClose();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'archived': return 'default';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'archived': return 'Archived';
      case 'draft': return 'Draft';
      default: return 'Active';
    }
  };

  // Pagination
  const indexOfLastProject = page * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              All Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {projects.length} total projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProject}
          >
            New Project
          </Button>
        </Box>

        {/* Search and Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
          >
            Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Projects Grid */}
      {currentProjects.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <FolderIcon sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
            <Typography variant="h6" gutterBottom>
              No projects found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateProject}
            >
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentProjects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
                    {/* Action Menu */}
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, project.id)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <MoreVertIcon />
                    </IconButton>

                    {/* Project Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                        {project.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {project.description || 'No description'}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VideocamIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {project.videos?.length || 0} videos
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TimeIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Status */}
                    <Chip
                      label={getStatusLabel(project.status)}
                      size="small"
                      color={getStatusColor(project.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Project Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          navigate(`/projects/${selectedProjectId}`);
          handleMenuClose();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          // Implement share functionality
          handleMenuClose();
        }}>
          <ShareIcon fontSize="small" sx={{ mr: 2 }} />
          Share
        </MenuItem>
        <MenuItem onClick={handleArchiveProject}>
          <ArchiveIcon fontSize="small" sx={{ mr: 2 }} />
          Archive
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AllProjects;