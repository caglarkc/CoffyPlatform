import React, { useState, useEffect } from 'react';
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
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Breadcrumbs,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service';
import { validateEmail, validatePassword, validateName, validateSurname, validatePhone } from '../../utils/validators';

// Rol kodları - değiştirilmedi ama artık ters eşleme için de kullanılacak
const ROLE_CODES = {
  Creator: 5,
  RegionAdmin: 4,
  CityAdmin: 3,
  DistrictAdmin: 2,
  StoreAdmin: 1,
  StoreWorker: 0
};

// Rol kodlarından rol isimlerine ters eşleme fonksiyonu
const getRoleNameByCode = (roleCode) => {
  for (const [roleName, code] of Object.entries(ROLE_CODES)) {
    if (code === roleCode) {
      return roleName;
    }
  }
  return 'StoreWorker'; // Varsayılan rol
};

const AddAdmin = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Admin form state
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: '',
    role: 0, // En düşük yetki seviyesi (artık sayısal değer olarak)
    location: {
      region: '',
      city: '',
      district: '',
      storeId: ''
    }
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Kullanıcının yetki seviyesine göre seçilebilecek rolleri belirle
  const [availableRoles, setAvailableRoles] = useState([]);
  
  // Şifre giriş modalı için state
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  
  useEffect(() => {
    // Kullanıcı bilgilerini kontrol et
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = authService.getCurrentAdmin();
    console.log("Current user:", user);
    
    if (!user || user.role === undefined) {
      console.log("User or user role not found");
      navigate('/login');
      return;
    }
    
    // Kullanıcının rol değerini doğrudan al (artık sayısal değer)
    const userRoleCode = parseInt(user.role);
    console.log("User role code:", userRoleCode);
    
    // Eğer rol kodu geçersizse varsayılan değer (en düşük rol)
    if (isNaN(userRoleCode) || userRoleCode === null) {
      setAvailableRoles([0]);
      return;
    }
    
    // Kullanıcının kendi rol seviyesinden düşük seviyeleri filtrele (sayısal olarak)
    const roles = Object.values(ROLE_CODES).filter(code => code < userRoleCode);
    
    // Eğer roller listesi boşsa, en azından varsayılan bir rol ekle
    if (roles.length === 0 && userRoleCode > 0) {
      roles.push(0); // StoreWorker rolü (0)
    }
    
    setAvailableRoles(roles);
    
    // Eğer kullanıcı Creator değilse, girdiyi otomatik doldur
    if (userRoleCode !== 5) { // 5 = Creator
      setFormData(prev => ({
        ...prev,
        creatorEmail: user.email,
      }));
    }
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (name === 'role') {
      // Rol değerini sayısal olarak işleme
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Form doğrulama
    let error = '';
    if (name === 'email') error = validateEmail(value);
    else if (name === 'password') error = validatePassword(value);
    else if (name === 'name') error = validateName(value);
    else if (name === 'surname') error = validateSurname(value);
    else if (name === 'phone') error = validatePhone(value);
    
    if (error) {
      setFormErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };
  
  const handlePasswordDialogOpen = (data) => {
    setOpenPasswordDialog(true);
    setRegisterData(data);
  };
  
  const handlePasswordDialogClose = () => {
    setOpenPasswordDialog(false);
    setConfirmPassword('');
    setShowConfirmPassword(false);
    setLoading(false);
  };
  
  const handlePasswordConfirm = async () => {
    if (!confirmPassword) {
      setError('Şifre girilmedi, işlem iptal edildi.');
      handlePasswordDialogClose();
      return;
    }
    
    try {
      // Şifreyi ve kayıt verilerini birleştir
      const dataToSend = {
        ...registerData,
        creatorPassword: confirmPassword
      };
      
      // Admin kaydını yap
      const result = await authService.registerAdmin(dataToSend);
      
      setSuccess(result.message || 'Admin başarıyla oluşturuldu!');
      
      // Formu temizle
      setFormData({
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: '',
        role: 0, // Burayı güncelledim - StoreWorker (0)
        location: {
          region: '',
          city: '',
          district: '',
          storeId: ''
        }
      });
      
      // Modal'ı kapat
      handlePasswordDialogClose();
      
      // 3 saniye sonra kullanıcı listesine yönlendir
      setTimeout(() => {
        navigate('/users');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt işlemi sırasında bir hata oluştu.');
      console.log("error:", err);
      handlePasswordDialogClose();
    }
  };
  
  // Enter tuşu ile şifre onaylama
  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter' && confirmPassword) {
      handlePasswordConfirm();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama
    const errors = {};
    if (!formData.name) errors.name = 'Ad gereklidir';
    else if (validateName(formData.name)) errors.name = validateName(formData.name);
    
    if (!formData.surname) errors.surname = 'Soyad gereklidir';
    else if (validateSurname(formData.surname)) errors.surname = validateSurname(formData.surname);
    
    if (!formData.email) errors.email = 'E-posta adresi gereklidir';
    else if (validateEmail(formData.email)) errors.email = validateEmail(formData.email);
    
    if (!formData.password) errors.password = 'Şifre gereklidir';
    else if (validatePassword(formData.password)) errors.password = validatePassword(formData.password);
    
    if (!formData.phone) errors.phone = 'Telefon numarası gereklidir';
    else if (validatePhone(formData.phone)) errors.phone = validatePhone(formData.phone);
    
    if (!formData.location.region) errors['location.region'] = 'Bölge gereklidir';
    if (!formData.location.city) errors['location.city'] = 'Şehir gereklidir';
    if (!formData.location.district) errors['location.district'] = 'İlçe gereklidir';
    if (!formData.location.storeId) errors['location.storeId'] = 'Mağaza ID gereklidir';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Mevcut kullanıcı bilgilerini al
      const currentAdmin = authService.getCurrentAdmin();
      
      // API'ye gönderilecek veriyi hazırla
      const registerData = {
        ...formData,
        creatorEmail: currentAdmin.email,
        creatorPassword: '', // Bu alanı şifre modalından alacağız
        role: parseInt(formData.role) // Bu sayısal değer olduğundan emin oluyoruz
      };
      
      // Email'i test amaçlı sabit değere ayarlama (geliştirme sırasında)
      registerData.creatorEmail = "alicaglarkocer@gmail.com";
      
      console.log("Kayıt verileri:", registerData);
      
      // Şifre modalını aç
      handlePasswordDialogOpen(registerData);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt işlemi sırasında bir hata oluştu.');
      console.log("error:", err);
      setLoading(false);
    }
  };
  
  // Kullanıcı giriş yapmamışsa veya yetki seviyesi Creator değilse uyarı göster
  if (!currentUser) {
    return (
      <Box sx={{ mt: 4, mx: 2 }}>
        <Alert severity="warning">
          Bu sayfaya erişmek için giriş yapmanız gerekmektedir. Lütfen giriş yapın.
        </Alert>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="/dashboard">
            Dashboard
          </Link>
          <Link underline="hover" color="inherit" href="/users">
            Kullanıcılar
          </Link>
          <Typography color="text.primary">Yeni Admin Ekle</Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Yeni Admin Ekle
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" gutterBottom>
                Kişisel Bilgiler
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Ad"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="surname"
                label="Soyad"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                error={!!formErrors.surname}
                helperText={formErrors.surname}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="E-posta"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
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
                value={formData.password}
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
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
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                disabled={loading}
              />
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Yetki ve Konum Bilgileri
              </Typography>
              
              <FormControl fullWidth margin="normal" error={!!formErrors.role}>
                <InputLabel id="role-label">Rol</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Rol"
                  onChange={handleChange}
                  disabled={loading}
                >
                  {availableRoles.length > 0 ? (
                    availableRoles.map(roleCode => (
                      <MenuItem key={roleCode} value={roleCode} style={{ 
                        paddingLeft: '16px',
                        backgroundColor: formData.role === roleCode ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                      }}>
                        {getRoleNameByCode(roleCode)} (Seviye: {roleCode})
                      </MenuItem>
                    ))
                  ) : (
                    // Eğer roller boşsa varsayılan roller göster
                    <MenuItem value={0}>
                      StoreWorker (Varsayılan)
                    </MenuItem>
                  )}
                </Select>
                {formErrors.role && (
                  <FormHelperText>{formErrors.role}</FormHelperText>
                )}
                {availableRoles.length === 0 && (
                  <FormHelperText>
                    Mevcut rol seviyenizden daha düşük seviyeli rol bulunmuyor.
                  </FormHelperText>
                )}
              </FormControl>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="region"
                label="Bölge"
                name="location.region"
                value={formData.location.region}
                onChange={handleChange}
                error={!!formErrors['location.region']}
                helperText={formErrors['location.region']}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="city"
                label="Şehir"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                error={!!formErrors['location.city']}
                helperText={formErrors['location.city']}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="district"
                label="İlçe"
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                error={!!formErrors['location.district']}
                helperText={formErrors['location.district']}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="storeId"
                label="Mağaza ID"
                name="location.storeId"
                value={formData.location.storeId}
                onChange={handleChange}
                error={!!formErrors['location.storeId']}
                helperText={formErrors['location.storeId']}
                disabled={loading}
              />
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate('/users')}
                  disabled={loading}
                >
                  İptal
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || Object.keys(formErrors).length > 0}
                >
                  {loading ? <CircularProgress size={24} /> : 'Admin Ekle'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Şifre Onay Modalı */}
      <Dialog 
        open={openPasswordDialog} 
        onClose={handlePasswordDialogClose}
        aria-labelledby="form-dialog-title"
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '450px',
            borderRadius: '8px'
          }
        }}
      >
        <DialogTitle id="form-dialog-title" sx={{ borderBottom: '1px solid #eee', pb: 2 }}>
          İşlem Onayı
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ mb: 2 }}>
            İşlemi onaylamak için lütfen kendi şifrenizi girin:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="confirmPassword"
            label="Şifre"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handlePasswordKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #eee', pt: 2, pb: 2, px: 3 }}>
          <Button onClick={handlePasswordDialogClose} color="secondary" variant="outlined">
            İptal
          </Button>
          <Button 
            onClick={handlePasswordConfirm} 
            color="primary" 
            variant="contained"
            disabled={!confirmPassword}
          >
            Onayla
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddAdmin; 