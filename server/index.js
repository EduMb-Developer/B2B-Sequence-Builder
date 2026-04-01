require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:5173').trim().replace(/\/+$/, '');
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/generate', requireAuth, require('./routes/generate'));
app.use('/api/scrape', requireAuth, require('./routes/scrape'));
app.use('/api/export', requireAuth, require('./routes/export'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
