import api from '@/src/lib/axios';

const apiService = {
  // Auth
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/login', { email, password }),
    
    register: (name: string, email: string, password: string) => 
      api.post('/auth/register', { name, email, password }),
    
    me: () => api.get('/auth/me'),
  },

  // Books
  books: {
    getAll: (params?: any) => api.get('/books', { params }),
    getById: (id: number) => api.get(`/books/${id}`),
    getBySlug: (slug: string) => api.get(`/books/slug/${slug}`),
    getFeatured: () => api.get('/books/featured'),
    getNewArrivals: () => api.get('/books/new-arrivals'),
  },

  // Cart
  cart: {
    get: () => api.get('/cart'),
    add: (bookId: number, quantity = 1) => 
      api.post('/cart/add', { bookId, quantity }),
    update: (bookId: number, quantity: number) => 
      api.put(`/cart/update/${bookId}`, { quantity }),
    remove: (bookId: number) => api.delete(`/cart/remove/${bookId}`),
  },

  // Order
  orders: {
    create: (data: any) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders'),
  },

  // Wishlist (sau này)
  wishlist: {
    get: () => api.get('/wishlist'),
    add: (bookId: number) => api.post('/wishlist/add', { bookId }),
    remove: (bookId: number) => api.delete(`/wishlist/remove/${bookId}`),
  }
};

export default apiService;