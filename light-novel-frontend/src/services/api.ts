import api from '@/lib/api';

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
  },

  // User
  users: {
  updateProfile: (data: {
    name: string;
    phone?: string;
    address?: string;
    avatar?: string;
  }) =>
    api.put('/users/profile', data),
  }, 

  // Recommendations
    recommendations: {
    getPersonalized: () => api.get('/recommendations/personalized'),
    becauseYouRead: (bookId: number) => api.get(`/recommendations/because-you-read/${bookId}`),
  },

  // Admin
  admin: {
    getUsers: () => api.get('/admin/users'),

    getBooks: (params?: { search?: string }) =>
      api.get('/admin/books', { params }),

    createBook: (data: {
      title: string;
      slug: string;
      description: string;
      price: number;
      stock: number;
      image?: string;
      authorId: number;
      categoryId: number;
    }) =>
      api.post('/admin/books', data),

    updateBook: (id: number, data: any) => api.put(`/admin/books/${id}`, data),
    
    deleteBook: (id: number) =>
      api.delete(`/admin/books/${id}`),

    getOrders: () => api.get('/admin/orders'),

    updateOrderStatus: (
      orderId: number,
      status: string
    ) =>
      api.put(`/admin/orders/${orderId}/status`, {
        status,
      }),
    updateUserRole: (
      userId: number,
      role: string
    ) =>
      api.put(`/admin/users/${userId}/role`, {
        role,
      }),

    getDashboardStats: () =>
      api.get('/admin/dashboard-stats'),
  },

  reviews: {
    create: (
      bookId: number,
      rating: number,
      comment: string
    ) =>
      api.post('/reviews', {
        bookId,
        rating,
        comment,
      }),

    getByBook: (bookId: number) =>
      api.get(`/reviews/book/${bookId}`),

    getMyReviews: () =>
      api.get('/reviews/my-reviews'),
  },
};

export default apiService;