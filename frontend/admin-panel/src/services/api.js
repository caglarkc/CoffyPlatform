import axios from 'axios';

// API istemcisi oluşturma
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // auth-service'in çalıştığı port
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek araya giricisi (interceptor) - Her istekte token eklemek için
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cevap araya giricisi - 401 Unauthorized hatalarını yakalamak için
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Eğer 401 hatası alırsak ve bu token yenileme isteği değilse
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Token yenileme işlemi
        const admin = JSON.parse(localStorage.getItem('admin') || '{}');
        if (!admin.email) {
          throw new Error('Admin bilgisi bulunamadı');
        }
        
        // Backend'e email parametresi ile istek gönder
        const response = await axios.get('http://localhost:3001/api/admin/refresh-access-token', {
          params: { email: admin.email }
        });
        
        // Yeni token bilgilerini kaydet
        if (response.data && response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          
          if (response.data.accessTokenExpiresAt) {
            localStorage.setItem('tokenExpiry', response.data.accessTokenExpiresAt);
          }
          
          // Yeni token ile isteği tekrarla
          originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        } else {
          throw new Error('Token yenileme başarısız');
        }
      } catch (refreshError) {
        // Refresh token geçersizse kullanıcıyı logout yap
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('admin');
        localStorage.removeItem('tokenExpiry');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
