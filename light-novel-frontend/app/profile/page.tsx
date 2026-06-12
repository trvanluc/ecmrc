'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import toast from 'react-hot-toast';
import apiService from '@/services/api';

export default function ProfilePage() {
  const {
    user,
    logout,
    updateUser,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  // Load dữ liệu user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        avatar:
          formData.avatar?.trim() === ''
            ? undefined
            : formData.avatar,
      };

      const res =
        await apiService.users.updateProfile(
          payload
        );

      updateUser(res.data.data);

      toast.success(
        'Cập nhật thông tin cá nhân thành công!'
      );
    } catch (error: any) {
      toast.error(error || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      logout();
      toast.success("Đăng xuất thành công");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">Thông Tin Cá Nhân</h1>
          <p className="text-base-content/70 mt-2">Quản lý tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-sm p-8 text-center">
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-6">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="opacity-70">{user?.email}</p>

              <button 
                onClick={handleLogout}
                className="btn btn-outline btn-error w-full mt-10"
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Update Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-sm p-8">
              <h3 className="text-2xl font-semibold mb-8">Cập nhật thông tin</h3>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Họ và tên</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Số điện thoại</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123456789"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Địa chỉ giao hàng</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, phường, quận, thành phố..."
                    className="textarea textarea-bordered w-full h-24"
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Ảnh đại diện (URL)</span>
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    placeholder="https://example.com/your-avatar.jpg"
                    className="input input-bordered w-full"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-full btn-lg"
                  disabled={loading}
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}