import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CheckCircle, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Corporate Workshops',
  description: 'GOSEDMA corporate self-defence and team-building workshops for organisations in Jaipur and Rajasthan.',
};

export default function CorporateWorkshopsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              <Building2 className="w-3 h-3" /> Corporate Programs
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Corporate Self-Defence & Team Building
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Empower your team with practical self-defence skills while building collaboration,
              confidence, and resilience.
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
        <div className="container-narrow">
          <h2 className="section-title font-heading text-3xl mb-6">What We Offer</h2>
          <div className="space-y-4 mb-10">
            {[
              'Practical self-defence skills applicable in real-world situations',
              'Team-building through collaborative physical activities',
              'Stress relief and physical wellness for corporate professionals',
              'Customised sessions for mixed fitness levels',
              'At your venue or at our professional training facilities',
              'Led by experienced, certified martial arts instructors',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-foreground-secondary">{item}</span>
              </div>
            ))}
          </div>

          <div className="card p-8 text-center">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">
              Interested in a Corporate Workshop?
            </h3>
            <p className="text-foreground-secondary mb-6">
              Contact us to discuss a customised programme for your organisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button variant="primary">
                  <Phone className="w-4 h-4" />
                  Call Us
                </Button>
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi GOSEDMA, I am interested in a corporate self-defence workshop.')}`} target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
