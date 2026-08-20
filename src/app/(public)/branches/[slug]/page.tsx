import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, ArrowLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/lib/constants';

interface BranchDetail {
  name: string;
  description: string;
  address: string;
  openingHours: string[];
  mapUrl?: string;
  whatsapp: string;
  phone: string;
}

const branchesData: Record<string, BranchDetail> = {
  'malviya-nagar': {
    name: 'Malviya Nagar Branch',
    description: 'Our primary academy branch located in Malviya Nagar, Jaipur. Offering full-scale facilities, martial arts training mats, kickbags, and safety gear.',
    address: 'Malviya Nagar, Jaipur, Rajasthan - 302017',
    openingHours: [
      'Morning: 6:00 AM - 9:00 AM',
      'Evening: 4:00 PM - 8:30 PM',
      'Sunday: Closed'
    ],
    whatsapp: SITE_CONFIG.whatsapp,
    phone: SITE_CONFIG.phone
  },
  'sitapura': {
    name: 'Sitapura Branch',
    description: 'Our Sitapura training facility offering specialized self-defence workshops, Taekwondo batches, and kickboxing programs for students and professionals.',
    address: 'Sitapura Industrial Area, Jaipur, Rajasthan - 302022',
    openingHours: [
      'Morning: 6:30 AM - 9:00 AM',
      'Evening: 5:00 PM - 8:00 PM',
      'Sunday: Closed'
    ],
    whatsapp: SITE_CONFIG.whatsapp,
    phone: SITE_CONFIG.phone
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const branch = branchesData[resolvedParams.slug];
  if (!branch) return { title: 'Branch Not Found' };
  return {
    title: `${branch.name} — GOSEDMA`,
    description: branch.description,
  };
}

export default async function BranchDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const branch = branchesData[resolvedParams.slug];

  if (!branch) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <Link href="/branches" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Branches
          </Link>
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              Training Center
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight">
              {branch.name}
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              {branch.description}
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
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h2 className="font-heading font-bold text-2xl text-brand-deep-navy mb-4">Location Details</h2>
              <div className="flex gap-3 mb-8 p-5 bg-muted/50 border border-border-light rounded-xl">
                <MapPin className="w-6 h-6 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-brand-deep-navy">Address</h3>
                  <p className="text-foreground-secondary">{branch.address}</p>
                </div>
              </div>

              <h2 className="font-heading font-bold text-2xl text-brand-deep-navy mb-4">Branch Timings</h2>
              <div className="flex gap-3 p-5 bg-muted/50 border border-border-light rounded-xl">
                <Clock className="w-6 h-6 text-brand-green shrink-0 mt-0.5" />
                <div>
                  {branch.openingHours.map((time) => (
                    <p key={time} className="text-foreground-secondary text-sm leading-relaxed">{time}</p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="font-heading font-bold text-xl text-brand-deep-navy mb-5">Get in Touch</h3>
                <div className="space-y-4 mb-6">
                  <a href={`tel:${branch.phone}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <Phone className="w-5 h-5 text-brand-navy" />
                    <div>
                      <p className="text-xs text-muted-foreground">Call Us</p>
                      <p className="text-sm font-semibold text-brand-deep-navy">{branch.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`Hi GOSEDMA, I would like to enquire about classes at the ${branch.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp Us</p>
                      <p className="text-sm font-semibold text-brand-deep-navy">Chat Now</p>
                    </div>
                  </a>
                </div>

                <Link href="/trial">
                  <Button variant="secondary" fullWidth className="font-heading uppercase tracking-wider">
                    Book a Trial Class here
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
