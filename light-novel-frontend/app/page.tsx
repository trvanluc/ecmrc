
'use client';

import BookCard from '@/components/book/BookCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import RecommendedBooks from '@/components/book/RecommendedBooks';
import { useAuthStore } from '@/store/useAuthStore';

interface Book {
  id: number;
  title: string;
  slug?: string;
  image?: string;
  price: number;
  author?: { name: string };
  rating?: number;
}

export default function Home() {
  const { user } = useAuthStore();

  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          api.get('/books/featured'),
          api.get('/books/new-arrivals')
        ]);

        setFeaturedBooks(featuredRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">

      {/* HERO SECTION */}
      <div className="hero min-h-[70vh] bg-base-200 relative overflow-hidden transition-colors duration-300">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />

        <div className="hero-content text-center text-base-content z-10 px-4">
          <div className="max-w-3xl">

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Khám Phá Thế Giới
              <br />

              <span className="text-primary">
                Light Novel
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-base-content/80">
              Hàng trăm tựa Light Novel hay nhất • Giao hàng nhanh • Giá tốt
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/books"
                className="btn btn-primary btn-lg text-lg px-10"
              >
                Khám Phá Ngay
              </Link>

              <Link
                href="/books?sort=popular"
                className="btn btn-outline btn-lg text-lg px-8"
              >
                Sách Bán Chạy
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent" />
      </div>

      {/* FEATURED OR RECOMMENDED */}
      <div className="max-w-7xl mx-auto px-4 py-16 transition-colors duration-300">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-base-content">
              {user ? '✨ Gợi Ý Dành Riêng Cho Bạn' : '✨ Sách Nổi Bật'}
            </h2>

            <p className="text-base-content/70">
              {user
                ? 'Dựa trên hành vi đọc và sở thích của bạn'
                : 'Những tựa Light Novel được yêu thích nhất'}
            </p>
          </div>

          <Link href="/books" className="btn btn-ghost gap-2">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {user ? (
          <RecommendedBooks />
        ) : loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-[380px] rounded-xl bg-base-300"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* NEW ARRIVALS */}
      <div className="bg-base-200 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-base-content">
                📚 Sách Mới Về
              </h2>

              <p className="text-base-content/70">
                Cập nhật những tựa Light Novel mới nhất
              </p>
            </div>

            <Link
              href="/books?sort=newest"
              className="btn btn-ghost gap-2"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {newArrivals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

