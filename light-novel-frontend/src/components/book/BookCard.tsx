'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/src/store/useCartStore';
import toast from 'react-hot-toast';

interface Book {
  id: number;
  title: string;
  slug?: string;
  image?: string;
  price: number;
  author?: { name: string };
  rating?: number;
  stock?: number;
}

interface BookCardProps {
  book: Book;
  showAddToCart?: boolean;
}

export default function BookCard({ book, showAddToCart = true }: BookCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(book.id);
      toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`, {
        icon: '🛒',
      });
    } catch (error: any) {
      toast.error(error || "Không thể thêm vào giỏ hàng");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
      <Link href={`/books/${book.slug || book.id}`} className="block relative">
        {/* Book Cover */}
        <div className="relative h-[280px] overflow-hidden">
          <Image
            src={book.image || "/images/default-book.jpg"}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Stock badge */}
          {book.stock && book.stock < 10 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Chỉ còn {book.stock}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[48px]">
              {book.title}
            </h3>

            {/* Author */}
            {book.author && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {book.author.name}
              </p>
            )}

            {/* Rating + Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-medium">
                  {book.rating?.toFixed(1) || "4.5"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-primary">
                  {book.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      {showAddToCart && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 btn btn-primary btn-sm gap-2"
            disabled={!book.stock || book.stock <= 0}
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </button>

          <button className="btn btn-ghost btn-sm px-3">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}