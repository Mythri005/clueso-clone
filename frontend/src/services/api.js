import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authAPI = {
  login: async (email, password) => {
    return api.post('/api/auth/login', { email, password });
  },
  
  register: async (userData) => {
    return api.post('/api/auth/register', userData);
  },
  
  getCurrentUser: async () => {
    return api.get('/api/auth/me');
  }
};

const projectAPI = {
  getAll: async () => {
    return api.get('/api/projects');
  },
  
  getById: async (id) => {
    return api.get(`/api/projects/${id}`);
  },
  
  create: async (projectData) => {
    return api.post('/api/projects', projectData);
  },
  
  update: async (id, projectData) => {
    return api.put(`/api/projects/${id}`, projectData);
  },
  
  delete: async (id) => {
    return api.delete(`/api/projects/${id}`);
  }
};

const videoAPI = {
  upload: async (formData) => {
    return api.post('/api/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  getByProject: async (projectId) => {
    return api.get(`/api/videos/project/${projectId}`);
  },
  
  getById: async (id) => {
    return api.get(`/api/videos/${id}`);
  },
  
  process: async (id) => {
    return api.post(`/api/videos/${id}/process`);
  },
  
  getStatus: async (id) => {
    return api.get(`/api/videos/${id}/status`);
  },
  
  delete: async (id) => {
    return api.delete(`/api/videos/${id}`);
  }
};

export { authAPI, projectAPI, videoAPI };