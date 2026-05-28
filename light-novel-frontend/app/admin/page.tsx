'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes, usersRes] = await Promise.all([
          apiService.books.getAll({ limit: 1 }),
          apiService.orders.getMyOrders(), // Admin nên có API riêng, tạm dùng này
          apiService.admin.getUsers() // Nếu có
        ]);

        setStats({
          totalBooks: booksRes.data.pagination?.total || 0,
          totalOrders: 124, // Tạm hardcode, sau sẽ kết nối API
          totalUsers: 48,
          totalRevenue: 24500000
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-2">Tổng Quan Hệ Thống</h1>
      <p className="text-base-content/70 mb-10">Chào mừng quay trở lại Admin Dashboard</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Tổng sách</p>
              <p className="text-4xl font-bold mt-2">{stats.totalBooks}</p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Đơn hàng</p>
              <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
            </div>
            <div className="text-5xl opacity-20">📦</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Người dùng</p>
              <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm opacity-70">Doanh thu</p>
              <p className="text-4xl font-bold mt-2">
                {(stats.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-5xl opacity-20">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Quản lý nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/admin/books" className="card bg-base-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold">📖 Quản lý Sách</h3>
            <p className="text-sm mt-2 opacity-70">Thêm, sửa, xóa sách</p>
          </a>
          <a href="/admin/orders" className="card bg-base-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold">📦 Quản lý Đơn hàng</h3>
            <p className="text-sm mt-2 opacity-70">Xử lý đơn hàng</p>
          </a>
          <a href="/admin/users" className="card bg-base-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold">👤 Quản lý Người dùng</h3>
            <p className="text-sm mt-2 opacity-70">Quản lý tài khoản</p>
          </a>
        </div>
      </div>
    </div>
  );
}