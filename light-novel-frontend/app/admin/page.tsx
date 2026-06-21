'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
  totalBooks: 0,
  totalOrders: 0,
  totalUsers: 0,

  deliveredOrders: 0,
  pendingOrders: 0,
  shippingOrders: 0,
  cancelledOrders: 0,

  totalRevenue: 0
});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res =
          await apiService.admin.getDashboardStats();

        setStats(res.data.data);      
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 p-8">
      <h1 className="text-4xl font-bold mb-2 text-base-content">
        Tổng Quan Hệ Thống
      </h1>
      <p className="text-base-content/70 mb-10">
        Chào mừng quay trở lại Admin Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 transition-colors duration-300">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-base-content/70">Tổng sách</p>
              <p className="text-4xl font-bold mt-2">{stats.totalBooks}</p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 transition-colors duration-300">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-base-content/70">Đơn hàng</p>
              <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 transition-colors duration-300">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-base-content/70">Người dùng</p>
              <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        <div className="card bg-base-100 border border-base-200 shadow-sm p-6 transition-colors duration-300">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-base-content/70">Doanh thu</p>
              <p className="text-3xl font-bold mt-2">
                {stats.totalRevenue.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>
      </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

  <div className="stat bg-base-200 rounded-lg">
    <div className="stat-title">Đã giao</div>
    <div className="stat-value text-success">
      {stats.deliveredOrders}
    </div>
  </div>

  <div className="stat bg-base-200 rounded-lg">
    <div className="stat-title">Chờ xác nhận</div>
    <div className="stat-value text-warning">
      {stats.pendingOrders}
    </div>
  </div>

  <div className="stat bg-base-200 rounded-lg">
    <div className="stat-title">Đang giao</div>
    <div className="stat-value text-info">
      {stats.shippingOrders}
    </div>
  </div>

  <div className="stat bg-base-200 rounded-lg">
    <div className="stat-title">Đã hủy</div>
    <div className="stat-value text-error">
      {stats.cancelledOrders}
    </div>
  </div>

</div>

      {/* Quick Links */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-base-content">
          Quản lý nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a 
            href="/admin/books" 
            className="card bg-base-100 border border-base-200 shadow-sm p-8 hover:shadow-md transition-all duration-300 hover:border-primary/30"
          >
            <h3 className="text-xl font-bold text-base-content">📖 Quản lý Sách</h3>
            <p className="text-sm mt-2 text-base-content/70">
              Thêm, sửa, xóa sách
            </p>
          </a>
          <a 
            href="/admin/orders" 
            className="card bg-base-100 border border-base-200 shadow-sm p-8 hover:shadow-md transition-all duration-300 hover:border-primary/30"
          >
            <h3 className="text-xl font-bold text-base-content">📦 Quản lý Đơn hàng</h3>
            <p className="text-sm mt-2 text-base-content/70">
              Xử lý đơn hàng
            </p>
          </a>
          <a 
            href="/admin/users" 
            className="card bg-base-100 border border-base-200 shadow-sm p-8 hover:shadow-md transition-all duration-300 hover:border-primary/30"
          >
            <h3 className="text-xl font-bold text-base-content">👤 Quản lý Người dùng</h3>
            <p className="text-sm mt-2 text-base-content/70">
              Quản lý tài khoản
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}