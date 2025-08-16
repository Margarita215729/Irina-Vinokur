# Irina Vinokur Artist Portfolio

A minimalistic but effective web application for an artist portfolio with e-commerce functionality. Built with React, Node.js, and SQLite, featuring a Claude Monet-inspired color scheme.

## Features

- 🎨 **Artist Portfolio**: Beautiful gallery with filtering by categories
- 🛒 **E-commerce**: Full shopping cart and payment processing with Stripe
- 👑 **Admin Dashboard**: Complete CRUD functionality for artworks and orders
- 🌊 **Claude Monet Color Scheme**: Blues, greens, creams inspired by impressionist art
- 📱 **Responsive Design**: Mobile-friendly interface with animations
- 🔐 **Authentication**: User registration, login, and protected routes
- 💳 **Payment Processing**: Integrated Stripe payment system
- 📦 **Order Management**: Complete order tracking and shipping information

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Stripe React SDK for payments
- Lucide React for icons
- CSS with custom properties and animations

### Backend
- Node.js with Express
- SQLite with better-sqlite3
- JWT authentication
- Stripe API integration
- Multer for file uploads
- bcryptjs for password hashing

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Irina-Vinokur
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   For the server, copy `.env.example` to `.env` in the `server` directory:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   For the client, copy `.env.example` to `.env` in the `client` directory:
   ```bash
   cd client
   cp .env.example .env
   ```
   
   **Important**: Replace the dummy Stripe keys with real ones from your Stripe dashboard.

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 5173).

## Usage

### Default Admin Account
- **Email**: admin@portfolio.com
- **Password**: admin123

### For Development with Stripe
Use the test card number: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC code

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── uploads/            # File uploads directory
│   └── database.js         # Database setup and seeding
└── shared/                 # Shared utilities (if needed)
```

## API Endpoints

### Public Endpoints
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get single artwork
- `GET /api/artworks/categories/list` - Get categories
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints (Authenticated Users)
- `POST /api/orders/create-payment-intent` - Create payment
- `POST /api/orders/confirm-payment` - Confirm payment
- `GET /api/orders/my-orders` - Get user orders

### Admin Endpoints (Admin Only)
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/artworks` - Manage artworks
- `POST /api/admin/artworks` - Create artwork
- `PUT /api/admin/artworks/:id` - Update artwork
- `DELETE /api/admin/artworks/:id` - Delete artwork
- `GET /api/admin/orders` - View all orders
- `GET /api/admin/categories` - Manage categories

## Color Palette (Claude Monet Inspired)

- **Primary Blue**: #4A90E2 (Water reflections)
- **Light Blue**: #7BB3F0 (Sky tones)
- **Pale Blue**: #B8D8F5 (Misty mornings)
- **Primary Green**: #6B8E23 (Garden foliage)
- **Light Green**: #9ACD32 (Spring leaves)
- **Pale Green**: #C5E384 (Soft vegetation)
- **Cream**: #F5F5DC (Canvas base)
- **Pale Yellow**: #FFFACD (Sunlight)
- **Peach**: #FFE4B5 (Warm highlights)
- **Lavender**: #DDA0DD (Evening shadows)
- **Golden**: #F0E68C (Golden hour)

## Features in Detail

### 🎨 Portfolio Gallery
- Filterable by categories (Paintings, Drawings, Sculptures, Mixed Media)
- Filter by availability (All works vs. For Sale only)
- Responsive grid layout with hover animations
- High-quality image display with placeholders

### 🛒 E-commerce System
- Shopping cart functionality
- Secure payment processing with Stripe
- Order confirmation and tracking
- Shipping information collection

### 👑 Admin Dashboard
- Real-time statistics (total artworks, sales, revenue)
- CRUD operations for artworks
- Image upload functionality
- Order management and tracking
- Category management

### 🎨 Design Features
- Claude Monet inspired color palette
- Smooth animations and transitions
- Floating elements and hover effects
- Responsive design for all devices
- Accessibility considerations

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the client for production
- `npm run start` - Start the production server
- `npm run client:dev` - Start only the client development server
- `npm run server:dev` - Start only the server development server

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Support

For questions or support, please contact the development team or create an issue in the repository.