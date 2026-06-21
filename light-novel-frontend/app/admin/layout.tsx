'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, ShoppingBag, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    user,
    logout,
    hydrated,
  } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center transition-colors duration-300">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen bg-base-200 text-base-content transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-72 bg-base-100 border-r border-base-200 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-base-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📖</div>
            <div>
              <h1 className="text-2xl font-bold text-base-content">LightNovel</h1>
              <p className="text-xs text-base-content/60">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-auto">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors text-base-content"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Tổng quan</span>
          </Link>
          <Link 
            href="/admin/books" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors text-base-content"
          >
            <BookOpen className="w-5 h-5" />
            <span>Quản lý Sách</span>
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors text-base-content"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Quản lý Đơn hàng</span>
          </Link>
          <Link 
            href="/admin/users" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-base-200 active:bg-base-300 transition-colors text-base-content"
          >
            <Users className="w-5 h-5" />
            <span>Quản lý Người dùng</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-base-200">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto bg-base-200 text-base-content">
        {children}
      </div>
    </div>
  );
}