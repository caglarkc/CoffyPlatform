import api from './api';

class UserService {
  // Tüm kullanıcıları getir (admin için)
  async getAllUsers(page = 1, limit = 10) {
    try {
      const response = await api.get('/admin/users', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Belirli bir kullanıcıyı getir
  async getUserById(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı oluştur
  async createUser(userData) {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcıyı güncelle
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcıyı aktif/pasif yap
  async changeUserStatus(userId, status) {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcıyı sil
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Kullanıcı istatistiklerini getir
  async getUserStats() {
    try {
      const response = await api.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
