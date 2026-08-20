import type { Metadata } from 'next';
import { Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TrialForm } from '@/components/forms/trial-form';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Book a Free Trial Class',
  description:
    'Book a free trial class at GOSEDMA. Experience Taekwondo, Muay Thai, Krav Maga, MMA, or self-defence training with expert instructors in Jaipur.',
};

export default function TrialPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              <Star className="w-3 h-3" />
              Free Trial
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Book Your Free Trial Class
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Experience world-class martial arts training at GOSEDMA. No experience needed —
              just bring your enthusiasm and we will handle the rest.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* What to Expect */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Trial Info */}
            <div>
              <Badge variant="navy" className="mb-4">What to Expect</Badge>
              <h2 className="section-title font-heading text-3xl mb-6">
                Your Trial Class Experience
              </h2>
              <div className="space-y-4 mb-8">
                {[
                  'Warm welcome and introduction to the training environment',
                  'Guided warm-up and basic technique introduction',
                  'Hands-on training with experienced instructors',
                  'Age and skill-level appropriate activities',
                  'Opportunity to ask questions and explore programs',
                  'No obligation — come, experience, and decide',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-muted border border-border-light">
                <p className="text-sm font-medium text-brand-deep-navy mb-1">What to bring:</p>
                <p className="text-sm text-foreground-secondary">
                  Comfortable workout clothing, water bottle. No special equipment needed for your first class.
                </p>
              </div>
            </div>

            <div>
              <TrialForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
