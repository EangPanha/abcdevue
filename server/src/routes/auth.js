const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const signToken = (user) => {
    const secret = process.env.JWT_SECRET || 'change_this_secret';
    return jwt.sign(
        { id: user.id, role: user.role },
        secret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

const publicUser = (row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    phone: row.phone,
    address: row.address,
    avatar: row.avatar,
    created_at: row.created_at,
    updated_at: row.updated_at
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
        cb(null, `avatar_${req.user.id}_${Date.now()}${safeExt}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image uploads are allowed.'));
        }
        return cb(null, true);
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, role, address } = req.body || {};

        if (!name || !password || (!email && !phone)) {
            return res.status(400).json({ message: 'Name, password, and email or phone are required.' });
        }

        if (email) {
            const emailResult = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
            if (emailResult.rows.length) {
                return res.status(409).json({ message: 'Email already in use.' });
            }
        }

        if (phone) {
            const phoneResult = await pool.query('SELECT id FROM users WHERE phone = $1 LIMIT 1', [phone]);
            if (phoneResult.rows.length) {
                return res.status(409).json({ message: 'Phone already in use.' });
            }
        }

        const hashed = await bcrypt.hash(password, 10);
        const userRole = role || 'customer';

        const insertResult = await pool.query(
            `INSERT INTO users (name, email, phone, password, role, address, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
             RETURNING id`,
            [name, email || null, phone || null, hashed, userRole, address || null]
        );

        const userId = insertResult.rows[0]?.id;
        const userResult = await pool.query(
            'SELECT id, name, email, role, phone, address, avatar, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
            [userId]
        );

        const user = publicUser(userResult.rows[0]);
        const token = signToken(user);
        return res.json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: 'Registration failed.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, phone, password } = req.body || {};

        if (!password || (!email && !phone)) {
            return res.status(400).json({ message: 'Email or phone and password are required.' });
        }

        const field = email ? 'email' : 'phone';
        const value = email || phone;
        const query = `SELECT id, name, email, role, phone, address, avatar, created_at, updated_at, password
                       FROM users WHERE ${field} = $1 LIMIT 1`;

        const result = await pool.query(query, [value]);
        if (!result.rows.length) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const userRow = result.rows[0];
        const isValid = await bcrypt.compare(password, userRow.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = publicUser(userRow);
        const token = signToken(user);
        return res.json({ user, token });
    } catch (error) {
        return res.status(500).json({ message: 'Login failed.' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, phone, address, avatar, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
            [req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json({ user: publicUser(result.rows[0]) });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load user.' });
    }
});

router.put('/me', authMiddleware, async (req, res) => {
    try {
        const { name, email, phone, address } = req.body || {};
        const currentResult = await pool.query(
            'SELECT id, name, email, phone, address FROM users WHERE id = $1 LIMIT 1',
            [req.user.id]
        );

        if (!currentResult.rows.length) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const current = currentResult.rows[0];
        const nextName = (name || '').trim() || current.name;
        if (!nextName) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        const nextEmail = email !== undefined ? (email || '').trim() || null : current.email;
        const nextPhone = phone !== undefined ? (phone || '').trim() || null : current.phone;
        const nextAddress = address !== undefined ? (address || '').trim() || null : current.address;

        if (nextEmail) {
            const emailResult = await pool.query(
                'SELECT id FROM users WHERE email = $1 AND id <> $2 LIMIT 1',
                [nextEmail, req.user.id]
            );
            if (emailResult.rows.length) {
                return res.status(409).json({ message: 'Email already in use.' });
            }
        }

        if (nextPhone) {
            const phoneResult = await pool.query(
                'SELECT id FROM users WHERE phone = $1 AND id <> $2 LIMIT 1',
                [nextPhone, req.user.id]
            );
            if (phoneResult.rows.length) {
                return res.status(409).json({ message: 'Phone already in use.' });
            }
        }

        const updateResult = await pool.query(
            `UPDATE users
             SET name = $1, email = $2, phone = $3, address = $4, updated_at = NOW()
             WHERE id = $5`,
            [nextName, nextEmail, nextPhone, nextAddress, req.user.id]
        );
        const changed =
            nextName !== current.name ||
            nextEmail !== current.email ||
            nextPhone !== current.phone ||
            nextAddress !== current.address;
        if (changed && updateResult.rowCount === 0) {
            return res.status(500).json({ message: 'Update failed. Please check database permissions or connection.' });
        }

        const result = await pool.query(
            'SELECT id, name, email, role, phone, address, avatar, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
            [req.user.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.json({ user: publicUser(result.rows[0]) });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update profile.' });
    }
});

router.post('/avatar', authMiddleware, (req, res) => {
    upload.single('avatar')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message || 'Upload failed.' });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded.' });
            }

            const avatarUrl = `/uploads/${req.file.filename}`;

            await pool.query(
                `UPDATE users
                 SET avatar = $1, updated_at = NOW()
                 WHERE id = $2`,
                [avatarUrl, req.user.id]
            );

            const result = await pool.query(
                'SELECT id, name, email, role, phone, address, avatar, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
                [req.user.id]
            );

            if (!result.rows.length) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.json({ user: publicUser(result.rows[0]) });
        } catch (error) {
            return res.status(500).json({ message: error.message || 'Failed to upload avatar.' });
        }
    });
});

module.exports = router;
