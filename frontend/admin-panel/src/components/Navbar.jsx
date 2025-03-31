import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getRoleName, ROLES } from '../utils/roleUtils';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Navbar: Starting logout process');
      }
      await logout();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Navbar: Logout successful, redirecting to login');
      }
    } catch (err) {
      console.error('Navbar: Error during logout:', err);
    } finally {
      // Always navigate to login page even if there was an error
      navigate('/login', { replace: true });
    }
  };
  
  // Don't render navbar on login page
  if (location.pathname === '/login') return null;
  
  // Only show register link for role level 4 or higher (Region Admin and Creator)
  const pages = [
    { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> }
  ];
  
  if (admin?.role >= ROLES.REGION_ADMIN) {
    pages.push({ 
      title: 'Register Admin', 
      path: '/register', 
      icon: <PersonAddIcon fontSize="small" /> 
    });
  }
  
  const settings = [
    { title: 'Profile', onClick: () => navigate('/profile'), icon: <AccountCircleIcon fontSize="small" /> },
    { title: 'Logout', onClick: handleLogout, icon: <LogoutIcon fontSize="small" /> }
  ];
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop version */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            ADMIN PANEL
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {page.icon}
                    <Typography sx={{ ml: 1 }}>{page.title}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* Mobile title */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/dashboard"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            ADMIN
          </Typography>
          
          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => {
                  handleCloseNavMenu();
                  navigate(page.path);
                }}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'flex',
                  alignItems: 'center'
                }}
                startIcon={page.icon}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={admin?.name?.charAt(0) || 'A'} 
                  src="/static/images/avatar/2.jpg" 
                  sx={{ bgcolor: 'secondary.main' }}
                >
                  {admin?.name?.charAt(0) || 'A'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem sx={{ pointerEvents: 'none', opacity: 0.7 }}>
                <Typography textAlign="center">
                  {admin?.name} {admin?.surname}
                </Typography>
              </MenuItem>
              <Typography 
                textAlign="center" 
                sx={{ 
                  px: 2, 
                  py: 0.5, 
                  fontSize: '0.75rem', 
                  opacity: 0.7, 
                  textTransform: 'uppercase',
                  fontWeight: 'bold' 
                }}
              >
                {getRoleName(admin?.role)}
              </Typography>
              <Divider />
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={setting.onClick}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {setting.icon}
                    <Typography sx={{ ml: 1 }}>{setting.title}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 