# Deployment Guide for Vercel

## Prerequisites

1. Make sure all dependencies are installed:

```bash
npm run install:all
```

2. Test the build locally:

```bash
npm run build
```

## Vercel Deployment Steps

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

From the project root directory:

```bash
vercel
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N** (for first deployment)
- What's your project's name? **irina-vinokur** (or your preferred name)
- In which directory is your code located? **./** (current directory)

### 4. Set Environment Variables

After deployment, you need to set environment variables in Vercel dashboard:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

**For Production:**

- `NODE_ENV` = `production`
- `JWT_SECRET` = `your-secure-jwt-secret-here`
- `CLIENT_URL` = `https://your-app-name.vercel.app`

**For Stripe (if using payments):**

- `STRIPE_SECRET_KEY` = `your-stripe-secret-key`
- `STRIPE_PUBLISHABLE_KEY` = `your-stripe-publishable-key`

### 5. Configure Client Environment

In your client directory, you may need to create a `.env.production` file:

```bash
VITE_API_URL=https://your-app-name.vercel.app/api
```

### 6. Redeploy

After setting environment variables:

```bash
vercel --prod
```

## Important Notes

### Database Considerations

This project currently uses SQLite which works for deployment but has limitations:

- Data is not persistent across deployments
- Not suitable for production with multiple users

**Recommended for production:**

- Use a cloud database like:
  - **Vercel Postgres** (recommended for Vercel)
  - **PlanetScale** (MySQL)
  - **MongoDB Atlas**
  - **Supabase** (PostgreSQL)

### File Uploads

Current file upload system stores files locally, which won't persist on Vercel.

**Recommended for production:**

- Use cloud storage like:
  - **Vercel Blob Storage**
  - **AWS S3**
  - **Cloudinary**

## Troubleshooting

### Build Errors

1. Make sure all dependencies are installed in all directories
2. Check that the build works locally first
3. Verify all environment variables are set correctly

### API Errors

1. Check environment variables in Vercel dashboard
2. Verify API routes are working with `/api/health` endpoint
3. Check function logs in Vercel dashboard

### CORS Issues

Make sure `CLIENT_URL` environment variable is set to your Vercel app URL.

## Development vs Production

**Development:**

```bash
npm run dev  # Runs both client and server locally
```

**Production Build Test:**

```bash
npm run build  # Builds client for production
```

## Manual Deployment Alternative

If automatic deployment fails, you can:

1. Build the project locally:

```bash
npm run build
```

2. Deploy only the built files:

```bash
vercel --prod
```
