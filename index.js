import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

let books = [
  { id: 1, title: 'klimbou', author: 'F. Scott Fkkkkkkitzgerald' },
  { id: 2, title: '1984', author: 'George Orwell' }
  ,{ id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

// Escape HTML helper function
const escapeHtml = (str) => String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));

// Define routes (same as before)
app.get('/books', (req, res) => {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Book List</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    body{font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;background:#f6f8fa;color:#0b1220;padding:24px}
    .container{max-width:900px;margin:0 auto}
    h1{margin:0 0 16px;font-size:28px}
    .books{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
    .book{background:#fff;border:1px solid #e1e4e8;padding:12px;border-radius:8px;box-shadow:0 1px 2px rgba(11,18,32,0.04)}
    .title{font-weight:600;margin-bottom:6px}
    .meta{color:#586069;font-size:13px}
    .id{float:right;color:#94a3b8;font-size:12px}
  </style>
</head>
<body>
  <div class="container">
    <h1>Books</h1>
    <ul class="books">
      ${books.map(b => `<li class="book"><div class="title">${escapeHtml(b.title)}<span class="id">#${b.id}</span></div><div class="meta">Author: ${escapeHtml(b.author)}</div></li>`).join('')}
    </ul>
  </div>
</body>
</html>`;
  res.send(html);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

app.post('/books', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).send('Book not found');
  book.title = req.body.title || book.title;
  book.author = req.body.author || book.author;
  res.json(book);
});

app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).send('Book not found');
  books.splice(bookIndex, 1);
  res.status(204).send();
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

export default app;