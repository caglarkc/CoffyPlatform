import api from './api';

class AuthService {
  // Admin girişi - GET isteği
  async login(email, password) {
    try {
      const response = await api.get('/admin/login-admin', {
        params: { 
          email, 
          password 
        }
      });
      
      // Admin bilgilerini kaydet
      if (response.data.admin) {
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      }
      
      // Token bilgilerini kaydet
      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken);
        
        // Creator girişinde refreshToken gelir, normal admin girişinde gelmez
        if (response.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
        }
        
        if (response.data.tokens.accessTokenExpiresAt) {
          localStorage.setItem('tokenExpiry', response.data.tokens.accessTokenExpiresAt);
        }
      }
      console.log("response.data:", response.data);
      console.log("response",response);
      return response.data;
    } catch (error) {
      console.log("error:", error);
      throw error;
    }
  }

  // Admin kaydı - POST isteği (Sadece Creator yapabilir)
  async registerAdmin(adminData) {
    try {
      const response = await api.post('/admin/register-admin', adminData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Rol yükseltme - POST isteği (Sadece Creator veya üst rol yapabilir)
  async upgradeRole(data) {
    try {
      const response = await api.post('/admin/upgrade-role', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Rol düşürme - POST isteği (Sadece Creator veya üst rol yapabilir)
  async downgradeRole(data) {
    try {
      const response = await api.post('/admin/downgrade-role', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin güncelleme - POST isteği
  async updateAdmin(data) {
    try {
      const response = await api.post('/admin/update-admin', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Konum değiştirme - POST isteği
  async changeLocation(data) {
    try {
      const response = await api.post('/admin/change-location', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Admin silme - GET isteği (Sadece Creator veya üst rol yapabilir)
  async deleteAdmin(email) {
    try {
      const response = await api.get('/admin/delete-admin', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Token yenileme - GET isteği
  async refreshToken(email) {
    try {
      const response = await api.get('/admin/refresh-access-token', {
        params: { email }
      });
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        
        // accessTokenExpiresAt değeri varsa kaydet
        if (response.data.accessTokenExpiresAt) {
          localStorage.setItem('tokenExpiry', response.data.accessTokenExpiresAt);
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Telefon kontrolü - GET isteği
  async checkPhone(phone) {
    try {
      const response = await api.get('/admin/check-phone', {
        params: { phone }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Email kontrolü - GET isteği
  async checkEmail(email) {
    try {
      const response = await api.get('/admin/check-email', {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı çıkışı
  async logout() {
    try {
      const admin = this.getCurrentAdmin();
      if (admin && admin.id) {
        // Backend'de token'ları geçersiz kılma işlemi
        await api.get('/admin/logout-admin', {
          params: { adminId: admin.id }
        });
      }
      
      // Yerel depolamadan token ve kullanıcı bilgilerini temizle
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('admin');
      localStorage.removeItem('tokenExpiry');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Oturum kontrolü
  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) return false;
    
    // Token süresi dolmuş mu kontrol et
    const now = new Date().getTime();
    if (now > new Date(expiry).getTime()) {
      // Token süresi dolmuşsa, yenileme token'ı ile yeni token almayı dene
      this.refreshTokenSilently();
      return false;
    }
    
    return true;
  }

  // Mevcut admin bilgilerini al
  getCurrentAdmin() {
    const adminStr = localStorage.getItem('admin');
    return adminStr ? JSON.parse(adminStr) : null;
  }

  // Sessiz token yenileme
  async refreshTokenSilently() {
    try {
      const admin = this.getCurrentAdmin();
      if (admin && admin.email) {
        await this.refreshToken(admin.email);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Silent token refresh error:', error);
      return false;
    }
  }

  // Admin rolünü kontrol et
  isCreator() {
    const admin = this.getCurrentAdmin();
    return admin && admin.role && admin.role.type === 'Creator';
  }

  // Admin rolünü kontrol et
  hasRole(roleType) {
    const admin = this.getCurrentAdmin();
    return admin && admin.role && admin.role.type === roleType;
  }

  // Admin rolünün belirli bir seviyede veya üstünde olup olmadığını kontrol et
  hasRoleLevel(roleCode) {
    const admin = this.getCurrentAdmin();
    return admin && admin.role && admin.role.code >= roleCode;
  }
}

// Singleton instance oluştur
export default new AuthService();
