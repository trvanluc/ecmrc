'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Book {
  id: number;
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  authorId: number;
  categoryId: number;
  author?: { name: string };
  category?: { name: string };
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
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

  const openCreateModal = () => {
    setFormData({
      title: '', slug: '', description: '', price: 0, stock: 50, image: '', authorId: 1, categoryId: 1
    });
    setIsEditing(false);
    setCurrentBookId(null);
    setShowModal(true);
  };

  const openEditModal = (book: Book) => {
    setFormData({
      title: book.title,
      slug: book.slug,
      description: book.description || '',
      price: book.price,
      stock: book.stock,
      image: book.image || '',
      authorId: book.authorId,
      categoryId: book.categoryId,
    });
    setIsEditing(true);
    setCurrentBookId(book.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentBookId) {
        // Sửa sách
        await apiService.admin.updateBook(currentBookId, formData);
        toast.success("Cập nhật sách thành công!");
      } else {
        // Thêm sách mới
        await apiService.admin.createBook(formData);
        toast.success("Thêm sách mới thành công!");
      }
      
      setShowModal(false);
      fetchBooks();
    } catch (error) {
      toast.error("Thao tác thất bại");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Xóa sách "${title}"?`)) return;
    try {
      await apiService.admin.deleteBook(id);
      toast.success("Xóa sách thành công");
      fetchBooks();
    } catch (error) {
      toast.error("Không thể xóa sách");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📚 Quản Lý Sách</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          + Thêm sách mới
        </button>
      </div>

      <input
        type="text"
        placeholder="Tìm kiếm sách..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input input-bordered w-full max-w-md mb-6"
      />

      {/* Bảng sách */}
      <div className="card bg-base-100 shadow-sm overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Hình</th>
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
                    <button 
                      onClick={() => openEditModal(book)}
                      className="btn btn-ghost btn-sm text-blue-600"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(book.id, book.title)}
                      className="btn btn-ghost btn-sm text-red-500"
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

      {/* Modal Thêm / Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card bg-base-100 w-full max-w-lg">
            <div className="card-body">
              <h3 className="text-2xl font-bold mb-6">
                {isEditing ? "Sửa thông tin sách" : "Thêm sách mới"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Tên sách" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="input input-bordered w-full" required />
                <input type="text" placeholder="Slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="input input-bordered w-full" required />
                <textarea placeholder="Mô tả" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="textarea textarea-bordered w-full" />
                
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Giá" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="input input-bordered" required />
                  <input type="number" placeholder="Tồn kho" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} className="input input-bordered" required />
                </div>

                <input type="text" placeholder="Link ảnh bìa" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="input input-bordered w-full" />

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-primary flex-1">
                    {isEditing ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Hủy</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}