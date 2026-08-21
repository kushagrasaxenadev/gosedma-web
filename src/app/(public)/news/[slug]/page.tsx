import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'News Article',
  description: 'Latest updates and announcements from GOSEDMA.',
};

export default function NewsDetailPage() {
  return (
    <section className="section-padding">
      <div className="container-narrow text-center py-12">
        <Newspaper className="w-16 h-16 text-brand-navy dark:text-brand-green-light/20 mx-auto mb-4" />
        <Badge variant="navy" className="mb-4">News</Badge>
        <h1 className="font-heading font-extrabold text-3xl text-foreground mb-4">
          News Article Coming Soon
        </h1>
        <p className="text-foreground-secondary mb-8">
          The requested news announcement is in draft and will be visible here once published by the administrators.
        </p>
        <Link href="/news">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Button>
        </Link>
      </div>
    </section>
  );
}
