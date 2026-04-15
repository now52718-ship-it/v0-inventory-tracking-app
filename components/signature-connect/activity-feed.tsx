'use client';

import React, { useEffect, useState } from 'react';
import { getProductActivityLogs, getItemActivityLogs, formatActivityLogForDisplay } from '@/lib/activityLogService';

interface ActivityLog {
  id: string;
  user_name: string;
  action: string;
  description: string;
  created_at: string;
}

interface ActivityFeedProps {
  productId?: string;
  serialNumber?: string;
  limit?: number;
  title?: string;
}

export function ActivityFeed({
  productId,
  serialNumber,
  limit = 10,
  title = 'Activity History',
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        let logs: ActivityLog[] = [];

        if (serialNumber) {
          logs = await getItemActivityLogs(serialNumber, limit);
        } else if (productId) {
          logs = await getProductActivityLogs(productId, limit);
        }

        setActivities(logs);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };

    if (productId || serialNumber) {
      fetchActivities();
    }
  }, [productId, serialNumber, limit]);

  if (!productId && !serialNumber) {
    return null;
  }

  return (
    <div className="w-full mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">Loading activity history...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">No activity recorded yet</p>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((activity) => {
            const formatted = formatActivityLogForDisplay(activity);
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 break-words">{formatted.displayText}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
