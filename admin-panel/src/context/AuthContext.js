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
          const user = authService.getCurrentUser();
          setCurrentUser(user);
          
          // Kullanıcı bilgilerini sunucudan güncelle
          try {
            const refreshedUser = await authService.refreshUserData();
            setCurrentUser(refreshedUser);
          } catch (refreshError) {
            console.error('Kullanıcı bilgileri güncellenemedi:', refreshError);
            // Ciddi bir hata varsa (örneğin token geçersizse) logout yap
            if (refreshError.response && refreshError.response.status === 401) {
              await logout();
            }
          }
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
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
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
    isAdmin: () => authService.isAdmin(),
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
