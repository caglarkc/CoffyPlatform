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
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailError = validateEmail(e.target.value);
    setErrors(prev => ({ ...prev, email: emailError }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordError = validatePassword(e.target.value);
    setErrors(prev => ({ ...prev, password: passwordError }));
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form doğrulama
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError
      });
      return;
    }

    try {
      setLoginError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
            <Typography component="h2" variant="h5" textAlign="center" gutterBottom>
              Giriş Yap
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-posta Adresi"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Şifre"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={toggleShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
              <Box sx={{ textAlign: 'center' }}>
                <Link href="#" variant="body2">
                  Şifrenizi mi unuttunuz?
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
