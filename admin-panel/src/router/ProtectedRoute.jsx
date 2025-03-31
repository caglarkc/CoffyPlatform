import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = () => {
  const { admin, loading } = useContext(AuthContext);
  const location = useLocation();
  const effectRan = useRef(false);
  
  useEffect(() => {
    // React 18 Strict Mode'da iki kez çalışmasını önle
    if (effectRan.current === true && process.env.NODE_ENV !== 'production') {
      return;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('ProtectedRoute - Current state:', { 
        admin, 
        loading, 
        path: location.pathname 
      });
    }
    
    // Mark effect as run
    effectRan.current = true;
    
    return () => {
      effectRan.current = false;
    };
  }, [admin, loading, location]);
  
  if (loading) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ProtectedRoute - Still loading auth state...');
    }
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!admin) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ProtectedRoute - No admin, redirecting to login');
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log('ProtectedRoute - Admin authenticated, rendering route');
  }
  return <Outlet />;
};

export default ProtectedRoute; 