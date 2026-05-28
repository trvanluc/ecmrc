'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Đăng nhập thành công!");
      router.push('/');
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content">📖 LightNovel</h1>
            <p className="text-base-content/70 mt-2">Đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-base-content">Mật khẩu</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-base-content">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}