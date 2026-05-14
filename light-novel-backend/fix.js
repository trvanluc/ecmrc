const prisma = require('./src/config/database');

async function fix() {
  const books = await prisma.book.findMany();

  for (const book of books) {
    if (book.image && !book.image.startsWith('/')) {
      await prisma.book.update({
        where: { id: book.id },
        data: {
          image: '/' + book.image
        }
      });

      console.log(`Fixed: ${book.title}`);
    }
  }

  console.log('Done');
  process.exit();
}

fix();