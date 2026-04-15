# Deployment Guide - Signature Connect Inventory System

## Overview

This guide provides step-by-step instructions for deploying the Signature Connect Inventory System to Vercel with Supabase backend integration.

## Prerequisites

- GitHub account with repository access
- Vercel account
- Supabase project (already created)
- Node.js 20.x installed locally

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd v0-inventory-tracking-app
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://enixlllzmsvwxtrbibgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
NEXT_PUBLIC_ENV=development
```

### 4. Initialize Supabase Schema

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to SQL Editor
4. Create new query and paste contents of `SUPABASE_SCHEMA.sql`
5. Execute the query

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git add .
git commit -m "feat: Implement Activity Feed System with Supabase integration"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Select GitHub repository
4. Click "Import"

### Step 3: Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL = https://enixlllzmsvwxtrbibgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
NEXT_PUBLIC_ENV = production
```

### Step 4: Fix Build Settings

If using `vercel.json`, Vercel will use those settings automatically.

Default settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install --legacy-peer-deps`

### Step 5: Deploy

1. Vercel will automatically detect `vercel.json`
2. Click "Deploy"
3. Wait for build to complete (3-5 minutes)

### Step 6: Verify Deployment

1. Visit your Vercel project URL
2. Test login functionality
3. Verify activity logging works
4. Check Supabase for new activity logs

## Troubleshooting Common Issues

### Issue: Build fails with dependency errors

**Solution:**
```bash
npm install --legacy-peer-deps
npm run build
```

### Issue: Environment variables not loading

**Solution:**
1. Verify variables are added in Vercel project settings
2. Wait 5 minutes for cache to clear
3. Trigger redeploy

### Issue: Supabase connection fails

**Check:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check that API key has column permissions
3. Verify RLS policies are not blocking access
4. Check browser console for CORS errors

### Issue: Activities not logging

**Check:**
1. User is authenticated and has `user.id` and `user.name`
2. Supabase connection is working
3. Activity logs table exists and is accessible
4. No RLS policy restrictions on inserts

### Issue: QR Scanner not working

**Solutions:**
- Allow camera permissions when prompted
- Ensure HTTPS is used (Vercel provides this automatically)
- Check browser console for errors
- Test with different QR codes

## Verification Checklist

- [ ] Application loads without errors
- [ ] Login/logout works
- [ ] Can navigate between pages
- [ ] Activity feed displays on product pages
- [ ] Activity feed displays on item pages
- [ ] QR scanner functions (if testing locally)
- [ ] New activities appear in real-time
- [ ] Supabase receives activity logs
- [ ] Admin user can view all activities
- [ ] Database indexes are created

## Production Deployment

### Security Best Practices

1. **Enable RLS Policies**: All tables have RLS policies enabled
2. **No Public Write Access**: Only authenticated users can write
3. **API Key Security**: Never expose private API keys
4. **Environment Variables**: Use Vercel's secure environment management

### Performance Optimization

1. **Database Indexes**: Activity logs queries use indexes
2. **Pagination**: Limit activity log results to 20 by default
3. **Caching**: Consider implementing Redis caching for frequently accessed data
4. **CDN**: Vercel provides automatic CDN caching

### Monitoring

1. **Vercel Analytics**: Monitor build times and page performance
2. **Supabase Logs**: Check for query errors and performance issues
3. **Application Logs**: Enable error tracking (Sentry, LogRocket, etc.)

## Rollback Procedure

If deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"
4. Or use Git to revert commits and redeploy

## Update Deployment

To deploy updates:

```bash
git add .
git commit -m "feat: Your changes here"
git push origin main
```

Vercel automatically redeploys when changes are pushed to the main branch.

## Accessing Live Application

- **Production URL**: Your Vercel project URL
- **Admin Panel**: Login with admin credentials
- **Supabase Dashboard**: Monitor database and logs
- **Vercel Dashboard**: Monitor deployment and performance

## Support

For issues:
1. Check Vercel logs: Vercel Dashboard → Deployments
2. Check Supabase logs: Supabase Dashboard → Logs
3. Check browser console: F12 → Console tab
4. Review error messages in application UI

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
