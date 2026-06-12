import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => void;

  setUser: (
    user: User,
    token: string
  ) => void;

  updateUser: (
    userData: Partial<User>
  ) => void;

  loadUser: () => void;

  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: false,

      setHydrated: () =>
        set({
          hydrated: true,
        }),

      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...userData,
              }
            : null,
        })),

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const res = await api.post(
            '/auth/login',
            {
              email,
              password,
            }
          );

          const {
            user,
            accessToken,
          } = res.data.data;

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return user;
        } catch (error: any) {
          set({
            isLoading: false,
          });

          throw (
            error.response?.data
              ?.message ||
            'Đăng nhập thất bại'
          );
        }
      },

      register: async (
        name,
        email,
        password
      ) => {
        set({
          isLoading: true,
        });

        try {
          const res = await api.post(
            '/auth/register',
            {
              name,
              email,
              password,
            }
          );

          const {
            user,
            accessToken,
          } = res.data.data;

          set({
            user,
            token: accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
          });

          throw (
            error.response?.data
              ?.message ||
            'Đăng ký thất bại'
          );
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });

        localStorage.removeItem(
          'auth-storage'
        );
      },

      loadUser: () => {},
    }),
    {
      name: 'auth-storage',

      onRehydrateStorage: () => {
        return (state) => {
          state?.setHydrated();
        };
      },
    }
  )
);