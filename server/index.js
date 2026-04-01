require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.replace(/\/+$/, '')
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/generate', require('./routes/generate'));
app.use('/api/scrape', require('./routes/scrape'));
app.use('/api/export', require('./routes/export'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
