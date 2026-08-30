import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Announcements',
  description: 'Latest news, press releases, admissions, and holiday notices from GOSEDMA.',
};

export default function NewsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-20 relative z-10">
          <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">News</Badge>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">Latest News & Announcements</h1>
          <p className="text-lg text-white/80">Stay informed about admissions, batch changes, holiday updates, and achievements.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-narrow text-center">
          <div className="card p-12">
            <Newspaper className="w-12 h-12 text-brand-navy dark:text-brand-green dark:text-brand-green-light/20 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">No News Items Yet</h2>
            <p className="text-foreground-secondary">We will publish academy announcements and press releases here soon.</p>
          </div>
        </div>
      </section>
    </>
  );
}
