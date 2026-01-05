import React from 'react';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { Card, CardBody } from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import type { ChangeLogEntry } from '../types/servicePeriod.types';

interface ChangeLogTabProps {
  entries: ChangeLogEntry[];
  isLoading: boolean;
}

export const ChangeLogTab: React.FC<ChangeLogTabProps> = ({
  entries,
  isLoading,
}) => {
  const getActionIcon = (action: ChangeLogEntry['action']) => {
    switch (action) {
      case 'create': return <Plus className="w-4 h-4 text-success-500" />;
      case 'update': return <Edit className="w-4 h-4 text-primary-500" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-error-500" />;
      default: return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getActionColor = (action: ChangeLogEntry['action']) => {
    switch (action) {
      case 'create': return 'bg-success-100 dark:bg-success-900/30';
      case 'update': return 'bg-primary-100 dark:bg-primary-900/30';
      case 'delete': return 'bg-error-100 dark:bg-error-900/30';
      default: return 'bg-neutral-100 dark:bg-neutral-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-white">Change Log</h3>
      </div>
      <CardBody>
        {entries.length === 0 ? (
          <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
            No changes recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
              >
                <div className={`p-2 rounded-full ${getActionColor(entry.action)}`}>
                  {getActionIcon(entry.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-neutral-900 dark:text-white capitalize">
                      {entry.action} {entry.entityType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.field && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Changed <span className="font-medium">{entry.field}</span>
                      {entry.oldValue && (
                        <> from <span className="text-error-600 dark:text-error-400">{entry.oldValue}</span></>
                      )}
                      {entry.newValue && (
                        <> to <span className="text-success-600 dark:text-success-400">{entry.newValue}</span></>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 mt-1">
                    by {entry.userName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ChangeLogTab;
