'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Book {
  id: number;
  title: string;
  slug: string;
  price: number;
  stock: number;
  image?: string;
  author?: { name: string };
  category?: { name: string };
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form tạo sách mới
  const [newBook, setNewBook] = useState({
    title: '',
    slug: '',
    description: '',
    price: 0,
    stock: 50,
    image: '',
    authorId: 1,
    categoryId: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getBooks({ search });
      setBooks(res.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sách "${title}"?`)) return;

    try {
      await apiService.admin.deleteBook(id);
      toast.success("Xóa sách thành công");
      fetchBooks();
    } catch (error) {
      toast.error("Không thể xóa sách");
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.admin.createBook(newBook);
      toast.success("Tạo sách mới thành công!");
      setShowCreateModal(false);
      setNewBook({ title: '', slug: '', description: '', price: 0, stock: 50, image: '', authorId: 1, categoryId: 1 });
      fetchBooks();
    } catch (error) {
      toast.error("Tạo sách thất bại");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📚 Quản Lý Sách</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          + Thêm sách mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm sách theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* Books Table */}
      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  {book.image && (
                    <div className="w-12 h-16 relative rounded overflow-hidden">
                      <Image src={book.image} alt={book.title} fill className="object-cover" />
                    </div>
                  )}
                </td>
                <td className="font-medium">{book.title}</td>
                <td>{book.author?.name}</td>
                <td>{book.category?.name}</td>
                <td className="font-semibold">{book.price.toLocaleString('vi-VN')}đ</td>
                <td>
                  <span className={`badge ${book.stock > 10 ? 'badge-success' : 'badge-warning'}`}>
                    {book.stock}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm">Sửa</button>
                    <button 
                      onClick={() => handleDelete(book.id, book.title)}
                      className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Book Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card bg-base-100 w-full max-w-lg">
            <div className="card-body">
              <h3 className="text-2xl font-bold">Thêm Sách Mới</h3>
              
              <form onSubmit={handleCreateBook} className="space-y-4">
                <input
                  type="text"
                  placeholder="Tên sách"
                  value={newBook.title}
                  onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug (ví dụ: re-zero-kara-hajimeru)"
                  value={newBook.slug}
                  onChange={(e) => setNewBook({...newBook, slug: e.target.value})}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Giá (VND)"
                  value={newBook.price}
                  onChange={(e) => setNewBook({...newBook, price: Number(e.target.value)})}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Số lượng tồn kho"
                  value={newBook.stock}
                  onChange={(e) => setNewBook({...newBook, stock: Number(e.target.value)})}
                  className="input input-bordered w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Link ảnh bìa"
                  value={newBook.image}
                  onChange={(e) => setNewBook({...newBook, image: e.target.value})}
                  className="input input-bordered w-full"
                />

                <div className="flex gap-4">
                  <button type="submit" className="btn btn-primary flex-1">Tạo sách</button>
                  <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost flex-1">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}