import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Trash2, Settings, Filter, Clock, DollarSign, Users, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, Button, Badge, Checkbox } from '@/components';
import { cn } from '@/lib/cn';

type NotificationType = 'payment' | 'invoice' | 'customer' | 'system' | 'reminder';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'payment', title: 'Payment Received', message: 'ABC Corporation paid $1,500.00 for Invoice #INV-001', timestamp: '2 minutes ago', read: false, actionUrl: '/payments/1', actionLabel: 'View Payment' },
    { id: '2', type: 'invoice', title: 'Invoice Overdue', message: 'Invoice #INV-003 for Tech Solutions is 7 days overdue', timestamp: '1 hour ago', read: false, actionUrl: '/invoices/3', actionLabel: 'View Invoice' },
    { id: '3', type: 'customer', title: 'New Customer', message: 'Metro Office Group has been added as a new customer', timestamp: '3 hours ago', read: false, actionUrl: '/customers/4', actionLabel: 'View Customer' },
    { id: '4', type: 'reminder', title: 'Service Reminder', message: 'Scheduled service for XYZ Industries tomorrow at 10:00 AM', timestamp: '5 hours ago', read: true, actionUrl: '/services/scheduling', actionLabel: 'View Schedule' },
    { id: '5', type: 'system', title: 'System Update', message: 'New features have been added to the reporting module', timestamp: 'Yesterday', read: true },
    { id: '6', type: 'payment', title: 'Payment Failed', message: 'Payment attempt for Invoice #INV-005 failed - Card declined', timestamp: 'Yesterday', read: true, actionUrl: '/invoices/5', actionLabel: 'Retry Payment' },
    { id: '7', type: 'invoice', title: 'Invoice Created', message: 'Invoice #INV-008 has been created for City Hall - $2,400.00', timestamp: '2 days ago', read: true, actionUrl: '/invoices/8', actionLabel: 'View Invoice' },
    { id: '8', type: 'customer', title: 'Customer Updated', message: 'Contact information updated for State Office Building', timestamp: '2 days ago', read: true },
    { id: '9', type: 'reminder', title: 'Low Stock Alert', message: 'Ocean Breeze Scent Refill is running low (8 units remaining)', timestamp: '3 days ago', read: true, actionUrl: '/services/inventory', actionLabel: 'View Inventory' },
    { id: '10', type: 'system', title: 'Weekly Report', message: 'Your weekly business summary is ready to view', timestamp: '1 week ago', read: true, actionUrl: '/reports', actionLabel: 'View Report' },
  ]);

  const typeIcons: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
    payment: DollarSign,
    invoice: FileText,
    customer: Users,
    system: Settings,
    reminder: Calendar,
  };

  const typeColors: Record<NotificationType, string> = {
    payment: 'bg-green-100 text-green-600 dark:bg-green-900/30',
    invoice: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
    customer: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30',
    system: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-900/30',
    reminder: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setSelectedIds(selectedIds.filter(i => i !== id));
  };

  const deleteSelected = () => {
    setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  return (
    <PageContainer
      title="Notifications"
      subtitle="Stay updated with your business activity"
      breadcrumbs={[{ label: 'Notifications' }]}
      actions={
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Stats */}
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">{unreadCount}</p>
                <p className="text-sm text-neutral-500">Unread notifications</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </Card>

          {/* Filters */}
          <Card className="p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Filter</h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  filter === 'all' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                All Notifications
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between',
                  filter === 'unread' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                )}
              >
                <span>Unread Only</span>
                {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
              </button>
            </div>
          </Card>

          {/* Type Filter */}
          <Card className="p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Type</h3>
            <div className="space-y-1">
              {(['all', 'payment', 'invoice', 'customer', 'reminder', 'system'] as const).map(type => {
                const Icon = type === 'all' ? Filter : typeIcons[type];
                const count = type === 'all' ? notifications.length : notifications.filter(n => n.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                      typeFilter === type ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 capitalize">{type === 'all' ? 'All Types' : type}</span>
                    <span className="text-xs text-neutral-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-3">
          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <Card className="p-3 mb-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-700 dark:text-primary-400">
                  {selectedIds.length} selected
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>Cancel</Button>
                  <Button variant="outline" size="sm" onClick={deleteSelected}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
              <Checkbox
                checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={selectAll}
              />
              <span className="text-sm text-neutral-500">Select all</span>
            </div>

            {/* Notification Items */}
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
                <p className="text-neutral-500">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map(notification => {
                const Icon = typeIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 flex items-start gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors',
                      !notification.read && 'bg-primary-50/50 dark:bg-primary-900/10'
                    )}
                  >
                    <Checkbox
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                    />
                    <div className={cn('p-2 rounded-lg flex-shrink-0', typeColors[notification.type])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn('text-sm', !notification.read ? 'font-semibold text-neutral-900 dark:text-white' : 'text-neutral-700 dark:text-neutral-300')}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-neutral-500 mt-0.5">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {notification.timestamp}
                        </span>
                        {notification.actionUrl && (
                          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => navigate(notification.actionUrl!)}>
                            {notification.actionLabel}
                          </Button>
                        )}
                        {!notification.read && (
                          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => markAsRead(notification.id)}>
                            <Check className="w-3 h-3 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-xs h-6 text-red-500 hover:text-red-600" onClick={() => deleteNotification(notification.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotificationsPage;
