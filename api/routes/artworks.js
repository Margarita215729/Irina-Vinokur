const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const database = require('../database');

const router = express.Router();
const db = database.getDb();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all artworks (public)
router.get('/', (req, res) => {
  try {
    const { category, for_sale } = req.query;
    let query = `
      SELECT a.*, c.name as category_name 
      FROM artworks a 
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND c.name = ?';
      params.push(category);
    }

    if (for_sale === 'true') {
      query += ' AND a.is_for_sale = 1 AND a.is_sold = 0';
    }

    query += ' ORDER BY a.created_at DESC';

    const artworks = db.prepare(query).all(...params);
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories (public) - must come before /:id route
router.get('/categories/list', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single artwork (public)
router.get('/:id', (req, res) => {
  try {
    const artwork = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM artworks a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.id = ?
    `).get(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    
    res.json(artwork);
  } catch (error) {
    console.error('Error fetching artwork:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;