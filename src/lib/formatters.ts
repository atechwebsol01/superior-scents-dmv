import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';

/**
 * Format currency value
 */
export const formatCurrency = (
  value: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format number with commas
 */
export const formatNumber = (
  value: number,
  locale: string = 'en-US',
  decimals: number = 0
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format percentage
 */
export const formatPercent = (
  value: number,
  locale: string = 'en-US',
  decimals: number = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

/**
 * Format date to string
 */
export const formatDate = (
  date: Date | string | null | undefined,
  formatStr: string = 'MMM d, yyyy'
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr);
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: Date | string | null | undefined,
  formatStr: string = 'MMM d, yyyy h:mm a'
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr);
};

/**
 * Format time only
 */
export const formatTime = (
  date: Date | string | null | undefined,
  formatStr: string = 'h:mm a'
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return format(dateObj, formatStr);
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (
  date: Date | string | null | undefined,
  baseDate: Date = new Date()
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return formatDistance(dateObj, baseDate, { addSuffix: true });
};

/**
 * Format relative date (e.g., "yesterday at 5:00 PM")
 */
export const formatRelativeDate = (
  date: Date | string | null | undefined,
  baseDate: Date = new Date()
): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  return formatRelative(dateObj, baseDate);
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format address
 */
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
} | null | undefined): string => {
  if (!address) return '';
  const parts = [
    address.street,
    address.city,
    address.state && address.zip ? `${address.state} ${address.zip}` : address.state || address.zip,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
};

/**
 * Format name (first + last)
 */
export const formatName = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  return [firstName, lastName].filter(Boolean).join(' ') || '';
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Format duration in minutes to human readable
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
