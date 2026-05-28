'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';

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
  user: {
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Giả sử bạn có API admin/orders (nếu chưa có thì dùng getMyOrders tạm thời)
      const res = await apiService.admin.getOrders();
      let filteredOrders = res.data.data || [];

      if (filterStatus) {
        filteredOrders = filteredOrders.filter((order: Order) => order.status === filterStatus);
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    if (!confirm(`Xác nhận chuyển trạng thái đơn hàng #${orderId} thành "${newStatus}"?`)) return;

    try {
      await apiService.admin.updateOrderStatus(orderId, newStatus);
      toast.success(`Đơn hàng #${orderId} đã được cập nhật`);
      fetchOrders();
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📦 Quản Lý Đơn Hàng</h1>
        
        <select 
          className="select select-bordered"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả đơn hàng</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="SHIPPING">Đang giao</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-sm overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono">#{order.id}</td>
                  <td>
                    <div>
                      <p className="font-medium">{order.user.name}</p>
                      <p className="text-xs text-gray-500">{order.user.email}</p>
                    </div>
                  </td>
                  <td>
                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                  <td className="font-semibold text-primary">
                    {order.totalAmount.toLocaleString('vi-VN')}đ
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <select 
                        className="select select-bordered select-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="PENDING">Chờ</option>
                        <option value="CONFIRMED">Xác nhận</option>
                        <option value="SHIPPING">Đang giao</option>
                        <option value="DELIVERED">Đã giao</option>
                        <option value="CANCELLED">Hủy</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {orders.length === 0 && !loading && (
        <div className="text-center py-20 text-xl">Không có đơn hàng nào</div>
      )}
    </div>
  );
}