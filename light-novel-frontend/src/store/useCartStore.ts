import { create } from 'zustand';
import axios from 'axios';

interface CartItem {
  id: number;
  bookId: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    price: number;
    image?: string;
    author?: { name: string };
  };
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (bookId: number, quantity?: number) => Promise<void>;
  updateQuantity: (bookId: number, quantity: number) => Promise<void>;
  removeFromCart: (bookId: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/v1/cart');
      const { items, totalItems, totalPrice } = res.data.data;
      
      set({ items, totalItems, totalPrice, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Lỗi lấy giỏ hàng", error);
    }
  },

  addToCart: async (bookId: number, quantity = 1) => {
    try {
      await axios.post('/api/v1/cart/add', { bookId, quantity });
      await get().fetchCart(); // Refresh cart
    } catch (error: any) {
      throw error.response?.data?.message || "Không thể thêm vào giỏ hàng";
    }
  },

  updateQuantity: async (bookId: number, quantity: number) => {
    try {
      await axios.put(`/api/v1/cart/update/${bookId}`, { quantity });
      await get().fetchCart();
    } catch (error: any) {
      throw error.response?.data?.message || "Không thể cập nhật số lượng";
    }
  },

  removeFromCart: async (bookId: number) => {
    try {
      await axios.delete(`/api/v1/cart/remove/${bookId}`);
      await get().fetchCart();
    } catch (error: any) {
      throw error.response?.data?.message || "Không thể xóa sản phẩm";
    }
  },

  clearCart: () => {
    set({ items: [], totalItems: 0, totalPrice: 0 });
  }
}));