import { create } from 'zustand';
import api from '@/lib/api';

interface CartItem {
  id: number;
  bookId: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    price: number;
    image?: string;
    slug?: string;
    stock: number;
    author?: {
      name: string;
    };
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (
    bookId: number,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (
    bookId: number,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (
    bookId: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
}



api.interceptors.request.use((config) => {
  const authStorage =
    typeof window !== 'undefined'
      ? localStorage.getItem('auth-storage')
      : null;

  const token = authStorage
    ? JSON.parse(authStorage)?.state?.token
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const useCartStore = create<CartState>(
  (set, get) => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,

    fetchCart: async () => {
      set({ isLoading: true });

      try {
        const res = await api.get('/cart');
        const cartData = res.data?.data || {};

        const items = (
          cartData.items || []
        ).map((item: any) => ({
          ...item,
          book: {
            ...item.book,
            price: Number(item.book.price),
          },
        }));

        set({
          items,
          totalItems:
            Number(cartData.totalItems) || 0,
          totalPrice:
            Number(cartData.totalPrice) || 0,
        });
      } catch (error) {
        console.error(
          'Lỗi lấy giỏ hàng:',
          error
        );

        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      } finally {
        set({ isLoading: false });
      }
    },

    addToCart: async (
      bookId,
      quantity = 1
    ) => {
      try {
        await api.post('/cart/add', {
          bookId,
          quantity,
        });

        await get().fetchCart();
      } catch (error: any) {
        throw (
          error?.response?.data?.message ||
          'Không thể thêm vào giỏ hàng'
        );
      }
    },

    updateQuantity: async (
      bookId,
      quantity
    ) => {
      try {
        await api.put(
          `/cart/update/${bookId}`,
          { quantity }
        );

        await get().fetchCart();
      } catch (error: any) {
        throw (
          error?.response?.data?.message ||
          'Không thể cập nhật số lượng'
        );
      }
    },

    removeFromCart: async (
      bookId
    ) => {
      try {
        await api.delete(
          `/cart/remove/${bookId}`
        );

        await get().fetchCart();
      } catch (error: any) {
        throw (
          error?.response?.data?.message ||
          'Không thể xóa sản phẩm'
        );
      }
    },

    clearCart: async () => {
      try {
        await api.delete(
          '/cart/clear'
        );

        set({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      } catch (error: any) {
        throw (
          error?.response?.data?.message ||
          'Không thể xoá giỏ hàng'
        );
      }
    },
  })
);