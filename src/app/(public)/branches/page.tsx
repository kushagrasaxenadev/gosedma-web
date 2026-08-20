import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Our Branches',
  description: `Find GOSEDMA training centres in ${SITE_CONFIG.city}, ${SITE_CONFIG.state}. Visit our branches in Malviya Nagar and Sitapura.`,
};

const branches = [
  {
    name: 'Malviya Nagar',
    slug: 'malviya-nagar',
    description: 'Our primary training center with comprehensive facilities for all programs.',
    address: 'Malviya Nagar, Jaipur, Rajasthan',
    phone: SITE_CONFIG.phone,
    whatsapp: SITE_CONFIG.whatsapp,
  },
  {
    name: 'Sitapura',
    slug: 'sitapura',
    description: 'Training center serving the Sitapura area and surrounding neighborhoods.',
    address: 'Sitapura, Jaipur, Rajasthan',
    phone: SITE_CONFIG.phone,
    whatsapp: SITE_CONFIG.whatsapp,
  },
];

export default function BranchesPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              Our Locations
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Training Centres in {SITE_CONFIG.city}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Visit our professional training facilities across Jaipur.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {branches.map((branch) => (
              <Card key={branch.slug} className="p-8">
                <div className="w-14 h-14 rounded-full bg-brand-navy/5 flex items-center justify-center mb-5">
                  <MapPin className="w-7 h-7 text-brand-navy" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-brand-deep-navy mb-2">
                  {branch.name}
                </h2>
                <p className="text-foreground-secondary mb-4">{branch.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                    <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                    {branch.address}
                  </div>
                  <a href={`tel:${branch.phone}`} className="flex items-center gap-2 text-sm text-foreground-secondary hover:text-brand-navy transition-colors">
                    <Phone className="w-4 h-4 text-brand-green shrink-0" />
                    {branch.phone}
                  </a>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:${branch.phone}`}>
                    <Button variant="primary" size="sm">
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/${branch.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="whatsapp" size="sm">
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/trial">
              <Button variant="secondary" size="lg">
                Book a Trial at Any Branch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
