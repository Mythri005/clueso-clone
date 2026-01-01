import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import AllProjects from './pages/AllProjects';
import VideoTemplates from './pages/VideoTemplates';
import Settings from './pages/Settings';
import Layout from './components/common/Layout';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#8b5cf6',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Loading...
    </div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/projects" element={
              <PrivateRoute>
                <Layout>
                  <AllProjects />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/projects/:id" element={
              <PrivateRoute>
                <Layout>
                  <ProjectDetail />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/templates" element={
              <PrivateRoute>
                <Layout>
                  <VideoTemplates />
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/settings" element={
              <PrivateRoute>
                <Layout>
                  <Settings />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Additional Routes */}
            <Route path="/team" element={
              <PrivateRoute>
                <Layout>
                  <div style={{ padding: '20px' }}>
                    <h2>Team Management</h2>
                    <p>Team feature coming soon!</p>
                  </div>
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/analytics" element={
              <PrivateRoute>
                <Layout>
                  <div style={{ padding: '20px' }}>
                    <h2>Analytics</h2>
                    <p>Analytics dashboard coming soon!</p>
                  </div>
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/trash" element={
              <PrivateRoute>
                <Layout>
                  <div style={{ padding: '20px' }}>
                    <h2>Trash</h2>
                    <p>Deleted items will appear here.</p>
                  </div>
                </Layout>
              </PrivateRoute>
            } />
            
            <Route path="/profile" element={
              <PrivateRoute>
                <Layout>
                  <Navigate to="/settings" />
                </Layout>
              </PrivateRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;