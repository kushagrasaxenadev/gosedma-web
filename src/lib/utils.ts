// GOSEDMA — Utility functions
import { type ClassValue, clsx } from 'clsx';

/**
 * Merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency for Indian Rupee display
 */
export function formatCurrency(amount: number, currency = '₹'): string {
  const formatted = new Intl.NumberFormat('en-IN').format(amount);
  return `${currency}${formatted}`;
}

/**
 * Format price based on pricing mode
 */
export function formatPrice(config: {
  pricing_mode: 'exact' | 'starting_from' | 'range' | 'enquire' | 'hidden';
  currency?: string;
  price?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  billing_unit?: string | null;
  public_pricing_note?: string | null;
}): string | null {
  const { pricing_mode, currency = '₹', price, min_price, max_price, billing_unit } = config;

  switch (pricing_mode) {
    case 'exact':
      if (!price) return null;
      return `${formatCurrency(price, currency)}${billing_unit ? ` / ${billing_unit}` : ''}`;

    case 'starting_from':
      if (!price) return null;
      return `Starting from ${formatCurrency(price, currency)}${billing_unit ? ` / ${billing_unit}` : ''}`;

    case 'range':
      if (!min_price || !max_price) return null;
      return `${formatCurrency(min_price, currency)} – ${formatCurrency(max_price, currency)}${billing_unit ? ` / ${billing_unit}` : ''}`;

    case 'enquire':
      return 'Contact the academy for pricing';

    case 'hidden':
      return null;

    default:
      return null;
  }
}

/**
 * Build WhatsApp URL with pre-filled message
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = new URL(`https://wa.me/${cleanPhone}`);
  if (message) {
    url.searchParams.set('text', message);
  }
  return url.toString();
}

/**
 * Build WhatsApp URL for specific contexts
 */
export function getWhatsAppUrl(context: 'general' | 'program' | 'workshop' | 'trial', detail?: string): string {
  const phone = WHATSAPP_NUMBER;
  const messages: Record<string, string> = {
    general: 'Hi GOSEDMA, I would like some information about your academy.',
    program: `Hi GOSEDMA, I would like information about the ${detail || 'training'} program.`,
    workshop: 'Hi GOSEDMA, I would like to discuss a self-defence workshop for our school.',
    trial: 'Hi GOSEDMA, I would like to book a trial class.',
  };
  return buildWhatsAppUrl(phone, messages[context] || messages.general);
}

// Central WhatsApp number — administered via site settings
const WHATSAPP_NUMBER = '919999999999'; // Placeholder — will come from site_settings

/**
 * Slugify text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}
