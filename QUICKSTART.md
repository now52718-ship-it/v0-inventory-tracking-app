# Quick Start - Signature Connect v2.0.0

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Add to Supabase
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy contents of `SUPABASE_SCHEMA.sql`
5. Execute the query
6. Wait for success

### Step 3: Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🔑 Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://enixlllzmsvwxtrbibgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
```

---

## 📋 Testing Activity Feed

1. **Login** to the application
2. **Navigate** to a product
3. **Scroll down** - Activity feed appears at bottom
4. **View activities** - All your actions are logged
5. **Example format**: "• OJOE viewed XPON Router (2 mins ago)"

---

## 🎯 Key Features

### Activity Logging
- ✅ Automatic on every user action
- ✅ No manual entry needed
- ✅ Real-time updates
- ✅ Full audit trail

### QR Code System
- ✅ Generate QR codes for items
- ✅ Print batches
- ✅ Scan and track items
- ✅ Printable sheets

### Item Tracking
- ✅ Track by serial number
- ✅ Monitor status (IN_STORE, IN_FIELD, RETURNED, FAULTY)
- ✅ Record transactions
- ✅ View full history

---

## 💻 Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Install dependencies
npm install --legacy-peer-deps

# Clear npm cache (if install hangs)
npm cache clean --force
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `lib/supabaseClient.ts` | Supabase initialization |
| `lib/activityLogService.ts` | Activity logging functions |
| `lib/itemService.ts` | Item & transaction management |
| `lib/qrCodeService.ts` | QR code generation |
| `components/signature-connect/activity-feed.tsx` | Activity display |
| `components/signature-connect/qr-scanner.tsx` | QR scanning |
| `SUPABASE_SCHEMA.sql` | Database schema |
| `.env.local` | Environment configuration |

---

## 🐛 Quick Troubleshooting

**Problem**: npm install hangs  
**Fix**: `npm install --force` or `npm cache clean --force && npm install`

**Problem**: Activities not showing  
**Fix**: Check browser console (F12), verify Supabase connection

**Problem**: QR scanner not working  
**Fix**: Allow camera permissions, ensure HTTPS (local should work)

**Problem**: Build fails  
**Fix**: Delete `node_modules` and `.next`, then `npm install && npm run build`

---

## 📊 Usage Examples

### Log an Activity Manually
```typescript
import { logProductViewActivity } from '@/lib/activityLogService';

await logProductViewActivity(userId, userName, productId, productName);
```

### Get Product Activities
```typescript
import { getProductActivityLogs } from '@/lib/activityLogService';

const logs = await getProductActivityLogs(productId, limit: 20);
```

### Display Activity Feed
```typescript
import { ActivityFeed } from '@/components/signature-connect/activity-feed';

<ActivityFeed productId={productId} title="Product History" />
```

### Scan QR Code
```typescript
import { scanQRCode } from '@/lib/itemService';

const item = await scanQRCode(serialNumber, userId, userName);
```

---

## 🚀 Deployment to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to Vercel Dashboard
# https://vercel.com/dashboard

# 3. Import project from GitHub

# 4. Add environment variables:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
# NEXT_PUBLIC_SUPABASE_ANON_KEY

# 5. Deploy!
```

---

## 📚 Full Documentation

- **Setup Guide**: See `ACTIVITY_FEED_GUIDE.md`
- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md`
- **Implementation Details**: See `UPDATE_SUMMARY.md`

---

## ✅ Verification Checklist

After setup, verify:
- [ ] npm install completed successfully
- [ ] Development server starts without errors
- [ ] Can login to application
- [ ] Activity feed appears on product page
- [ ] New activities appear when navigating
- [ ] Supabase Dashboard shows activity logs
- [ ] QR scanner loads (if testing locally)

---

## 🎓 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Guide](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Documentation](https://react.dev)

---

**Status**: ✅ Ready to use  
**Version**: 2.0.0  
**Last Updated**: April 15, 2026
