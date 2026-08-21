import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Sun, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Summer Camps',
  description: 'Annual summer martial arts and self-defence camps at GOSEDMA.',
};

export default function SummerCampsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
            <Sun className="w-3 h-3" /> Special Camp
          </Badge>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
            Summer Martial Arts & Self-Defence Camps
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Intensive seasonal training programs focusing on fitness, martial arts disciplines,
            practical self-defence, and active fun for children and teens.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-narrow">
          <h2 className="section-title font-heading text-3xl mb-6">Camp Features</h2>
          <div className="space-y-4 mb-10">
            {[
              'Multi-style training blocks (Taekwondo, Kickboxing, basic stunts)',
              'Specialised physical fitness and flexibility sessions',
              'Real-world self-defence tactics and anti-bullying awareness',
              'Fun sports, cooperative games, and teamwork drills',
              'Certificate of completion for all participants',
              'Suitable for absolute beginners and active students',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-foreground-secondary">{item}</span>
              </div>
            ))}
          </div>

          <div className="card p-8 text-center">
            <h3 className="font-heading font-bold text-xl text-foreground mb-4">
              Enquire About Our Next Summer Camp
            </h3>
            <p className="text-foreground-secondary mb-6">
              Our summer camps are scheduled seasonally. Contact us to get details on the next upcoming camp dates and batches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${SITE_CONFIG.phone}`}>
                <Button variant="primary">
                  <Phone className="w-4 h-4" />
                  Call Us
                </Button>
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi GOSEDMA, I want to enquire about the next summer camp schedule.')}`} target="_blank" rel="noopener noreferrer">
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
