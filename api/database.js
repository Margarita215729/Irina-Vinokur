const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
    constructor() {
        // В serverless среде используем временную директорию
        const dbPath = process.env.NODE_ENV === 'production'
            ? '/tmp/portfolio.db'
            : path.join(__dirname, '../server/portfolio.db');

        // Создаем директорию если её нет
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new Database(dbPath);
        this.initializeTables();
    }

    initializeTables() {
        // Users table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Categories table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Artworks table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS artworks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        category_id INTEGER,
        image_url TEXT,
        dimensions TEXT,
        medium TEXT,
        year_created INTEGER,
        is_for_sale BOOLEAN DEFAULT 1,
        is_sold BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id)
      )
    `);

        // Orders table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        stripe_payment_intent_id TEXT,
        shipping_address TEXT,
        shipping_city TEXT,
        shipping_postal_code TEXT,
        shipping_country TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

        // Order items table
        this.db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        artwork_id INTEGER,
        price DECIMAL(10,2) NOT NULL,
        quantity INTEGER DEFAULT 1,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (artwork_id) REFERENCES artworks (id)
      )
    `);

        // Insert default admin user and categories
        this.seedDatabase();
    }

    seedDatabase() {
        const bcrypt = require('bcryptjs');

        // Check if admin user exists
        const adminExists = this.db.prepare('SELECT id FROM users WHERE email = ?').get('admin@portfolio.com');

        if (!adminExists) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            this.db.prepare(`
        INSERT INTO users (email, password, name, role) 
        VALUES (?, ?, ?, ?)
      `).run('admin@portfolio.com', hashedPassword, 'Admin User', 'admin');
        }

        // Insert default categories
        const categories = ['Paintings', 'Drawings', 'Sculptures', 'Mixed Media'];

        categories.forEach(category => {
            const exists = this.db.prepare('SELECT id FROM categories WHERE name = ?').get(category);
            if (!exists) {
                this.db.prepare('INSERT INTO categories (name) VALUES (?)').run(category);
            }
        });
    }

    getDb() {
        return this.db;
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// Создаем глобальный экземпляр для переиспользования в serverless
let dbInstance = null;

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new DatabaseManager();
    }
    return dbInstance;
}

module.exports = getDatabase();
