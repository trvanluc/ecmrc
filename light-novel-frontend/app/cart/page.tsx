'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    fetchCart,
    isLoading,
  } = useCartStore();

  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = async (
    bookId: number,
    quantity: number,
    stock: number
  ) => {
    if (quantity < 1) return;

    if (quantity > stock) {
      toast.error('Vượt quá tồn kho');
      return;
    }

    try {
      setUpdatingId(bookId);
      await updateQuantity(bookId, quantity);
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (bookId: number, title: string) => {
    if (!confirm(`Xóa "${title}" khỏi giỏ hàng?`)) return;

    try {
      await removeFromCart(bookId);
      toast.success('Đã xóa sản phẩm');
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!items.length) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <ShoppingBag className="w-20 h-20 text-base-300 mb-6" />
          <h1 className="text-4xl font-bold mb-3">Giỏ hàng trống</h1>
          <p className="text-base-content/60 mb-8">
            Hãy khám phá những light novel hấp dẫn dành cho bạn.
          </p>
          <Link
            href="/books"
            className="btn btn-primary btn-lg rounded-full px-10"
          >
            Khám phá ngay
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/books" className="btn btn-circle btn-ghost">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="text-4xl font-bold">Giỏ hàng</h1>
            <p className="text-base-content/60">
              {totalItems} sản phẩm trong giỏ của bạn
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => (
              <div
                key={item.bookId}
                className="bg-base-100 border border-base-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-32 h-44 rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={item.book.image || '/images/default-book.jpg'}
                      alt={item.book.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/books/${item.book.slug}`}
                        className="text-xl font-semibold hover:text-primary"
                      >
                        {item.book.title}
                      </Link>

                      <p className="text-sm text-base-content/60 mt-2">
                        {item.book.author?.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
                      <div className="text-2xl font-bold text-primary">
                        {(
                          item.book.price * item.quantity
                        ).toLocaleString('vi-VN')}
                        đ
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          className="btn btn-circle btn-outline btn-sm"
                          disabled={updatingId === item.bookId}
                          onClick={() =>
                            handleQuantityChange(
                              item.bookId,
                              item.quantity - 1,
                              item.book.stock
                            )
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-circle btn-outline btn-sm"
                          disabled={updatingId === item.bookId}
                          onClick={() =>
                            handleQuantityChange(
                              item.bookId,
                              item.quantity + 1,
                              item.book.stock
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleRemove(item.bookId, item.book.title)
                    }
                    className="btn btn-ghost btn-circle text-error self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="sticky top-24 bg-base-100 border border-base-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span className="text-success">Miễn phí</span>
                </div>

                <div className="divider" />

                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="btn btn-primary btn-lg w-full mt-8 rounded-full"
              >
                Thanh toán ngay
              </button>

              <Link
                href="/books"
                className="btn btn-ghost w-full mt-3 rounded-full"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}