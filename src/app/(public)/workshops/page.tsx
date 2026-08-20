import type { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Workshops',
  description: 'GOSEDMA self-defence workshops for schools, institutions, and corporate organisations. Professional, customised training programs.',
};

export default function WorkshopsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10 text-center">
          <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
            Workshops
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
            Self-Defence Workshops
          </h1>
          <p className="text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Professional, customised self-defence and awareness workshops for schools,
            institutions, and corporate organisations.
          </p>
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
            <Link href="/workshops/schools" className="group">
              <Card className="h-full p-8 text-center group-hover:border-brand-green/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/10 flex items-center justify-center mb-5 group-hover:bg-brand-green/20 transition-colors">
                  <GraduationCap className="w-8 h-8 text-brand-green" />
                </div>
                <Badge variant="green" className="mb-3">High Demand</Badge>
                <h2 className="font-heading font-bold text-2xl text-brand-deep-navy mb-3">
                  School Workshops
                </h2>
                <p className="text-foreground-secondary mb-5">
                  Age-appropriate self-defence workshops for schools and educational institutions.
                  Build student confidence, awareness, and practical safety skills.
                </p>
                <Button variant="secondary">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </Link>

            <Link href="/workshops/corporate" className="group">
              <Card className="h-full p-8 text-center group-hover:border-brand-navy/30">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-navy/5 flex items-center justify-center mb-5 group-hover:bg-brand-navy/10 transition-colors">
                  <Building2 className="w-8 h-8 text-brand-navy" />
                </div>
                <Badge variant="navy" className="mb-3">Professional</Badge>
                <h2 className="font-heading font-bold text-2xl text-brand-deep-navy mb-3">
                  Corporate Workshops
                </h2>
                <p className="text-foreground-secondary mb-5">
                  Self-defence and team-building workshops for corporate teams and professional organisations.
                </p>
                <Button variant="outline">
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
