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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Token yenileme işlemi
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('http://localhost:3001/api/auth/refresh-token', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Yeni token ile isteği tekrarla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token geçersizse kullanıcıyı logout yap
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
