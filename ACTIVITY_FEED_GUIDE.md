# Activity Feed Implementation Guide

## Overview

The Activity Feed System provides complete activity tracking for the Signature Connect Inventory System. Every user action is automatically logged and displayed as a readable timeline on product and item detail pages.

## Features

### Automatic Activity Logging
- **LOGIN**: User logs into the system
- **LOGOUT**: User logs out
- **VIEW_PRODUCT**: User views a product
- **VIEW_ITEM**: User views an item by serial number
- **SCAN_QR**: User scans a QR code
- **ADD_STOCK**: New stock is added (via database trigger)
- **ISSUE_ITEM**: Item is issued to a customer (via database trigger)
- **RETURN_ITEM**: Item is returned from field (via database trigger)
- **MARK_FAULTY**: Item is marked as faulty (via database trigger)

### Display Features
- Timeline-style activity display
- Human-readable activity messages
- Time-ago formatting (e.g., "2 mins ago")
- Separate feeds for products and items
- Optimized with indexed database queries

## File Structure

```
lib/
├── supabaseClient.ts          # Supabase client initialization
├── activityLogService.ts      # Activity logging functions
├── itemService.ts             # Item tracking and operations
└── qrCodeService.ts            # QR code generation

components/signature-connect/
├── activity-feed.tsx           # Activity display component
└── qr-scanner.tsx             # QR scanner component
```

## Usage

### Logging Activities

The activity logging is automatic for most actions through database triggers and context integration.

#### Manual Activity Logging

```typescript
import {
  logLoginActivity,
  logProductViewActivity,
  logItemViewActivity,
  logScanQRActivity,
} from '@/lib/activityLogService';

// Log product view
await logProductViewActivity(userId, userName, productId, productName);

// Log item view
await logItemViewActivity(userId, userName, serialNumber);

// Log QR scan
await logScanQRActivity(userId, userName, serialNumber);
```

### Retrieving Activity Logs

```typescript
import {
  getAllActivityLogs,
  getProductActivityLogs,
  getItemActivityLogs,
  getUserActivityLogs,
  getActivityStats,
} from '@/lib/activityLogService';

// Get activities for a product
const logs = await getProductActivityLogs(productId, limit);

// Get activities for an item
const itemLogs = await getItemActivityLogs(serialNumber, limit);

// Get user activities
const userLogs = await getUserActivityLogs(userId, limit);

// Get statistics
const stats = await getActivityStats();
```

### Displaying Activity Feed

```typescript
import { ActivityFeed } from '@/components/signature-connect/activity-feed';

// Show product activities
<ActivityFeed productId={productId} title="Product Activity" />

// Show item activities
<ActivityFeed serialNumber={serialNumber} title="Item History" />
```

## Database Schema

### activity_logs Table

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  action TEXT CHECK (action IN (
    'LOGIN', 'LOGOUT', 'VIEW_PRODUCT', 'VIEW_ITEM', 'SCAN_QR',
    'ADD_STOCK', 'ISSUE_ITEM', 'RETURN_ITEM', 'MARK_FAULTY'
  )),
  product_id UUID REFERENCES products(id),
  serial_number TEXT REFERENCES items(serial_number),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Triggers

1. **on_auth_user_created**: Creates user profile when auth user is created
2. **trigger_log_activity_on_transaction**: Logs all transaction actions as activities

## API Reference

### Activity Service Functions

#### `logLoginActivity(userId, userName)`
Logs a user login event.

**Parameters:**
- `userId` (string): User ID
- `userName` (string): User display name

#### `logProductViewActivity(userId, userName, productId, productName)`
Logs when a user views a product.

**Parameters:**
- `userId` (string): User ID
- `userName` (string): User name
- `productId` (string): Product UUID
- `productName` (string): Product name

#### `logItemViewActivity(userId, userName, serialNumber)`
Logs when a user views an item.

**Parameters:**
- `userId` (string): User ID
- `userName` (string): User name
- `serialNumber` (string): Item serial number

#### `getProductActivityLogs(productId, limit = 20): ActivityLog[]`
Fetches all activities related to a product.

**Parameters:**
- `productId` (string): Product UUID
- `limit` (number): Maximum results to return

**Returns:** Array of activity log entries

#### `getItemActivityLogs(serialNumber, limit = 20): ActivityLog[]`
Fetches all activities related to an item.

**Parameters:**
- `serialNumber` (string): Item serial number
- `limit` (number): Maximum results to return

**Returns:** Array of activity log entries

#### `getActivityStats(): Promise<Statistics>`
Retrieves activity statistics.

**Returns:**
```typescript
{
  totalActivities: number;
  loginCount: number;
  issueCount: number;
  returnCount: number;
}
```

### ActivityFeed Component

**Props:**
- `productId` (string, optional): Product to show activities for
- `serialNumber` (string, optional): Item to show activities for
- `limit` (number, default: 10): Maximum activities to display
- `title` (string, default: "Activity History"): Section title

## Integration Guide

### Step 1: Set Up Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://enixlllzmsvwxtrbibgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_48FXvq6jAU7sEonNIlPvdg_yB0rLGZI
```

### Step 2: Import Activity Feed in Pages

```typescript
import { ActivityFeed } from '@/components/signature-connect/activity-feed';

export default function ProductDetailPage({ productId }) {
  return (
    <div>
      <h1>Product Details</h1>
      {/* Product details here */}
      <ActivityFeed productId={productId} />
    </div>
  );
}
```

### Step 3: Test Activities

1. Login to the application
2. Navigate to a product
3. Check the activity feed below the product details
4. Verify activities appear in real-time

## Performance Considerations

- All queries use indexed columns (`product_id`, `serial_number`, `action`, `created_at`)
- Database triggers handle automatic logging without client-side overhead
- Activity logs are ordered by `created_at` DESC for efficient pagination

## Troubleshooting

### Activities not appearing

1. Check that Supabase connection is successful
2. Verify RLS (Row Level Security) policies are enabled
3. Check browser console for errors
4. Confirm user is authenticated

### Slow activity queries

1. Ensure indexes are created on `activity_logs` table
2. Check Supabase performance metrics
3. Consider limiting results with pagination

### Missing activities for transactions

1. Verify database triggers are enabled
2. Check transaction creation logic
3. Review trigger logs in Supabase

## Future Enhancements

- Real-time updates using Supabase Realtime subscriptions
- Activity filtering and search
- Activity export to CSV/JSON
- Advanced analytics dashboard
- User activity summary reports
