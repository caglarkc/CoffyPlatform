import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const effectRan = useRef(false);

  // Use the proxied URL instead of direct localhost
  const API_URL = '/api/admin';

  useEffect(() => {
    // React 18 Strict Mode'da iki kez çalışmasını önle
    if (effectRan.current === true && process.env.NODE_ENV !== 'production') {
      return;
    }
    
    // Check if admin is already logged in on page load
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...');
        // Use check-cookie endpoint instead of verify-token
        const response = await axios.get(`${API_URL}/check-cookie`, { withCredentials: true });
        console.log('Check-cookie response:', response.data);
        
        // Check if cookie exists based on backend response format
        if (response.data.hasCookie && response.data.cookieExists) {
          console.log('Cookie exists, fetching admin data...');
          // If cookie exists, fetch admin data or set it if available
          try {
            // Additional call to get admin data if needed
            const adminResponse = await axios.get(`${API_URL}/me`, { withCredentials: true });
            console.log('Admin data response:', adminResponse.data);
            setAdmin(adminResponse.data.admin);
          } catch (err) {
            console.error('Failed to fetch admin data:', err);
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
    
    // Mark effect as run
    effectRan.current = true;
    
    // Cleanup on unmount
    return () => {
      effectRan.current = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_URL}/login-admin`, { email, password }, { withCredentials: true });
      console.log('Login response:', response.data);
      
      if (response.data.admin) {
        console.log('Setting admin state:', response.data.admin);
        setAdmin(response.data.admin);
      } else {
        console.error('No admin data in response:', response.data);
      }
      
      return response.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Attempting to logout...');
      }
      // Even if the server request fails, we'll clear the local state
      try {
        // Make the logout request to the server
        await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        if (process.env.NODE_ENV !== 'production') {
          console.log('Logout request successful');
        }
      } catch (err) {
        // Log the error but continue with local state cleanup
        console.warn('Logout request failed but continuing with local cleanup:', err);
      }
      
      // Always clear the local state regardless of server response
      if (process.env.NODE_ENV !== 'production') {
        console.log('Clearing admin state');
      }
      setAdmin(null);
      
      // Clear any cookies manually if possible
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      return { success: true };
    } catch (err) {
      console.error('Logout failed completely:', err);
      // Still try to clear the state even if everything else fails
      setAdmin(null);
      return { success: false, error: err.message };
    }
  };

  const registerAdmin = async (adminData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/register-admin`, adminData, { withCredentials: true });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    registerAdmin
  };

  // Geliştirme modunda log sayısını azaltmak için conditional render
  if (process.env.NODE_ENV !== 'production') {
    console.log('Current auth state:', { admin, loading, error });
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 