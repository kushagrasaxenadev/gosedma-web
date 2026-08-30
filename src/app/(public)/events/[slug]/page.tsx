import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Event Details',
  description: 'Martial arts championship and event details at GOSEDMA.',
};

export default function EventDetailPage() {
  return (
    <section className="section-padding">
      <div className="container-narrow text-center py-12">
        <Calendar className="w-16 h-16 text-brand-navy dark:text-brand-green dark:text-brand-green-light/20 mx-auto mb-4" />
        <Badge variant="navy" className="mb-4">Events</Badge>
        <h1 className="font-heading font-extrabold text-3xl text-foreground mb-4">
          Event Details Coming Soon
        </h1>
        <p className="text-foreground-secondary mb-8">
          Detailed event pages and updates are currently in draft. They will be published here upon verification.
        </p>
        <Link href="/events">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </Link>
      </div>
    </section>
  );
}
