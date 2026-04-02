const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ybxffgbcrkkdfngyczxd.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlieGZmZ2JjcmtrZGZuZ3ljenhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTU3NjksImV4cCI6MjA4OTU3MTc2OX0.0EekR9-83_eWMMtqlgORp3-rdpA_7VRAEjt4S2uLHcs'
);

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  const ALLOWED_DOMAIN = 'humanfunnel.es';
  if (!user.email || !user.email.endsWith('@' + ALLOWED_DOMAIN)) {
    return res.status(403).json({ error: 'Acceso restringido a @' + ALLOWED_DOMAIN });
  }

  req.user = user;
  next();
}

module.exports = { requireAuth };
