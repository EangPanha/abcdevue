require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const pool = require('./db');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '';
const allowedOrigins = corsOrigin
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
const allowAll = allowedOrigins.length === 0 || allowedOrigins.includes('*');

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowAll) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
    res.send('API server is running. Try /api/health.');
});

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT current_database() AS db');
        res.json({ ok: true, db: result.rows[0]?.db || null });
    } catch (error) {
        res.status(500).json({ ok: false, message: 'Database connection failed.' });
    }
});

app.use('/api/auth', authRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
});
