import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Login form işlemleri
  const handleLoginEmailChange = (e) => {
    setLoginEmail(e.target.value);
    const emailError = validateEmail(e.target.value);
    setLoginErrors(prev => ({ ...prev, email: emailError }));
  };

  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
    const passwordError = validatePassword(e.target.value);
    setLoginErrors(prev => ({ ...prev, password: passwordError }));
  };

  const toggleShowLoginPassword = () => {
    setShowLoginPassword(prev => !prev);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Form doğrulama
    const emailError = validateEmail(loginEmail);
    const passwordError = validatePassword(loginPassword);

    if (emailError || passwordError) {
      setLoginErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    try {
      setLoginError('');
      const result = await login(loginEmail, loginPassword);
      
      // Başarılı giriş sonrası dashboard'a yönlendir
      if (result && result.admin) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Coffy Admin Panel
        </Typography>
        
        <Card sx={{ width: '100%', mt: 2 }}>
          <CardContent>
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Admin Girişi
            </Typography>
            
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLoginSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-posta Adresi"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginEmail}
                onChange={handleLoginEmailChange}
                error={!!loginErrors.email}
                helperText={loginErrors.email}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Şifre"
                type={showLoginPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={handleLoginPasswordChange}
                error={!!loginErrors.password}
                helperText={loginErrors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowLoginPassword}
                        edge="end"
                      >
                        {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
              </Button>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Not: Yeni admin kayıtları sadece yetkili adminler tarafından yapılabilir. Lütfen giriş yaparak yönetim paneline erişin.
              </Alert>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
