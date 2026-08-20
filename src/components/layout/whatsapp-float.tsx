'use client';

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export function WhatsAppFloat() {
  const url = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
    'Hi GOSEDMA, I would like some information about your academy.'
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
