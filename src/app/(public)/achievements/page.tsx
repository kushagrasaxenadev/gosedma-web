import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Explore GOSEDMA achievements — competitions, awards, and milestones of our academy and students.',
};

export default function AchievementsPage() {
  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              <Trophy className="w-3 h-3" /> Our Achievements
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Achievements & Milestones
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Celebrating the achievements of GOSEDMA academy, our founder, and our students.
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
        <div className="container-narrow text-center">
          <div className="card p-12">
            <Trophy className="w-12 h-12 text-brand-navy dark:text-brand-green dark:text-brand-green-light/20 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-2xl text-foreground mb-3">
              Achievements Coming Soon
            </h2>
            <p className="text-foreground-secondary max-w-md mx-auto">
              Verified achievements and competition results will be published here upon confirmation.
              Contact us to learn more about our academy&apos;s track record.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
