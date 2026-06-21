'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookCard from '@/components/book/BookCard';
import apiService from '@/services/api';

interface Book {
  id: number;
  title: string;
  slug?: string;
  image?: string;
  price: number;
  author?: { name: string };
  rating?: number;
}

export default function BooksPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await apiService.books.getAll({
          page: currentPage,
          limit: 20,
          search,
          category,
          sort,
        });

        setBooks(res.data?.data?.books || []);
        setTotalPages(res.data?.data?.pagination?.totalPages || 1);
      } catch (error) {
        console.error('Lỗi tải sách:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, search, category, sort]);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/books?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/books?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header + Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-base-content">
            Tất cả Light Novel
          </h1>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3">
            <select
              className="select select-bordered w-full md:w-48 bg-base-100 text-base-content border-base-300 focus:border-primary"
              value={category}
              onChange={(e) => handleFilter('category', e.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Isekai">Isekai</option>
              <option value="Romance">Romance</option>
              <option value="Action">Action</option>
              <option value="Comedy">Comedy</option>
            </select>

            <select
              className="select select-bordered w-full md:w-48 bg-base-100 text-base-content border-base-300 focus:border-primary"
              value={sort}
              onChange={(e) => handleFilter('sort', e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Search Result Info */}
        {search && (
          <p className="mb-6 text-lg text-base-content">
            Kết quả tìm kiếm cho: <span className="font-semibold">"{search}"</span>
          </p>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton h-[380px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`btn ${
                  currentPage === page 
                    ? 'btn-primary' 
                    : 'btn-ghost border-base-300 hover:bg-base-200 dark:hover:bg-base-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {books.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-2xl text-base-content">
              Không tìm thấy sách nào 😢
            </p>
          </div>
        )}
      </div>
    </div>
  );
}