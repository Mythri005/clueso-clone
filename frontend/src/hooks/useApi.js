import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = useCallback(async (method, endpoint, data = null, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      };

      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers,
        ...options
      };

      if (data && method !== 'GET') {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((endpoint, options = {}) => 
    apiRequest('GET', endpoint, null, options), [apiRequest]);

  const post = useCallback((endpoint, data, options = {}) => 
    apiRequest('POST', endpoint, data, options), [apiRequest]);

  const put = useCallback((endpoint, data, options = {}) => 
    apiRequest('PUT', endpoint, data, options), [apiRequest]);

  const patch = useCallback((endpoint, data, options = {}) => 
    apiRequest('PATCH', endpoint, data, options), [apiRequest]);

  const del = useCallback((endpoint, options = {}) => 
    apiRequest('DELETE', endpoint, null, options), [apiRequest]);

  const uploadFile = useCallback(async (endpoint, file, additionalData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Add file
      if (file) {
        formData.append('file', file);
      }
      
      // Add additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    get,
    post,
    put,
    patch,
    delete: del,
    uploadFile,
    apiRequest
  };
};

export default useApi;