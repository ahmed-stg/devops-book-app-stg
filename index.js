import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
  next();
});

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: '1984', author: 'George Orwell' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

const getNextId = () => (books.length ? Math.max(...books.map(b => b.id)) + 1 : 1);

// Routes
const router = express.Router();

router.get('/books', (req, res) => {
  res.json(books);
});

router.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

router.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ error: 'Both title and author are required' });
  }
  const newBook = { id: getNextId(), title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;

  res.json(book);
});

router.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = books.findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(idx, 1);
  res.status(204).send();
});

app.use('/', router);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
}

export default app;
