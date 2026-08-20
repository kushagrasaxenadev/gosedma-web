'use client';

import { useEffect, useRef } from 'react';

interface TurnstileProps {
  onVerify: (token: string) => void;
  className?: string;
}

declare global {
  interface Window {
    onloadTurnstileCallback?: () => void;
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export function Turnstile({ onVerify, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      // Local fallback token if Turnstile key is not set
      onVerify('local-dev-token');
      return;
    }

    // Initialize Turnstile when script loads
    const initializeTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerify(token);
          },
          'error-callback': () => {
            console.error('Turnstile error');
          },
          'expired-callback': () => {
            onVerify('');
          },
        });
      }
    };

    // Load Turnstile script if not already present
    const id = 'cf-turnstile-script';
    let script = document.getElementById(id) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    if (window.turnstile) {
      initializeTurnstile();
    } else {
      script.addEventListener('load', initializeTurnstile);
    }

    return () => {
      // Clean up script listener if any
      script?.removeEventListener('load', initializeTurnstile);
    };
  }, [onVerify]);

  return <div ref={containerRef} className={className} />;
}
