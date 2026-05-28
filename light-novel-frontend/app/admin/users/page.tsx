'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Giả sử bạn có API admin/users
      const res = await apiService.admin.getUsers();
      let filteredUsers = res.data.data || [];

      if (search) {
        filteredUsers = filteredUsers.filter((user: User) => 
          user.name.toLowerCase().includes(search.toLowerCase()) || 
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    if (!confirm(`Chuyển vai trò của người dùng ID #${userId} thành ${newRole}?`)) return;

    try {
      await apiService.admin.updateUserRole(userId, newRole);
      toast.success("Cập nhật vai trò thành công");
      fetchUsers();
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">👤 Quản Lý Người Dùng</h1>
        
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-80"
        />
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
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="font-mono">#{user.id}</td>
                  <td className="font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'badge-error' : 'badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td>
                    <select 
                      className="select select-bordered select-sm"
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users.length === 0 && !loading && (
        <div className="text-center py-20 text-xl">Không tìm thấy người dùng nào</div>
      )}
    </div>
  );
}