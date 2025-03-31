import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PeopleAlt as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  Block as BlockedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import userService from '../../services/user.service';
import { formatDate } from '../../utils/formatters';

// Mock data for charts (gerçek veriler için API'den veri çekebilirsiniz)
const recentUsers = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', createdAt: '2023-03-10T12:00:00Z' },
  { id: 2, name: 'Ayşe Demir', email: 'ayse@example.com', createdAt: '2023-03-09T10:30:00Z' },
  { id: 3, name: 'Mehmet Kaya', email: 'mehmet@example.com', createdAt: '2023-03-08T14:15:00Z' },
  { id: 4, name: 'Fatma Şahin', email: 'fatma@example.com', createdAt: '2023-03-07T09:45:00Z' },
];

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box sx={{ 
          backgroundColor: `${color}.light`,
          borderRadius: '50%',
          width: 60,
          height: 60,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {React.cloneElement(icon, { fontSize: 'large', sx: { color: `${color}.main` } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Gerçek API'nizi bağlamak istediğinizde bu kısmı açın:
        // const response = await userService.getUserStats();
        // setStats(response);
        
        // Şimdilik mock veri kullanıyoruz
        setTimeout(() => {
          setStats({
            totalUsers: 1245,
            activeUsers: 876,
            pendingUsers: 124,
            blockedUsers: 45,
            recentUsers: recentUsers
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Kullanıcı istatistikleri yüklenirken hata oluştu.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* İstatistik Kartları */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Kullanıcı"
            value={stats.activeUsers}
            icon={<VerifiedIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doğrulanmamış"
            value={stats.pendingUsers}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Engellenmiş"
            value={stats.blockedUsers}
            icon={<BlockedIcon />}
            color="error"
          />
        </Grid>
        
        {/* Son Kayıt Olan Kullanıcılar */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Son Kayıt Olan Kullanıcılar" />
            <Divider />
            <List>
              {stats.recentUsers.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemText
                    primary={user.name}
                    secondary={user.email}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(user.createdAt)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        
        {/* Diğer istatistik kartları/grafikleri burada olabilir */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Sistem Durumu
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="h5" color="success.main" gutterBottom>
                Tüm Sistemler Çalışıyor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Son güncelleme: {formatDate(new Date().toISOString())}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
