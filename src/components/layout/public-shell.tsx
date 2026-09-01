'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { BackToTop } from '@/components/ui/back-to-top';
import { CookieNotice } from '@/components/ui/cookie-notice';

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Admin routes get NO public header/footer/floats — they have their own layout
  if (isAdmin) {
    return <>{children}</>;
  }

  // Public routes get the full public navigation shell
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-[calc(theme(spacing.16)+2rem)] lg:pt-[calc(theme(spacing.18)+2rem)]">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
      <CookieNotice />
    </>
  );
}
