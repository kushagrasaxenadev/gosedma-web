'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('gosedma-cookies-accepted');
    if (!accepted) {
      // Delay slightly so it doesn't flash immediately
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('gosedma-cookies-accepted', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-brand-deep-navy dark:bg-surface border-t border-white/10 dark:border-border shadow-xl animate-fade-in-up"
    >
      <div className="container-wide flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
        <p className="text-sm text-white/80 dark:text-foreground-secondary flex-1">
          We use essential cookies to make our website work. By continuing to browse, you agree to our{' '}
          <a href="/privacy" className="underline text-brand-green hover:text-brand-green-light">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 rounded-lg bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss"
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
