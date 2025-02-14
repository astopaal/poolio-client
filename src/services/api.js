import axios from 'axios';
import store from '../store';
import { logout } from '../features/auth/store/authSlice';
import { showToast } from '../components/Toast';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - token ekleme
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token yenileme
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token hatası ve henüz retry yapılmamışsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Token yenileniyorsa, kuyruğa ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post('http://localhost:5001/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, newRefreshToken } = response.data;
        
        // Yeni token'ları kaydet
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Bekleyen istekleri işle
        processQueue(null, accessToken);
        
        // Orijinal isteği yeni token ile tekrarla
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Token yenileme başarısız - kullanıcıyı logout yap
        localStorage.clear();
        store.dispatch(logout());
        showToast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Diğer hatalar için
    if (error.response?.status === 403) {
      // Yetkisiz erişim - kullanıcıyı logout yap
      localStorage.clear();
      store.dispatch(logout());
      showToast.error('Bu işlem için yetkiniz bulunmuyor.');
    }

    return Promise.reject(error);
  }
);

export default api; 