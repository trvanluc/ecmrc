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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('bank');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
  }, [items, router]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Vui lòng nhập địa chỉ giao hàng");
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
      const newOrder = res.data.data;

      setOrderCreated(newOrder);
      toast.success("Đơn hàng đã được tạo!");

      if (paymentMethod === 'bank') {
        setShowQR(true);
      } else {
        clearCart();
        router.push(`/orders?success=true`);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!orderCreated) return;

    try {
      toast.success(
        "Đã nhận thông tin chuyển khoản. Đang chờ xác nhận.",
        { duration: 5000 }
      );
      setPaymentSubmitted(true);
    } catch (error) {
      toast.error("Xác nhận thanh toán thất bại");
    }
  };

  if (items.length === 0) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-2 text-base-content">Thanh Toán</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* Thông tin giao hàng + Thanh toán */}
            <div className="lg:col-span-3 space-y-8">
              {/* Thông tin giao hàng */}
              <div className="card bg-base-100 border border-base-200 shadow-sm p-8 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-base-content">📍 Thông tin giao hàng</h2>
                <div className="space-y-6">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Họ và tên</span>
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
                      <span className="label-text font-medium text-base-content">
                        Địa chỉ giao hàng <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <textarea 
                      value={shippingAddress} 
                      onChange={(e) => setShippingAddress(e.target.value)} 
                      className="textarea textarea-bordered w-full h-28" 
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="card bg-base-100 border border-base-200 shadow-sm p-8 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-base-content">💳 Phương thức thanh toán</h2>
                <div className="space-y-4">
                  <label className="flex gap-4 cursor-pointer p-4 border border-base-200 rounded-xl hover:bg-base-200 transition-colors">
                    <input 
                      type="radio" 
                      checked={paymentMethod === 'bank'} 
                      onChange={() => setPaymentMethod('bank')} 
                      className="radio radio-primary" 
                    />
                    <div>
                      <p className="font-medium text-base-content">Chuyển khoản ngân hàng</p>
                      <p className="text-sm text-base-content/60">Quét mã QR để thanh toán</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary + QR Code */}
            <div className="lg:col-span-2">
              <div className="card bg-base-100 border border-base-200 shadow-sm p-8 sticky top-24 transition-colors duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-base-content">🛒 Đơn hàng của bạn</h2>

                {/* Danh sách sản phẩm */}
                <div className="space-y-4 max-h-[380px] overflow-auto">
                  {items.map((item) => (
                    <div key={item.bookId} className="flex gap-4">
                      <div className="w-16 h-20 relative rounded overflow-hidden border border-base-200">
                        <Image 
                          src={item.book.image || "/images/default-book.jpg"} 
                          alt={item.book.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-2 text-base-content">{item.book.title}</p>
                        <p className="text-sm text-base-content/60">x{item.quantity}</p>
                      </div>
                      <div className="font-semibold text-base-content">
                        {(item.book.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-base-200 my-6" />

                <div className="text-xl font-bold flex justify-between text-base-content">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* Nút thanh toán / QR Code */}
                {!showQR ? (
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={loading || !shippingAddress.trim()}
                    className="btn btn-primary w-full mt-8 btn-lg"
                  >
                    {loading ? "Đang xử lý..." : "Tạo đơn hàng"}
                  </button>
                ) : (
                  <div className="mt-8 text-center">
                    <h3 className="font-semibold mb-4 text-base-content">Quét mã QR để thanh toán</h3>
                    
                    {/* VietQR Code */}
                    <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-base-200">
                      <img 
                        src={`https://img.vietqr.io/image/${"970422"}-${"0329541201"}-compact2.jpg?amount=${totalPrice}&addInfo=Thanh%20toan%20don%20hang%20${orderCreated?.id}`} 
                        alt="VietQR" 
                        className="mx-auto"
                      />
                    </div>

                    <p className="text-sm mt-4 text-base-content/60">
                      Ngân hàng: MB Bank<br />Số tài khoản: 0329541201
                    </p>

                    <button
                      onClick={handleConfirmPayment}
                      className="btn btn-success w-full mt-6"
                    >
                      ✅ Đã chuyển khoản
                    </button>

                    {paymentSubmitted && (
                      <div className="mt-4 p-3 rounded-lg bg-info/10 border border-info/30 text-info text-sm">
                        ⏳ Đã nhận thông tin, đang chờ xác nhận
                      </div>  
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}