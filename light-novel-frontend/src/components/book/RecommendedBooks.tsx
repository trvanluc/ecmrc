'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import apiService from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function RecommendedBooks() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let books: any[] = [];

        if (isAuthenticated) {
          const res =
            await apiService.recommendations.getPersonalized();

          books = Array.isArray(res.data.data)
            ? res.data.data
            : [];
        } else {
          const res =
            await apiService.books.getFeatured();

          books = Array.isArray(res.data.data)
            ? res.data.data
            : [];
        }

        setRecommendations(books);
      } catch (error) {
        console.error('Lỗi lấy gợi ý:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="skeleton h-[380px] rounded-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {recommendations.map((book: any) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}