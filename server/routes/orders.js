const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const { authMiddleware } = require('../middleware/auth');
const database = require('../database');

const router = express.Router();
const db = database.getDb();

// Create payment intent
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Calculate total amount
    let totalAmount = 0;
    const validItems = [];
    
    for (const item of items) {
      const artwork = db.prepare('SELECT * FROM artworks WHERE id = ? AND is_for_sale = 1 AND is_sold = 0').get(item.artwork_id);
      if (!artwork) {
        return res.status(400).json({ message: `Artwork ${item.artwork_id} is not available for purchase` });
      }
      
      totalAmount += parseFloat(artwork.price) * (item.quantity || 1);
      validItems.push({
        artwork_id: artwork.id,
        price: artwork.price,
        quantity: item.quantity || 1
      });
    }

    // Create order record
    const orderResult = db.prepare(`
      INSERT INTO orders (user_id, total_amount, shipping_address, shipping_city, shipping_postal_code, shipping_country) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      totalAmount,
      shipping_address?.address || '',
      shipping_address?.city || '',
      shipping_address?.postal_code || '',
      shipping_address?.country || ''
    );

    const orderId = orderResult.lastInsertRowid;

    // Add order items
    const insertOrderItem = db.prepare('INSERT INTO order_items (order_id, artwork_id, price, quantity) VALUES (?, ?, ?, ?)');
    
    for (const item of validItems) {
      insertOrderItem.run(orderId, item.artwork_id, item.price, item.quantity);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        order_id: orderId.toString(),
        user_id: req.user.id.toString()
      }
    });

    // Update order with payment intent ID
    db.prepare('UPDATE orders SET stripe_payment_intent_id = ? WHERE id = ?').run(paymentIntent.id, orderId);

    res.json({
      client_secret: paymentIntent.client_secret,
      order_id: orderId
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm-payment', authMiddleware, async (req, res) => {
  try {
    const { payment_intent_id } = req.body;
    
    if (!payment_intent_id) {
      return res.status(400).json({ message: 'Payment intent ID is required' });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    if (paymentIntent.status === 'succeeded') {
      const orderId = paymentIntent.metadata.order_id;
      
      // Update order status
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run('completed', orderId);
      
      // Mark artworks as sold
      const orderItems = db.prepare('SELECT artwork_id FROM order_items WHERE order_id = ?').all(orderId);
      const updateArtwork = db.prepare('UPDATE artworks SET is_sold = 1 WHERE id = ?');
      
      for (const item of orderItems) {
        updateArtwork.run(item.artwork_id);
      }
      
      res.json({ message: 'Payment confirmed successfully', order_id: orderId });
    } else {
      res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// Get user orders
router.get('/my-orders', authMiddleware, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, 
             GROUP_CONCAT(a.title) as artwork_titles,
             GROUP_CONCAT(a.image_url) as artwork_images
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN artworks a ON oi.artwork_id = a.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all(req.user.id);
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;