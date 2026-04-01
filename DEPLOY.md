# Deployment — Sequence Builder

## Local Development

```bash
# Terminal 1 — Backend
cd server
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Frontend runs on http://localhost:5173, backend on http://localhost:3001.
Vite proxies `/api` requests to the backend automatically.

---

## Production Deployment

### Backend → Railway or Render

1. Create a new project, connect the repo or push `server/` as root directory.
2. Set environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `FRONTEND_URL` = your Vercel frontend URL (e.g. `https://sequence-builder.vercel.app`)
   - `PORT` = Railway/Render will assign this automatically
3. Start command: `npm start`
4. Note the deployed URL (e.g. `https://sequence-builder-api.up.railway.app`)

### Frontend → Vercel

1. Create a new Vercel project, set `client/` as root directory.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set environment variable (if needed via vite.config.js or .env):
   - `VITE_API_URL` = your Railway/Render backend URL

### Connecting Frontend to Backend

Update `client/vite.config.js` for production by replacing the proxy with the real API URL.

Create `client/.env.production`:
```
VITE_API_URL=https://your-backend-url.up.railway.app
```

Then update fetch calls in `App.jsx` to use:
```js
const API = import.meta.env.VITE_API_URL || '';
// fetch(`${API}/api/generate`, ...)
```

### CORS Configuration

The Express server already reads `FRONTEND_URL` from env and configures CORS:

```js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['POST'],
}));
```

Set `FRONTEND_URL` on Railway/Render to your Vercel domain:
```
FRONTEND_URL=https://sequence-builder.vercel.app
```

If you need multiple origins (e.g. preview deployments):
```js
origin: [process.env.FRONTEND_URL, /\.vercel\.app$/],
```
