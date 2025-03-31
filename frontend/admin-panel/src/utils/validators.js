// E-posta doğrulama
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'E-posta adresi gereklidir';
  if (!re.test(email)) return 'Geçerli bir e-posta adresi giriniz';
  return '';
};

// Şifre doğrulama
export const validatePassword = (password) => {
  if (!password) return 'Şifre gereklidir';
  if (password.length < 6) return 'Şifre en az 6 karakter olmalıdır';
  return '';
};

// Ad doğrulama
export const validateName = (name) => {
  if (!name) return 'Ad gereklidir';
  if (name.length < 2) return 'Ad en az 2 karakter olmalıdır';
  return '';
};

// Soyad doğrulama
export const validateSurname = (surname) => {
  if (!surname) return 'Soyad gereklidir';
  if (surname.length < 2) return 'Soyad en az 2 karakter olmalıdır';
  return '';
};

// Telefon numarası doğrulama
export const validatePhone = (phone) => {
  const re = /^[0-9+() -]{10,15}$/;
  if (!phone) return 'Telefon numarası gereklidir';
  if (!re.test(phone)) return 'Geçerli bir telefon numarası giriniz';
  return '';
};

// Form doğrulama (tüm alanlar)
export const validateForm = (values) => {
  const errors = {};
  
  // E-posta doğrulama
  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;
  
  // Şifre doğrulama (eğer şifre alanı varsa)
  if ('password' in values) {
    const passwordError = validatePassword(values.password);
    if (passwordError) errors.password = passwordError;
  }
  
  // Ad doğrulama
  if ('name' in values) {
    const nameError = validateName(values.name);
    if (nameError) errors.name = nameError;
  }
  
  // Soyad doğrulama
  if ('surname' in values) {
    const surnameError = validateSurname(values.surname);
    if (surnameError) errors.surname = surnameError;
  }
  
  // Telefon doğrulama
  if ('phone' in values) {
    const phoneError = validatePhone(values.phone);
    if (phoneError) errors.phone = phoneError;
  }
  
  return errors;
};
