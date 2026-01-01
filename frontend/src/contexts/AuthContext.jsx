import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        const response = await authAPI.getCurrentUser();
        if (response.data?.success) {
          setUser(response.data.data?.user || JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      console.log('Login response:', response);
      
      if (!response || !response.data) {
        throw new Error('No response received from server');
      }
      
      const responseData = response.data;
      
      // Check if response indicates success
      if (!responseData.success) {
        throw new Error(responseData.error || 'Login failed');
      }
      
      // Extract data based on actual response structure
      let token, userData;
      
      if (responseData.data) {
        // Structure: { success: true, data: { token, user } }
        token = responseData.data.token;
        userData = responseData.data.user;
      } else {
        // Direct structure: { success: true, token, user }
        token = responseData.token;
        userData = responseData.user;
      }
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log('Register response:', response);
      
      if (!response || !response.data) {
        throw new Error('No response received from server');
      }
      
      const responseData = response.data;
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Registration failed');
      }
      
      let token, userResponse;
      
      if (responseData.data) {
        token = responseData.data.token;
        userResponse = responseData.data.user;
      } else {
        token = responseData.token;
        userResponse = responseData.user;
      }
      
      if (!token) {
        throw new Error('No authentication token received');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userResponse));
      setUser(userResponse);
      
      return { success: true, user: userResponse };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};