import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getRoleName } from '../utils/roleUtils';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const Profile = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  if (!admin) {
    return null;
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              width: 80, 
              height: 80,
              mr: 3
            }}
          >
            <AccountBoxIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4">
              {admin.name} {admin.surname}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {getRoleName(admin.role)}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Full Name" 
                      secondary={`${admin.name} ${admin.surname}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email" 
                      secondary={admin.email || "Not available"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={admin.phone || "Not available"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BadgeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Role" 
                      secondary={`${getRoleName(admin.role)} (Level ${admin.role})`} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Location Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="City" 
                      secondary={admin.city || "Not available"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Region" 
                      secondary={admin.region || "Not available"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="District" 
                      secondary={admin.district || "Not available"} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StoreIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Store ID" 
                      secondary={admin.storeId || "Not available"} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Account ID: {admin.id}
          </Typography>
          {admin.whoCreate && (
            <Typography variant="body2" color="text.secondary">
              Created by: {admin.whoCreate}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 