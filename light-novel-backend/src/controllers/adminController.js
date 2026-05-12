const prisma = require('../config/database');

// ====================== BOOK MANAGEMENT ======================
const getAllBooksAdmin = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const skip = (page - 1) * limit;

  const books = await prisma.book.findMany({
    where: search ? { title: { contains: search, mode: 'insensitive' } } : {},
    include: { author: true, category: true, publisher: true },
    skip: Number(skip),
    take: Number(limit),
    orderBy: { createdAt: 'desc' }
  });

  const total = await prisma.book.count();
  res.json({ success: true, data: books, pagination: { total, page: Number(page), limit: Number(limit) } });
};

const createBookAdmin = async (req, res) => {
  const { title, slug, description, price, image, stock, authorId, categoryId, publisherId, pageCount } = req.body;
  
  const book = await prisma.book.create({
    data: { title, slug, description, price, image, stock, authorId, categoryId, publisherId, pageCount },
    include: { author: true, category: true }
  });
  res.status(201).json({ success: true, message: "Tạo sách thành công", data: book });
};

const updateBookAdmin = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const book = await prisma.book.update({
    where: { id: Number(id) },
    data,
    include: { author: true, category: true }
  });
  res.json({ success: true, message: "Cập nhật sách thành công", data: book });
};

const deleteBookAdmin = async (req, res) => {
  const { id } = req.params;
  await prisma.book.delete({ where: { id: Number(id) } });
  res.json({ success: true, message: "Xóa sách thành công" });
};

// ====================== ORDER MANAGEMENT ======================
const getAllOrdersAdmin = async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { book: { select: { title: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: orders });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: { status }
  });
  res.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công", data: order });
};

// ====================== USER MANAGEMENT ======================
const getAllUsersAdmin = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ success: true, data: users });
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { role }
  });
  res.json({ success: true, message: "Cập nhật vai trò thành công", data: user });
};

module.exports = {
  // Books
  getAllBooksAdmin,
  createBookAdmin,
  updateBookAdmin,
  deleteBookAdmin,
  // Orders
  getAllOrdersAdmin,
  updateOrderStatus,
  // Users
  getAllUsersAdmin,
  updateUserRole,
  // (Các hàm Category, Author, Tag, Publisher từ trước vẫn giữ nguyên)
};