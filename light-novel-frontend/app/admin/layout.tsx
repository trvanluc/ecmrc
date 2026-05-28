'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Book, Users, ShoppingCart, BarChart3, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="flex h-screen bg-base-200">
      {/* Sidebar */}
      <div className="w-72 bg-base-100 border-r border-base-300 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>📖</span> Admin Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">LightNovel Management</p>
        </div>

        <div className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300">
            <BarChart3 className="w-5 h-5" />
            <span>Tổng quan</span>
          </Link>
          <Link href="/admin/books" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300">
            <Book className="w-5 h-5" />
            <span>Quản lý Sách</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300">
            <ShoppingCart className="w-5 h-5" />
            <span>Quản lý Đơn hàng</span>
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300">
            <Users className="w-5 h-5" />
            <span>Quản lý Người dùng</span>
          </Link>
        </div>

        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}