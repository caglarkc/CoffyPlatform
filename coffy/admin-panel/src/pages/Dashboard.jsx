import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getRoleName, getRoleColor, ROLES } from '../utils/roleUtils';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Dashboard = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dashboard: Starting logout process');
      }
      await logout();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Dashboard: Logout successful, redirecting to login');
      }
    } catch (err) {
      console.error('Dashboard: Error during logout:', err);
    } finally {
      // Always navigate to login page even if there was an error
      navigate('/login', { replace: true });
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-start' },
              justifyContent: 'space-between',
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' } }}>
                <Typography component="h1" variant="h4" gutterBottom>
                  Welcome, {admin?.name}!
                </Typography>
                <Chip 
                  label={getRoleName(admin?.role)} 
                  color={getRoleColor(admin?.role)}
                  sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
                />
              </Box>
              <Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ mt: { xs: 2, sm: 0 } }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Admin Info Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Admin Details</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Full Name
                </Typography>
                <Typography variant="body1">
                  {admin?.name} {admin?.surname}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="body1">
                  {getRoleName(admin?.role)} (Level {admin?.role})
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {admin?.city}, {admin?.region}, {admin?.district}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Store ID
                </Typography>
                <Typography variant="body1">
                  {admin?.storeId}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/profile')}
                startIcon={<AccountCircleIcon />}
              >
                View Full Profile
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Quick Actions Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {admin?.role >= ROLES.REGION_ADMIN && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/register')}
                      sx={{ py: 2, justifyContent: 'flex-start' }}
                    >
                      Register New Admin
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AccountCircleIcon />}
                    onClick={() => navigate('/profile')}
                    sx={{ py: 2, justifyContent: 'flex-start' }}
                  >
                    Edit Profile
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 