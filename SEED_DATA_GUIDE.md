# Setup Instructions - Seed Sample Data

After running `npm run dev`, follow these steps to populate your Supabase database with sample data:

## Step 1: Open Browser Console

1. Go to `http://localhost:3000`
2. Login with any credentials (the mock login will work)
3. Press **F12** to open Developer Tools
4. Click **Console** tab

## Step 2: Seed Data

Paste this command in the console and press Enter:

```javascript
import { seedSampleData } from '/lib/seedData.ts'
seedSampleData()
```

If that doesn't work (ES module issue), open the file in the browser:

Visit: `http://localhost:3000/seed-data`

Or use this simpler method in console:

```javascript
fetch('/api/seed', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

## Step 3: Create API Route for Seeding

If the above doesn't work, create this file:

**`app/api/seed/route.ts`:**

```typescript
import { seedSampleData } from '@/lib/seedData'
import { NextResponse } from 'next/server'

export async function POST() {
  const success = await seedSampleData()
  return NextResponse.json({ success })
}
```

Then go to: `http://localhost:3000/api/seed` and see if sample data was created.

## What Gets Created

- 7 sample products (routers, ONUs, connectors)
- 5 sample items with serial numbers and statuses
- 4 sample activity logs showing user actions

## Verify Data in Supabase

1. Go to Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** → **New Query**
4. Run these queries to verify:

```sql
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM items;
SELECT COUNT(*) FROM activity_logs;
```

Should return: 7, 5, 4 respectively.

## Next Steps After Seeding

1. **Refresh the page** - Activity feed might start showing real logs
2. **Navigate to Products** - Should show sample inventory
3. **Test Scanning** - Try scanning to create transaction logs
4. **Create Items** - Add more items to the inventory

## If Still Seeing Only Mock Data

The mock data is **intentional** - it provides a fallback UI. To see REAL data:

1. Verify seed data reached Supabase (check above queries)
2. Restart dev server: `npm run dev`
3. Hard refresh browser: **Ctrl+Shift+R** (or **Cmd+Shift+R** on Mac)
4. The pages will gradually integrate real data queries

## Troubleshooting

**Error: "seedSampleData is not defined"**
- Make sure you're in the browser console (F12)
- Try the API route method instead

**No data appears in Supabase**
- Check if RLS policies are blocking inserts
- Go to Supabase → Tables → activity_logs → RLS
- Make sure "System can insert" policy is enabled

**Still showing mock data**
- This is expected during transition
- The mock data ensures the UI doesn't break
- Real data will be integrated in the next phase
