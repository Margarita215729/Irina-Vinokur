const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
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

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get('/dashboard-stats', (req, res) => {
  try {
    const totalArtworks = db.prepare('SELECT COUNT(*) as count FROM artworks').get().count;
    const totalSales = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = "completed"').get().count;
    const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"').get().total || 0;
    const availableArtworks = db.prepare('SELECT COUNT(*) as count FROM artworks WHERE is_for_sale = 1 AND is_sold = 0').get().count;
    
    res.json({
      totalArtworks,
      totalSales,
      totalRevenue: parseFloat(totalRevenue),
      availableArtworks
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all artworks for admin
router.get('/artworks', (req, res) => {
  try {
    const artworks = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM artworks a 
      LEFT JOIN categories c ON a.category_id = c.id
      ORDER BY a.created_at DESC
    `).all();
    
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create artwork
router.post('/artworks', upload.single('image'), (req, res) => {
  try {
    const { title, description, price, category_id, dimensions, medium, year_created, is_for_sale } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = db.prepare(`
      INSERT INTO artworks (title, description, price, category_id, image_url, dimensions, medium, year_created, is_for_sale) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description || null,
      price ? parseFloat(price) : null,
      category_id || null,
      imageUrl,
      dimensions || null,
      medium || null,
      year_created ? parseInt(year_created) : null,
      is_for_sale === 'true' ? 1 : 0
    );

    const artwork = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM artworks a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(artwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update artwork
router.put('/artworks/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category_id, dimensions, medium, year_created, is_for_sale } = req.body;
    
    const existingArtwork = db.prepare('SELECT * FROM artworks WHERE id = ?').get(id);
    if (!existingArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : existingArtwork.image_url;
    
    db.prepare(`
      UPDATE artworks 
      SET title = ?, description = ?, price = ?, category_id = ?, image_url = ?, 
          dimensions = ?, medium = ?, year_created = ?, is_for_sale = ?
      WHERE id = ?
    `).run(
      title || existingArtwork.title,
      description !== undefined ? description : existingArtwork.description,
      price !== undefined ? parseFloat(price) : existingArtwork.price,
      category_id !== undefined ? category_id : existingArtwork.category_id,
      imageUrl,
      dimensions !== undefined ? dimensions : existingArtwork.dimensions,
      medium !== undefined ? medium : existingArtwork.medium,
      year_created !== undefined ? parseInt(year_created) : existingArtwork.year_created,
      is_for_sale !== undefined ? (is_for_sale === 'true' ? 1 : 0) : existingArtwork.is_for_sale,
      id
    );

    const artwork = db.prepare(`
      SELECT a.*, c.name as category_name 
      FROM artworks a 
      LEFT JOIN categories c ON a.category_id = c.id 
      WHERE a.id = ?
    `).get(id);
    
    res.json(artwork);
  } catch (error) {
    console.error('Error updating artwork:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete artwork
router.delete('/artworks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const result = db.prepare('DELETE FROM artworks WHERE id = ?').run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Artwork not found' });
    }
    
    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, u.name as user_name, u.email as user_email,
             GROUP_CONCAT(a.title) as artwork_titles
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN artworks a ON oi.artwork_id = a.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create category
router.post('/categories', (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description || null);
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(category);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;