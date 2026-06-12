const prisma = require('../config/database');

// ==================== CONTENT-BASED FILTERING ====================
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 8;

    // Lấy sách user đã tương tác
    const userBehaviors = await prisma.userBehavior.findMany({
      where: { userId },
      include: { book: { include: { tags: true, category: true } } }
    });

    if (userBehaviors.length === 0) {
      // User mới → trả sách nổi bật
      const popular = await prisma.book.findMany({
        include: { author: true, category: true },
        orderBy: { rating: 'desc' },
        take: limit
      });
      return res.json({ success: true, data: popular, message: "Sách nổi bật" });
    }

    const allBooks = await prisma.book.findMany({
      include: { tags: true, author: true, category: true }
    });

    const scoredBooks = allBooks.map(book => {
      let score = 0;

      userBehaviors.forEach(behavior => {
        const userBook = behavior.book;
        if (!userBook) return;

        // Điểm category
        if (userBook.categoryId === book.categoryId) score += 4;

        // Điểm tags
        const commonTags = book.tags.filter(tag => 
          userBook.tags.some(ubTag => ubTag.id === tag.id)
        ).length;
        score += commonTags * 2.5;
      });

      return { ...book, score };
    });

    scoredBooks.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      data: scoredBooks.slice(0, limit),
      type: "content-based"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BECAUSE YOU READ ====================
const getBecauseYouRead = async (req, res) => {
  try {
    const { bookId } = req.params;
    const limit = 6;

    const targetBook = await prisma.book.findUnique({
      where: { id: Number(bookId) },
      include: { tags: true, category: true }
    });

    if (!targetBook) return res.status(404).json({ success: false, message: "Book not found" });

    const similarBooks = await prisma.book.findMany({
      where: {
        id: { not: Number(bookId) },
        OR: [
          { categoryId: targetBook.categoryId },
          { tags: { some: { id: { in: targetBook.tags.map(t => t.id) } } } }
        ]
      },
      include: { author: true, category: true },
      take: limit
    });

    res.json({ success: true, data: similarBooks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPersonalizedRecommendations,
  getBecauseYouRead
};