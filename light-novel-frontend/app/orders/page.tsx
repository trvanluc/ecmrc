'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import apiService from '@/services/api';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';
import ReviewModal from '@/components/book/ReviewModal';

interface OrderItem {
  book: {
    id: number;
    title: string;
    image?: string;
    reviews?: {
      id: number;
    }[];
  };

  quantity: number;
  price: number;
}

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  note?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await apiService.orders.getMyOrders();

      setOrders(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchOrders();
  }, []);

  const submitReview = async () => {
    try {
      await apiService.reviews.create(
        selectedBook.id,
        rating,
        comment
      );

      toast.success('Đánh giá thành công');

      setSelectedBook(null);

      fetchOrders();
    } catch (error) {
      toast.error('Không thể gửi đánh giá');
    }
  };

  const [returnOrderId, setReturnOrderId] =
    useState<number | null>(null);

  const [returnReason, setReturnReason] =
    useState('');

  const requestReturn = async () => {
    if (!returnOrderId) return;

    try {
      await apiService.orders.requestReturn(
        returnOrderId,
        returnReason
      );

      toast.success('Đã gửi yêu cầu trả hàng');

      setReturnOrderId(null);
      setReturnReason('');

      fetchOrders();
    } catch (error) {
      toast.error('Không thể gửi yêu cầu');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <div className="badge badge-warning">Chờ xác nhận</div>;
      case 'CONFIRMED': return <div className="badge badge-info">Đã xác nhận</div>;
      case 'SHIPPING': return <div className="badge badge-primary">Đang giao</div>;
      case 'DELIVERED': return <div className="badge badge-success">Đã giao</div>;
      case 'CANCELLED': return <div className="badge badge-error">Đã hủy</div>;
      case 'RETURN_REQUESTED': return <div className="badge badge-ghost">Yêu cầu trả hàng</div>;
      case 'RETURN_APPROVED': return <div className="badge badge-success">Đã duyệt trả hàng</div>;
      case 'RETURN_REJECTED': return <div className="badge badge-error">Đã từ chối trả hàng</div>;
      default: return <div className="badge">{status}</div>;
    }
  };

  const toggleOrder = (id: number) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-base-content">
              📦 Lịch Sử Đơn Hàng
            </h1>
            <p className="text-base-content/70 mt-2">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-3xl mb-4 text-base-content">Bạn chưa có đơn hàng nào</p>
              <a href="/books" className="btn btn-primary btn-lg">
                Bắt đầu mua sắm
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="card bg-base-100 border border-base-200 shadow-md overflow-hidden transition-colors duration-300"
                >
                  {/* Header */}
                  <div 
                    className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-base-200 transition-colors"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-base-content/60">Mã đơn hàng</p>
                        <p className="font-mono font-semibold">#{order.id}</p>
                      </div>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    <div className="text-right mt-3 md:mt-0">
                      <p className="text-sm text-base-content/60">Ngày đặt</p>
                      <p className="font-medium">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                    </div>

                    <div className="text-right mt-3 md:mt-0">
                      <p className="text-sm text-base-content/60">Tổng tiền</p>
                      <p className="text-xl font-bold text-primary">
                        {order.totalAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>

                  {/* Chi tiết đơn hàng */}
                  {expandedOrder === order.id && (
                    <div className="px-6 pb-6 border-t border-base-200">
                      <div className="pt-6 space-y-5">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex gap-4 items-center">
                            <div className="w-20 h-24 relative rounded-lg overflow-hidden border border-base-200">
                              <Image
                                src={item.book.image || "/images/default-book.jpg"}
                                alt={item.book.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-base-content">{item.book.title}</p>

                              <p className="text-sm text-base-content/60">
                                Số lượng: {item.quantity}
                              </p>

                              {order.status === 'DELIVERED' &&
                              item.book.reviews?.length === 0 && (
                                <button
                                  className="btn btn-warning btn-sm mt-2"
                                  onClick={() => setSelectedBook(item.book)}
                                >
                                  ⭐ Đánh giá
                                </button>
                              )}
                            </div>
                            <div className="font-semibold text-right text-base-content">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-base-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                          <p className="font-medium mb-2 text-base-content">Địa chỉ giao hàng</p>
                          <p className="text-base-content/80">{order.shippingAddress}</p>
                        </div>
                        {order.status === 'DELIVERED' && (
                          <button
                            className="btn btn-error btn-sm mt-4"
                            onClick={() =>
                              setReturnOrderId(order.id)
                            }
                          >
                            Yêu cầu trả hàng
                          </button>
                        )}
                        {order.note && (
                          <div>
                            <p className="font-medium mb-2 text-base-content">Ghi chú</p>
                            <p className="text-base-content/80">{order.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {returnOrderId && (
          <dialog className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                Yêu cầu trả hàng
              </h3>

              <textarea
                className="textarea textarea-bordered w-full mt-4"
                placeholder="Nhập lý do trả hàng..."
                value={returnReason}
                onChange={(e) =>
                  setReturnReason(e.target.value)
                }
              />

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() =>
                    setReturnOrderId(null)
                  }
                >
                  Hủy
                </button>

                <button
                  className="btn btn-error"
                  onClick={requestReturn}
                >
                  Gửi yêu cầu
                </button>
              </div>
            </div>
          </dialog>
        )}

        {/* Review Modal */}
        {selectedBook && (
          <dialog className="modal modal-open">
            <div className="modal-box bg-base-100 text-base-content border border-base-200">
              <h3 className="font-bold text-lg">
                Đánh giá {selectedBook.title}
              </h3>

              <div className="mt-4">
                <select
                  className="select select-bordered w-full"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐</option>
                  <option value={4}>⭐⭐⭐⭐</option>
                  <option value={3}>⭐⭐⭐</option>
                  <option value={2}>⭐⭐</option>
                  <option value={1}>⭐</option>
                </select>

                <textarea
                  className="textarea textarea-bordered w-full mt-4"
                  placeholder="Nhận xét..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setSelectedBook(null)}
                >
                  Hủy
                </button>

                <button
                  className="btn btn-primary"
                  onClick={submitReview}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </ProtectedRoute>
  );
}