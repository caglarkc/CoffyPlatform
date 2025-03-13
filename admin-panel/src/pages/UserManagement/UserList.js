import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import userService from '../../services/user.service';
import { formatDate, formatUserStatus } from '../../utils/formatters';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Silme modalı için state
  const [open, setOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Gerçek API'nizi kullanmak istediğinizde bu kısmı açın:
      // const response = await userService.getAllUsers(page + 1, rowsPerPage);
      // setUsers(response.users);
      // setTotalUsers(response.totalCount);
      
      // Mock veri
      setTimeout(() => {
        const mockUsers = [
          { id: 1, name: 'Ali', surname: 'Yılmaz', email: 'ali@example.com', phone: '5551234567', isActive: 'active', createdAt: '2023-03-01T10:30:00Z' },
          { id: 2, name: 'Ayşe', surname: 'Demir', email: 'ayse@example.com', phone: '5552345678', isActive: 'active', createdAt: '2023-03-02T11:20:00Z' },
          { id: 3, name: 'Mehmet', surname: 'Kaya', email: 'mehmet@example.com', phone: '5553456789', isActive: 'notVerified', createdAt: '2023-03-03T09:15:00Z' },
          { id: 4, name: 'Fatma', surname: 'Şahin', email: 'fatma@example.com', phone: '5554567890', isActive: 'blocked', createdAt: '2023-03-04T14:45:00Z' },
          { id: 5, name: 'Ahmet', surname: 'Yıldız', email: 'ahmet@example.com', phone: '5555678901', isActive: 'active', createdAt: '2023-03-05T16:30:00Z' },
        ];

        setUsers(mockUsers);
        setTotalUsers(50);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Kullanıcılar yüklenirken hata oluştu.');
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (userToDelete) {
        // API çağrısı
        // await userService.deleteUser(userToDelete.id);
        
        // UI'dan kullanıcıyı kaldır
        setUsers(users.filter(user => user.id !== userToDelete.id));
      }
    } catch (err) {
      setError('Kullanıcı silinirken hata oluştu.');
    } finally {
      setOpen(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpen(false);
    setUserToDelete(null);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // API çağrısı
      // await userService.changeUserStatus(userId, newStatus);
      
      // UI'daki kullanıcı durumunu güncelle
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));
    } catch (err) {
      setError('Kullanıcı durumu güncellenirken hata oluştu.');
    }
  };

  // Kullanıcıları filtrele
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.name} ${user.surname}`.toLowerCase();
    return fullName.includes(searchLower) ||
           user.email.toLowerCase().includes(searchLower) ||
           user.phone.includes(searchTerm);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'notVerified': return 'warning';
      case 'blocked': return 'error';
      case 'deleted': return 'default';
      default: return 'default';
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Kullanıcı Yönetimi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/users/new"
        >
          Yeni Kullanıcı
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Kullanıcı ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim Soyisim</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>Kayıt Tarihi</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={formatUserStatus(user.isActive)}
                    color={getStatusColor(user.isActive)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell align="right">
                  <Box>
                    {user.isActive === 'active' ? (
                      <IconButton
                        color="warning"
                        onClick={() => handleStatusChange(user.id, 'blocked')}
                        title="Kullanıcıyı engelle"
                      >
                        <BlockIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={() => handleStatusChange(user.id, 'active')}
                        title="Kullanıcıyı aktifleştir"
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="primary"
                      component={Link}
                      to={`/users/${user.id}`}
                      title="Düzenle"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(user)}
                      title="Sil"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Kullanıcı bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Silme Onay Modalı */}
      <Dialog
        open={open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToDelete && `"${userToDelete.name} ${userToDelete.surname}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            İptal
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
