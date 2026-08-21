'use client';

import { useEffect, useRef, useCallback } from 'react';

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
  // Store onVerify in a ref to avoid re-triggering useEffect on every render
  const onVerifyRef = useRef(onVerify);
  const hasCalledFallback = useRef(false);

  // Keep the ref current without triggering effects
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
      // Local/demo fallback token — call only once
      if (!hasCalledFallback.current) {
        hasCalledFallback.current = true;
        onVerifyRef.current('local-dev-token');
      }
      return;
    }

    // Initialize Turnstile when script loads
    const initializeTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            onVerifyRef.current(token);
          },
          'error-callback': () => {
            console.error('Turnstile error');
          },
          'expired-callback': () => {
            onVerifyRef.current('');
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
      script?.removeEventListener('load', initializeTurnstile);
    };
  }, []); // Empty deps — runs once on mount

  return <div ref={containerRef} className={className} />;
}
