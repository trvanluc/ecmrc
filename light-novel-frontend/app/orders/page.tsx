'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import apiService from '@/services/api';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import toast from 'react-hot-toast';

interface OrderItem {
  book: {
    title: string;
    image?: string;
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiService.orders.getMyOrders();
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Lỗi tải lịch sử đơn hàng:", error);
        toast.error("Không thể tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <div className="badge badge-warning">Chờ xác nhận</div>;
      case 'CONFIRMED': return <div className="badge badge-info">Đã xác nhận</div>;
      case 'SHIPPING': return <div className="badge badge-primary">Đang giao</div>;
      case 'DELIVERED': return <div className="badge badge-success">Đã giao</div>;
      case 'CANCELLED': return <div className="badge badge-error">Đã hủy</div>;
      default: return <div className="badge">{status}</div>;
    }
  };

  const toggleOrder = (id: number) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">📦 Lịch Sử Đơn Hàng</h1>
          <p className="text-base-content/70 mt-2">Quản lý và theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-3xl mb-4">Bạn chưa có đơn hàng nào</p>
            <a href="/books" className="btn btn-primary btn-lg">Bắt đầu mua sắm</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="card bg-base-100 shadow-md overflow-hidden">
                {/* Header */}
                <div 
                  className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-base-200 transition-colors"
                  onClick={() => toggleOrder(order.id)}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>
                      <p className="font-mono font-semibold">#{order.id}</p>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="text-right mt-3 md:mt-0">
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-medium">
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </p>
                  </div>

                  <div className="text-right mt-3 md:mt-0">
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-xl font-bold text-primary">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {/* Chi tiết đơn hàng */}
                {expandedOrder === order.id && (
                  <div className="px-6 pb-6 border-t">
                    <div className="pt-6 space-y-5">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-4 items-center">
                          <div className="w-20 h-24 relative rounded-lg overflow-hidden border">
                            <Image
                              src={item.book.image || "/images/default-book.jpg"}
                              alt={item.book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.book.title}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="font-semibold text-right">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <p className="font-medium mb-2">Địa chỉ giao hàng</p>
                        <p className="opacity-80">{order.shippingAddress}</p>
                      </div>
                      {order.note && (
                        <div>
                          <p className="font-medium mb-2">Ghi chú</p>
                          <p className="opacity-80">{order.note}</p>
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
    </ProtectedRoute>
  );
}