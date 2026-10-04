// Dine-O-Rama backend: Express + MongoDB. Public: view/search. Admin only: add/edit/delete.
require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId } = require('mongodb');

if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD_HASH) {
  console.error('Set SESSION_SECRET and ADMIN_PASSWORD_HASH in .env (see .env.example).');
  process.exit(1);
}

const app = express();
app.use(helmet());                          // secure HTTP headers (incl. Content-Security-Policy)
app.use(express.json({ limit: '10kb' }));   // JSON bodies only, small size
app.use(session({
  name: 'dor.sid',
  secret: process.env.SESSION_SECRET,
  resave: false, saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 }
}));

// Log every request, with timing and status code. Log page visits separately.
app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    if (req.path.startsWith('/api/')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
      return;
    }

    if (req.method === 'GET') {
      const pages = { '/': 'Home', '/index.html': 'Home', '/admin.html': 'Admin' };
      if (pages[req.path]) {
        console.log(`[${new Date().toISOString()}] Page visit: ${pages[req.path]} (${req.path}) -> ${res.statusCode}`);
      }
    }
  });
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

// Block cross-site form posts: every write request must be JSON
app.use('/api', (req, res, next) =>
  req.method === 'GET' || req.is('application/json') ? next() : res.status(415).json({ error: 'JSON only.' }));

// Only logged-in admins may pass
const requireAdmin = (req, res, next) =>
  req.session.admin ? next() : res.status(401).json({ error: 'Admin login required.' });

// Validate and clean form data (also forces every field to the expected type)
function clean(b = {}) {
  const s = (v, max) => String(v ?? '').trim().slice(0, max);
  const doc = { name: s(b.name, 80), cuisine: s(b.cuisine, 50), address: s(b.address, 120),
                rating: Number(b.rating), contact: s(b.contact, 20) };
  if (!doc.name) return { error: 'Name is required.' };
  if (!Number.isFinite(doc.rating) || doc.rating < 0 || doc.rating > 5) return { error: 'Rating must be 0 to 5.' };
  if (!/^[0-9+\-\s()]*$/.test(doc.contact)) return { error: 'Contact may only have digits, spaces, + - ( ).' };
  return { doc };
}
const validId = id => /^[0-9a-fA-F]{24}$/.test(id);

const client = new MongoClient(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017');
let restaurants;

// ---- Admin login ----
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { error: 'Too many attempts. Try again in 15 minutes.' } });
app.post('/api/login', loginLimiter, async (req, res) => {
  const ok = await bcrypt.compare(String(req.body.password ?? ''), process.env.ADMIN_PASSWORD_HASH);
  if (!ok) return res.status(401).json({ error: 'Wrong password.' });
  req.session.regenerate(() => { req.session.admin = true; res.json({ ok: true }); });
});
app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
app.get('/api/me', (req, res) => res.json({ admin: !!req.session.admin }));

// ---- READ (public): list/search by name, cuisine or address ----
app.get('/api/restaurants', async (req, res) => {
  try {
    const q = String(req.query.q ?? '').trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex
    const filter = q ? { $or: ['name', 'cuisine', 'address'].map(f => ({ [f]: { $regex: q, $options: 'i' } })) } : {};
    res.json(await restaurants.find(filter).sort({ restaurant_id: 1 }).toArray());
  } catch { res.status(500).json({ error: 'Server error.' }); }
});

// ---- CREATE (admin) ----
app.post('/api/restaurants', requireAdmin, async (req, res) => {
  try {
    const { doc, error } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const last = await restaurants.find().sort({ restaurant_id: -1 }).limit(1).toArray();
    doc.restaurant_id = last.length ? Number(last[0].restaurant_id) + 1 : 1;
    await restaurants.insertOne(doc);
    res.status(201).json({ ok: true });
  } catch { res.status(500).json({ error: 'Server error.' }); }
});

// ---- UPDATE (admin) ----
app.put('/api/restaurants/:id', requireAdmin, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Bad id.' });
    const { doc, error } = clean(req.body);
    if (error) return res.status(400).json({ error });
    const r = await restaurants.updateOne({ _id: new ObjectId(req.params.id) }, { $set: doc });
    r.matchedCount ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found.' });
  } catch { res.status(500).json({ error: 'Server error.' }); }
});

// ---- DELETE (admin) ----
app.delete('/api/restaurants/:id', requireAdmin, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ error: 'Bad id.' });
    const r = await restaurants.deleteOne({ _id: new ObjectId(req.params.id) });
    r.deletedCount ? res.json({ ok: true }) : res.status(404).json({ error: 'Not found.' });
  } catch { res.status(500).json({ error: 'Server error.' }); }
});

client.connect().then(() => {
  restaurants = client.db(process.env.DB_NAME || 'dbRestaurants').collection('restaurants');
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Dine-O-Rama running at http://localhost:${port}`));
}).catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
