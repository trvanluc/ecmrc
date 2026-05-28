'use client';

import BookCard from '@/components/book/BookCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import RecommendedBooks from '@/components/book/RecommendedBooks';

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
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <div className="hero min-h-[70vh] bg-gradient-to-br from-purple-900 via-pink-800 to-violet-950 relative overflow-hidden">
        <div className="hero-content text-center text-white z-10 px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Khám Phá Thế Giới<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Light Novel
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 opacity-90">
              Hàng trăm tựa Light Novel hay nhất • Giao hàng nhanh • Giá tốt
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/books" className="btn btn-primary btn-lg text-lg px-10">
                Khám Phá Ngay
              </Link>
              <Link href="/books?sort=popular" className="btn btn-outline btn-lg text-lg px-8">
                Sách Bán Chạy
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200 to-transparent" />
      </div>

      {/* FEATURED BOOKS */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">✨ Sách Nổi Bật</h2>
            <p className="text-base-content/70">Những tựa Light Novel được yêu thích nhất</p>
          </div>
          <Link href="/books" className="btn btn-ghost gap-2">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-[380px] rounded-xl" />
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
      <div className="bg-base-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">📚 Sách Mới Về</h2>
              <p className="text-base-content/70">Cập nhật những tựa Light Novel mới nhất</p>
            </div>
            <Link href="/books?sort=newest" className="btn btn-ghost gap-2">
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
      
      {/* RECOMMENDATION SECTION - PHẦN ĐIỂM NHẤN */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-base-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">✨ Gợi Ý Dành Riêng Cho Bạn</h2>
            <p className="text-base-content/70">Dựa trên hành vi đọc và sở thích của bạn</p>
          </div>
          <Link href="/books" className="btn btn-ghost gap-2">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <RecommendedBooks />
      </div>

      {/* Banner Promo */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary to-pink-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">🎉 Ưu đãi đặc biệt</h3>
          <p className="text-xl mb-6">Giảm ngay 20% cho đơn hàng đầu tiên của bạn</p>
          <Link href="/books" className="btn btn-lg btn-secondary">
            Mua Ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

