# Irina Vinokur Artist Portfolio

A modern artist portfolio and e-commerce web application deployed on Vercel. Built with React and serverless functions, featuring a Claude Monet-inspired design.

🔥 **Status**: SPA routing fixed - ready for production!

## ✨ Features

- 🎨 **Artist Portfolio**: Beautiful responsive gallery with category filtering
- 🛒 **E-commerce**: Full shopping cart and payment processing with Stripe
- 👑 **Admin Dashboard**: Complete CRUD functionality for artworks and orders
- 🌊 **Claude Monet Color Scheme**: Blues, greens, and creams inspired by impressionist art
- 📱 **Responsive Design**: Mobile-friendly interface with smooth animations
- 🔐 **Authentication**: Secure user registration, login, and protected routes
- 💳 **Payment Processing**: Integrated Stripe payment system
- 📦 **Order Management**: Complete order tracking and shipping information

## 🚀 Tech Stack

### Frontend

- React 18 with Vite
- React Router for navigation
- Stripe React SDK for payments
- Lucide React for icons
- Modern CSS with custom properties

### Backend

- Vercel Serverless Functions
- Express.js API
- SQLite database
- JWT authentication
- Stripe API integration

## 🌐 Live Demo

The application is deployed and running on Vercel:

- **Production URL**: [Visit Portfolio](https://irina-vinokur-n75khye55-makeeva01m-gmailcoms-projects.vercel.app)

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- npm

### Local Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd Irina-Vinokur
   npm run install:all
   ```

2. **Environment Setup**
   - Copy `client/.env.example` to `client/.env.local`
   - Set `VITE_API_URL=http://localhost:3000/api` for local development

3. **Development**

   ```bash
   npm run client:dev  # Start client development server
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── index.js           # Main API handler
│   ├── database.js        # Database management
│   ├── routes/            # API routes
│   └── middleware/        # Authentication middleware
├── client/                # React application
│   ├── src/               # Source code
│   ├── dist/              # Built files
│   └── .env.production    # Production environment variables
├── vercel.json            # Vercel deployment configuration
└── package.json           # Root package configuration
```

## 🎨 Color Palette

Inspired by Claude Monet's impressionist paintings:

- **Primary Blue**: #4A90A4 (Water reflections)
- **Soft Green**: #7FB069 (Nature elements)
- **Warm Cream**: #FAF3E0 (Light and warmth)
- **Accent Blue**: #6CB4EE (Sky tones)

## 📦 Production Notes

- **Database**: Uses SQLite in serverless environment (data resets on deployment)
- **File Storage**: Local storage (consider cloud storage for production)
- **Environment Variables**: Configured in Vercel dashboard
- **Auto-deployment**: Connected to GitHub for automatic deployments

## 🔒 Admin Access

Default admin credentials:

- Email: `admin@portfolio.com`
- Password: `admin123`

## 📄 License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ for showcasing artistic creativity*
