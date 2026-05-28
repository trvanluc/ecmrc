'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiService from '@/services/api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect về cart nếu giỏ hàng trống
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ giao hàng");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shippingAddress: shippingAddress.trim(),
        paymentMethod,
        note: note.trim() || undefined,
      };

      const res = await apiService.orders.create(orderData);
      
      toast.success("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua hàng.", {
        duration: 6000,
      });

      clearCart();                    // Xóa giỏ hàng
      router.push(`/orders?success=true`);  // Chuyển sang trang Orders
    } catch (error: any) {
      toast.error(error?.message || "Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-2">Thanh Toán</h1>
        <p className="text-base-content/70 mb-10">Kiểm tra thông tin trước khi đặt hàng</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* Thông tin giao hàng */}
          <div className="lg:col-span-3 space-y-8">
            <div className="card bg-base-100 shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">📍 Thông tin giao hàng</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Họ và tên</span>
                  </label>
                  <input 
                    type="text" 
                    value={user?.name || ''} 
                    className="input input-bordered w-full" 
                    disabled 
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Địa chỉ giao hàng <span className="text-red-500">*</span></span>
                  </label>
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="textarea textarea-bordered w-full h-28"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, thành phố..."
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Ghi chú cho shipper (tùy chọn)</span>
                  </label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="textarea textarea-bordered w-full h-20"
                    placeholder="Giao vào giờ hành chính / Gọi trước khi giao..."
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="card bg-base-100 shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">💳 Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex gap-4 cursor-pointer p-4 border rounded-xl hover:bg-base-200 transition-colors">
                  <input 
                    type="radio" 
                    name="payment" 
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="radio radio-primary mt-1"
                  />
                  <div>
                    <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-gray-500">Bạn trả tiền khi nhận được hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-sm p-8 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6">🛒 Đơn hàng của bạn</h2>

              <div className="max-h-[420px] overflow-auto pr-2 space-y-6">
                {items.map((item) => (
                  <div key={item.bookId} className="flex gap-4">
                    <div className="w-20 h-24 relative rounded-lg overflow-hidden border border-base-300 flex-shrink-0">
                      <Image
                        src={item.book.image || "/images/default-book.jpg"}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-2">{item.book.title}</p>
                      <p className="text-sm text-gray-500 mt-1">Số lượng: <span className="font-medium">{item.quantity}</span></p>
                      <p className="font-semibold mt-2">
                        {(item.book.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t my-8"></div>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-2xl pt-6 border-t">
                  <span>Tổng cộng</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading || !shippingAddress.trim()}
                className="btn btn-primary w-full mt-10 btn-lg text-lg font-medium"
              >
                {loading ? "Đang xử lý đơn hàng..." : "Xác nhận đặt hàng"}
              </button>

              <p className="text-center text-xs opacity-60 mt-5">
                Bằng việc đặt hàng, bạn đồng ý với <span className="underline">Điều khoản dịch vụ</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 