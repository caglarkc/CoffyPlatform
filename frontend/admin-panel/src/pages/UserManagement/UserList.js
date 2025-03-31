import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service';
import userService from '../../services/user.service';
import { formatDate, formatUserStatus } from '../../utils/formatters';

const UserList = () => {
  const navigate = useNavigate();
  const { currentUser, hasRoleLevel } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const mockUsers = [
        {
          id: 1,
          name: 'Ali',
          surname: 'Yılmaz',
          email: 'ali.yilmaz@example.com',
          phone: '5551234567',
          role: { type: 'StoreAdmin', code: 1 },
          location: { region: 'Marmara', city: 'İstanbul', district: 'Kadıköy', storeId: 'ST001' }
        },
        {
          id: 2,
          name: 'Ayşe',
          surname: 'Demir',
          email: 'ayse.demir@example.com',
          phone: '5559876543',
          role: { type: 'StoreWorker', code: 0 },
          location: { region: 'Marmara', city: 'İstanbul', district: 'Kadıköy', storeId: 'ST001' }
        },
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (err) {
      setError('Kullanıcılar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      console.log(`Kullanıcı silindi: ${userToDelete.email}`);
      
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Kullanıcı silinirken bir hata oluştu');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.surname.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phone.includes(searchTerm) ||
      user.role.type.toLowerCase().includes(searchTermLower)
    );
  });

  const displayedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddAdmin = () => {
    navigate('/users/add');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, mx: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddAdmin}
        >
          Yeni Admin Ekle
        </Button>
      </Box>
      
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Ara..."
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
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad Soyad</TableCell>
                <TableCell>E-posta</TableCell>
                <TableCell>Telefon</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Konum</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{`${user.name} ${user.surname}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.type} 
                        color={user.role.code >= 3 ? "primary" : user.role.code >= 1 ? "secondary" : "default"} 
                        variant="outlined" 
                      />
                    </TableCell>
                    <TableCell>{`${user.location.city}, ${user.location.district}`}</TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" aria-label="düzenle" component={Link} to={`/users/edit/${user.id}`}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" aria-label="sil" onClick={() => handleDeleteClick(user)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz kayıtlı kullanıcı bulunmuyor'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </Paper>
      
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToDelete && `${userToDelete.name} ${userToDelete.surname} (${userToDelete.email}) kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
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
