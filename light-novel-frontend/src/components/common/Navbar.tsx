'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDark, setIsDark] = useState(true);

  const router = useRouter();

  // Dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsDark(savedTheme === 'dark');
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  // Search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="bg-base-100 text-base-content shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-2xl text-base-content hover:text-primary transition-colors"
          >
            <span className="text-3xl">📖</span>
            <span>LightNovel</span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm light novel, tác giả, thể loại..."
                className="w-full input input-bordered pl-10 pr-4"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 opacity-60" />
            </div>
          </form>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-circle hidden md:flex"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="btn btn-ghost btn-circle relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {items?.length || 0}
              </span>
            </Link>

            {/* User dropdown */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[60] w-52 p-2 shadow mt-2"
              >
                {user ? (
                  <>
                    <li><Link href="/profile">👤 Thông tin cá nhân</Link></li>
                    <li><Link href="/orders">📦 Đơn hàng của tôi</Link></li>
                    <li><Link href="/wishlist">❤️ Yêu thích</Link></li>
                    <li className="divider"></li>
                    <li>
                      <button
                        onClick={logout}
                        className="text-red-500"
                      >
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login">Đăng nhập</Link></li>
                    <li><Link href="/register">Đăng ký</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Mobile menu */}
            <button
              className="md:hidden btn btn-ghost btn-circle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t px-4 py-4 space-y-4">

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm light novel..."
              className="w-full input input-bordered pl-10"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 opacity-60" />
          </form>

          <div className="flex flex-col space-y-2">
            <Link href="/books" className="px-4 py-2 rounded hover:bg-base-200">
              📚 Tất cả sách
            </Link>
            <Link href="/profile" className="px-4 py-2 rounded hover:bg-base-200">
              👤 Tài khoản
            </Link>
            <Link href="/cart" className="px-4 py-2 rounded hover:bg-base-200">
              🛒 Giỏ hàng
            </Link>
          </div>

        </div>
      )}
    </nav>
  );
}