const prisma = require('../config/database');

// Content-based Filtering bằng Cosine Similarity
const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 8;

    // Lấy các sách user đã tương tác
    const userBehaviors = await prisma.userBehavior.findMany({
      where: { userId },
      include: { book: true }
    });

    if (userBehaviors.length === 0) {
      // Nếu user mới → trả về sách phổ biến
      const popularBooks = await prisma.book.findMany({
        include: { author: true, category: true },
        orderBy: { rating: 'desc' },
        take: limit
      });
      return res.json({ success: true, data: popularBooks, type: 'popular' });
    }

    // Lấy tất cả sách để so sánh
    const allBooks = await prisma.book.findMany({
      include: { tags: true, author: true, category: true }
    });

    const recommendations = [];

    for (const book of allBooks) {
      let score = 0;
      let matchCount = 0;

      for (const behavior of userBehaviors) {
        const userBook = behavior.book;

        // So sánh category
        if (userBook.categoryId === book.categoryId) score += 3;

        // So sánh tags
        const commonTags = book.tags.filter(tag => 
          userBook.tags.some(ubTag => ubTag.id === tag.id)
        ).length;

        score += commonTags * 2;
        if (commonTags > 0) matchCount++;
      }

      if (score > 0) {
        recommendations.push({
          ...book,
          similarityScore: score
        });
      }
    }

    // Sort theo điểm tương đồng và trả về
    recommendations.sort((a, b) => b.similarityScore - a.similarityScore);

    res.json({
      success: true,
      data: recommendations.slice(0, limit),
      type: 'content-based'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      include: { author: true, category: true, tags: true },
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