import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getRoleName, ROLES } from '../utils/roleUtils';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 0, // Default role (Worker)
    city: '',
    region: '',
    district: '',
    storeId: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { registerAdmin, admin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Roles lower than current admin's role
  const availableRoles = () => {
    const currentRoleLevel = parseInt(admin?.role);
    
    // Create an array with role values less than current admin's role
    const roleOptions = [];
    for (let i = 0; i < currentRoleLevel; i++) {
      roleOptions.push(i);
    }
    
    return roleOptions;
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Basic validation
    const requiredFields = ['name', 'surname', 'email', 'phone', 'password', 'role', 'city', 'region', 'district', 'storeId'];
    for (const field of requiredFields) {
      if (formData[field] === '' || formData[field] === undefined) {
        setError(`${field} is required`);
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      // Remove confirmPassword from data sent to API
      const { confirmPassword, ...adminData } = formData;
      
      // Ensure role is sent as a number
      adminData.role = parseInt(adminData.role);
      
      await registerAdmin(adminData);
      setSuccess(true);
      // Reset form after successful registration
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 0,
        city: '',
        region: '',
        district: '',
        storeId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
            <PersonAddIcon sx={{ color: 'white' }} />
          </Box>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Register New Admin
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Admin registered successfully!
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="First Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="surname"
                  label="Last Name"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                  >
                    {availableRoles().map(roleValue => (
                      <MenuItem key={roleValue} value={roleValue}>
                        {getRoleName(roleValue)} (Level {roleValue})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="storeId"
                  label="Store ID"
                  name="storeId"
                  value={formData.storeId}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="region"
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="district"
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register Admin'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 