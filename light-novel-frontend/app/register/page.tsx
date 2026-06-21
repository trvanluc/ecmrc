'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      toast.success("Đăng ký thành công! Chào mừng bạn đến với LightNovel.");
      router.push('/');
    } catch (error: any) {
      toast.error(error || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center transition-colors duration-300">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content">
              📖 LightNovel
            </h1>
            <p className="text-base-content/70 mt-2">
              Tạo tài khoản mới
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="label">
                <span className="label-text text-base-content">Họ và tên</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ Và Tên"
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-base-content">Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
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
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-base-content">Xác nhận mật khẩu</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input input-bordered w-full text-base-content placeholder:text-base-content/60"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full btn-lg"
              disabled={loading}
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-base-content">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}