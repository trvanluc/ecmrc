import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user, token) => {
        set({ user, token, isAuthenticated: true });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/api/v1/auth/login', { email, password });
          const { user, accessToken } = res.data.data;
          
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true,
            isLoading: false 
          });
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data?.message || "Đăng nhập thất bại";
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await axios.post('/api/v1/auth/register', { name, email, password });
          const { user, accessToken } = res.data.data;
          
          set({ 
            user, 
            token: accessToken, 
            isAuthenticated: true,
            isLoading: false 
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw error.response?.data?.message || "Đăng ký thất bại";
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('auth-storage');
      },

      loadUser: () => {
        // Tự động load user khi refresh trang (được xử lý bởi persist)
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);