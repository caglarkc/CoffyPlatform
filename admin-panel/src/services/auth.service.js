import api from './api';

class AuthService {
  // Kullanıcı girişi
  async login(email, password) {
    try {
      const response = await api.get('/auth/login-with-email-password', {
        params: { email, password }
      });
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı çıkışı
  async logout() {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Oturum kontrolü
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  // Kullanıcı bilgilerini getir
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }

  // Kullanıcı rolünü kontrol et (admin yetkilendirmesi için)
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Kullanıcı bilgilerini güncelle (sunucudan)
  async refreshUserData() {
    try {
      const response = await api.get('/auth/get-user');
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      throw error;
    }
  }
}

// Singleton instance oluştur
export default new AuthService();
