'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import BookCard from '@/components/book/BookCard';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import apiService from '@/services/api';

interface Book {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number | string;
  image?: string;
  stock?: number | null;
  pageCount?: number;
  rating?: number;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  publisher?: {
    name: string;
  };
  tags?: {
    id: number;
    name: string;
  }[];
  reviews?: any[];
}

export default function BookDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBookDetail = async () => {
      try {
        setLoading(true);

        const res = await apiService.books.getBySlug(slug);

        if (!res.data?.data?.book) {
          throw new Error('Không tìm thấy sách');
        }

        setBook(res.data.data.book);
        setRelatedBooks(
          res.data.data.relatedBooks || []
        );
      } catch (error) {
        console.error('Lỗi tải chi tiết sách:', error);

        toast.error('Không tìm thấy sách này');

        router.push('/books');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [slug, router]);

  const handleAddToCart = async () => {
    if (!book) return;

    try {
      await addToCart(book.id);

      toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Đang tải...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sách
      </div>
    );
  }

  const stock = book.stock ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left - Image */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={book.image || '/images/default-book.jpg'}
              alt={book.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Right - Information */}
        <div className="space-y-6">

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              {book.title}
            </h1>

            {book.author && (
              <p className="text-xl text-primary mt-2">
                Tác giả: {book.author.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="text-3xl font-bold text-primary">
              {Number(book.price).toLocaleString('vi-VN')}đ
            </div>

            {book.rating !== undefined && (
              <div className="flex items-center gap-1 text-lg">
                ★ <span className="font-medium">{book.rating}</span>
              </div>
            )}
          </div>

          {/* Stock */}
          <div
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {stock > 0 ? `Còn ${stock} cuốn` : 'Hết hàng'}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Mô tả
            </h3>

            <p className="leading-relaxed text-base-content/80 whitespace-pre-line">
              {book.description || 'Đang cập nhật mô tả...'}
            </p>
          </div>

          {/* Tags */}
          {book.tags && book.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Thẻ
              </h3>

              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="badge badge-outline badge-lg"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className="flex-1 btn btn-primary btn-lg"
            >
              🛒 Thêm vào giỏ hàng
            </button>

            <button className="btn btn-outline btn-lg">
              ❤️ Yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">
            Sách liên quan
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {relatedBooks.map((relatedBook) => (
              <BookCard
                key={relatedBook.id}
                book={relatedBook}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}