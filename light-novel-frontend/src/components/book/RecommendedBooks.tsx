'use client';

import { useEffect, useState } from 'react';
import BookCard from './BookCard';
import apiService from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function RecommendedBooks({ bookId }: { bookId?: number }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bookId) {
          // Because You Read
          const res = await apiService.recommendations.becauseYouRead(bookId);
          setRecommendations(res.data.data || []);
        } else if (isAuthenticated) {
          // Personalized
          const res = await apiService.recommendations.getPersonalized();
          setRecommendations(res.data.data || []);
        } else {
          // Featured
          const res = await apiService.books.getFeatured();
          setRecommendations(res.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookId, isAuthenticated]);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {recommendations.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}