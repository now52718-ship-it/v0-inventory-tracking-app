import { supabase } from './supabaseClient';

export type ActivityAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW_PRODUCT'
  | 'VIEW_ITEM'
  | 'SCAN_QR'
  | 'ADD_STOCK'
  | 'ISSUE_ITEM'
  | 'RETURN_ITEM'
  | 'MARK_FAULTY';

interface ActivityLog {
  id: string;
  user_id: string;
  user_name: string;
  action: ActivityAction;
  product_id?: string;
  serial_number?: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Log user login activity
 */
export async function logLoginActivity(userId: string, userName: string) {
  try {
    // Make sure we have valid data
    if (!userName || !userId) {
      console.warn('Cannot log activity: missing userId or userName');
      return;
    }

    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId || null,
      user_name: userName,
      action: 'LOGIN' as const,
      description: `${userName} logged into the system`,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.warn('Activity logging skipped (expected during development):', error.message)
    }
  } catch (error) {
    console.warn('Activity logging unavailable:', error)
    })

    if (error) {
      console.warn('Activity logging skipped (expected during development):', error.message)
    }
  } catch (error) {
    console.warn('Activity logging unavailable:', error)
  }
}

/**
 * Log product view activity
 */
export async function logProductViewActivity(
  userId: string,
  userName: string,
  productId: string,
  productName: string
) {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      user_name: userName,
      action: 'VIEW_PRODUCT' as const,
      product_id: productId,
      description: `${userName} viewed ${productName}`,
    });

    if (error) {
      console.error('Error logging product view:', error);
    }
  } catch (error) {
    console.error('Error logging product view:', error);
  }
}

/**
 * Log item view activity
 */
export async function logItemViewActivity(
  userId: string,
  userName: string,
  serialNumber: string
) {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      user_name: userName,
      action: 'VIEW_ITEM' as const,
      serial_number: serialNumber,
      description: `${userName} viewed item ${serialNumber}`,
    });

    if (error) {
      console.error('Error logging item view:', error);
    }
  } catch (error) {
    console.error('Error logging item view:', error);
  }
}

/**
 * Log QR scan activity
 */
export async function logScanQRActivity(
  userId: string,
  userName: string,
  serialNumber: string
) {
  try {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: userId,
      user_name: userName,
      action: 'SCAN_QR' as const,
      serial_number: serialNumber,
      description: `${userName} scanned item ${serialNumber}`,
    });

    if (error) {
      console.error('Error logging scan activity:', error);
    }
  } catch (error) {
    console.error('Error logging scan activity:', error);
  }
}

/**
 * Get all activity logs with pagination
 */
export async function getAllActivityLogs(page = 1, limit = 20): Promise<ActivityLog[]> {
  try {
    const start = (page - 1) * limit;
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, start + limit - 1);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return [];
  }
}

/**
 * Get activity logs for a specific product
 */
export async function getProductActivityLogs(
  productId: string,
  limit = 20
): Promise<ActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching product activity logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching product activity logs:', error);
    return [];
  }
}

/**
 * Get activity logs for a specific item (serial number)
 */
export async function getItemActivityLogs(
  serialNumber: string,
  limit = 20
): Promise<ActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('serial_number', serialNumber)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching item activity logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching item activity logs:', error);
    return [];
  }
}

/**
 * Get activity logs for a specific user
 */
export async function getUserActivityLogs(userId: string, limit = 20): Promise<ActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user activity logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    return [];
  }
}

/**
 * Get activity logs by action type
 */
export async function getActivityLogsByAction(
  action: ActivityAction,
  limit = 20
): Promise<ActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('action', action)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs by action:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching activity logs by action:', error);
    return [];
  }
}

/**
 * Get activity logs within a date range
 */
export async function getActivityLogsByDateRange(
  startDate: Date,
  endDate: Date,
  limit = 20
): Promise<ActivityLog[]> {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs by date range:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching activity logs by date range:', error);
    return [];
  }
}

/**
 * Get activity statistics
 */
export async function getActivityStats(): Promise<{
  totalActivities: number;
  loginCount: number;
  issueCount: number;
  returnCount: number;
}> {
  try {
    const [allLogs, logins, issues, returns] = await Promise.all([
      supabase.from('activity_logs').select('id', { count: 'exact' }),
      supabase
        .from('activity_logs')
        .select('id', { count: 'exact' })
        .eq('action', 'LOGIN'),
      supabase
        .from('activity_logs')
        .select('id', { count: 'exact' })
        .eq('action', 'ISSUE_ITEM'),
      supabase
        .from('activity_logs')
        .select('id', { count: 'exact' })
        .eq('action', 'RETURN_ITEM'),
    ]);

    return {
      totalActivities: allLogs.count || 0,
      loginCount: logins.count || 0,
      issueCount: issues.count || 0,
      returnCount: returns.count || 0,
    };
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    return {
      totalActivities: 0,
      loginCount: 0,
      issueCount: 0,
      returnCount: 0,
    };
  }
}

/**
 * Export activity logs as JSON
 */
export function exportActivityLogsAsJSON(logs: ActivityLog[]): string {
  return JSON.stringify(logs, null, 2);
}

/**
 * Format activity log for display
 */
export function formatActivityLogForDisplay(log: ActivityLog): {
  message: string;
  timeAgo: string;
  displayText: string;
} {
  const createdAt = new Date(log.created_at);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  let timeAgo = '';
  if (diffInSeconds < 60) {
    timeAgo = 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    timeAgo = `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    timeAgo = `${hours} hr${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const displayText = `• ${log.description} (${timeAgo})`;

  return {
    message: log.description,
    timeAgo,
    displayText,
  };
}
