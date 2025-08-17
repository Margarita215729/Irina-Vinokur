# 🎨 Irina Vinokur Portfolio - Deployment Guide

## 📋 Deployment Checklist

### ✅ Project Status

- [x] Dependencies updated and installed
- [x] Build scripts configured
- [x] Vercel configuration updated
- [x] API endpoints optimized
- [x] Client routing fixed

### 🚀 Vercel Deployment Steps

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "feat: fixed deployment configuration"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Set environment variables in Vercel Dashboard:
     - `JWT_SECRET=your_jwt_secret_here`
     - `STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here`
     - `NODE_ENV=production`

3. **Configure Environment Variables**

   ```bash
   # In Vercel Dashboard, add these environment variables:
   JWT_SECRET=your_super_secret_jwt_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   NODE_ENV=production
   ```

4. **Update Client Environment Variables**
   After Vercel deployment, update:

   ```bash
   VITE_API_URL=https://your-vercel-domain.vercel.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

### 🔧 Key Fixes Applied

1. **Vercel Configuration** (`vercel.json`)
   - Fixed routing for SPA (Single Page Application)
   - Added proper asset serving
   - Configured Node.js runtime

2. **Build Scripts** (`package.json`)
   - Updated build command for Vercel compatibility
   - Added `vercel-build` script for client

3. **API Configuration**
   - Enhanced CORS settings
   - Improved error handling
   - Better logging for debugging

4. **Client Configuration**
   - Updated Vite configuration
   - Fixed routing for production

### 🧪 Testing

```bash
# Local testing
npm install        # Install all dependencies
npm run build     # Build client
cd api && node index.js  # Test API
```

### 🎯 Expected Results

After deployment:

- ✅ Landing page loads correctly
- ✅ Portfolio page displays artworks
- ✅ Authentication works
- ✅ Admin dashboard accessible
- ✅ API endpoints respond correctly
- ✅ Static assets load properly

### 🔍 Troubleshooting

If you still get 404 errors:

1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure API routes match the configuration
4. Check network tab for failed requests

### 📱 URLs after deployment

- Main site: `https://your-project-name.vercel.app`
- API health: `https://your-project-name.vercel.app/api/health`
- Portfolio: `https://your-project-name.vercel.app/portfolio`
- Admin: `https://your-project-name.vercel.app/admin`
