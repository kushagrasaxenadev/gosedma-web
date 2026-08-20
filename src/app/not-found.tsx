import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center section-padding">
      <div className="text-center max-w-md mx-auto px-4">
        <p className="text-7xl font-heading font-extrabold text-brand-navy/20 mb-4">404</p>
        <h1 className="font-heading text-3xl md:text-4xl text-brand-deep-navy mb-4">
          Page Not Found
        </h1>
        <p className="text-foreground-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
