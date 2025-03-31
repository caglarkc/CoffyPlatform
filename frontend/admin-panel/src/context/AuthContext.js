import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

// Context oluşturma
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getCurrentAdmin();
          setCurrentUser(user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login fonksiyonu
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      setCurrentUser(data.admin);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register fonksiyonu (Sadece Creator yapabilir)
  const registerAdmin = async (adminData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.registerAdmin(adminData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout fonksiyonu
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Context değerlerini sağla
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    registerAdmin,
    isCreator: () => authService.isCreator(),
    hasRole: (roleType) => authService.hasRole(roleType),
    hasRoleLevel: (roleCode) => authService.hasRoleLevel(roleCode),
    isAuthenticated: () => authService.isAuthenticated()
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook oluştur
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
