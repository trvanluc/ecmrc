'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import Image from 'next/image';

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
  returnReason?: string;
  returnRequestAt?: string;
  returnRejectReason?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedReason, setSelectedReason] =
  useState<string | null>(null);

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

  const approveReturn = async (
  orderId: number
) => {
  try {
    await apiService.admin.approveReturn(
      orderId
    );

    toast.success(
      'Đã duyệt trả hàng'
    );

    fetchOrders();
  } catch {
    toast.error(
      'Không thể duyệt trả hàng'
    );
  }
};

const rejectReturn = async (
  orderId: number
) => {
  try {
    await apiService.admin.rejectReturn(
      orderId
    );

    toast.success(
      'Đã từ chối trả hàng'
    );

    fetchOrders();
  } catch {
    toast.error(
      'Không thể từ chối'
    );
  }
};

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <div className="badge badge-warning">
            Chờ xác nhận
          </div>
        );

      case 'CONFIRMED':
        return (
          <div className="badge badge-info">
            Đã xác nhận
          </div>
        );

      case 'SHIPPING':
        return (
          <div className="badge badge-primary">
            Đang giao
          </div>
        );

      case 'DELIVERED':
        return (
          <div className="badge badge-success">
            Đã giao
          </div>
        );

      case 'CANCELLED':
        return (
          <div className="badge badge-error">
            Đã hủy
          </div>
        );

      case 'RETURN_REQUESTED':
        return (
          <div className="badge badge-warning">
            Chờ trả hàng
          </div>
        );

      case 'RETURNED':
        return (
          <div className="badge badge-success">
            Đã trả hàng
          </div>
        );

      case 'RETURN_REJECTED':
        return (
          <div className="badge badge-error">
            Từ chối trả hàng
          </div>
        );

      default:
        return (
          <div className="badge">
            {status}
          </div>
        );
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
          <option value="RETURN_REQUESTED">
            Chờ trả hàng
          </option>

          <option value="RETURNED">
            Đã trả hàng
          </option>

          <option value="RETURN_REJECTED">
            Từ chối trả hàng
          </option>
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
                      {order.status === 'RETURN_REQUESTED' &&
                        order.returnRequestAt && (
                          <p className="text-xs text-warning mt-1">
                            Yêu cầu lúc:
                            {' '}
                            {format(
                              new Date(order.returnRequestAt),
                              'dd/MM/yyyy HH:mm',
                              { locale: vi }
                            )}
                          </p>
                      )}
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
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'PENDING' && (
  <>
    <button
      className="btn btn-success btn-sm"
      onClick={() =>
        updateOrderStatus(
          order.id,
          'CONFIRMED'
        )
      }
    >
      Xác nhận
    </button>

    <button
      className="btn btn-error btn-sm"
      onClick={() =>
        updateOrderStatus(
          order.id,
          'CANCELLED'
        )
      }
    >
      Hủy
    </button>
  </>
)}
{order.status === 'CONFIRMED' && (
  <button
    className="btn btn-primary btn-sm"
    onClick={() =>
      updateOrderStatus(
        order.id,
        'SHIPPING'
      )
    }
  >
    Đang giao
  </button>
)}
{order.status === 'SHIPPING' && (
  <button
    className="btn btn-success btn-sm"
    onClick={() =>
      updateOrderStatus(
        order.id,
        'DELIVERED'
      )
    }
  >
    Đã giao
  </button>
)}
{order.status === 'RETURN_REQUESTED' && (
  <>
    <button
      className="btn btn-success btn-sm"
      onClick={() =>
        approveReturn(order.id)
      }
    >
      Duyệt trả hàng
    </button>

    <button
      className="btn btn-error btn-sm"
      onClick={() =>
        rejectReturn(order.id)
      }
    >
      Từ chối
    </button>
  </>
)}

{order.status === 'RETURN_REQUESTED' && (
  <button
    className="btn btn-info btn-sm"
    onClick={() =>
      setSelectedReason(
        order.returnReason || ''
      )
    }
  >
    Xem lý do
  </button>
)}
                      
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

      {selectedReason !== null && (
  <dialog className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg mb-4">
        Lý do trả hàng
      </h3>

      <div className="bg-base-200 rounded-lg p-4">
        {selectedReason}
      </div>

      <div className="modal-action">
        <button
          className="btn"
          onClick={() =>
            setSelectedReason(null)
          }
        >
          Đóng
        </button>
      </div>
    </div>
  </dialog>
)}
    </div>
  );
  


}