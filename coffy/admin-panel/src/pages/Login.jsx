import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const effectRan = useRef(false);
  
  const { login, admin, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    // React 18 Strict Mode'da iki kez çalışmasını önle
    if (effectRan.current === true && process.env.NODE_ENV !== 'production') {
      return;
    }
    
    if (admin) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Already logged in, redirecting to dashboard');
      }
      navigate('/dashboard');
    }
    
    // Mark effect as run
    effectRan.current = true;
    
    return () => {
      effectRan.current = false;
    };
  }, [admin, navigate]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Submitting login form...');
      }
      const result = await login(formData.email, formData.password);
      if (process.env.NODE_ENV !== 'production') {
        console.log('Login result:', result);
      }
      
      // Check if admin is set and try to navigate
      if (result.admin) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Login successful, navigating to dashboard');
        }
        navigate('/dashboard', { replace: true });
      } else {
        console.error('Login seemed successful but no admin data returned');
        setLoginError('Login successful but failed to get admin data');
      }
    } catch (err) {
      console.error('Login submission error:', err);
      setLoginError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Show authentication error from context if available
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
    }
  }, [authError]);
  
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <Box sx={{ 
            backgroundColor: 'primary.main',
            p: 2,
            borderRadius: '50%',
            mb: 1
          }}>
            <LockOutlinedIcon sx={{ color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Admin Login
          </Typography>
          
          {loginError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {loginError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 