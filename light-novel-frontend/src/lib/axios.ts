import axios from 'axios';
import { useAuthStore } from '@/src/store/useAuthStore';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Tự động gắn Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  
  async (error) => {
    const originalRequest = error.config;

    // Token hết hạn (401) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Nếu bạn lưu refreshToken
        if (!refreshToken) {
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Gọi refresh token
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
          refreshToken
        });

        const { accessToken } = res.data.data;
        
        // Cập nhật token mới
        useAuthStore.getState().setUser(
          useAuthStore.getState().user!,
          accessToken
        );

        // Thử lại request cũ
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        useAuthStore.getState().logout();
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Xử lý các lỗi khác
    const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi";
    toast.error(errorMessage);

    return Promise.reject(error);
  }
);

export default api;