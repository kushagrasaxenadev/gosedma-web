import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Founder — Richa Gaur',
  description: `Richa Gaur — Founder of GOSEDMA (${SITE_CONFIG.fullName}). A dedicated martial artist and visionary behind ${SITE_CONFIG.city}'s premier multi-discipline academy.`,
};

export default function FounderPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-3">
              <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
                Founder & Chief Instructor
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
                Richa Gaur
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Founder of GOSEDMA — the {SITE_CONFIG.fullName}. A passionate martial artist,
                instructor, and advocate for self-defence education.
              </p>
            </div>
            <div className="lg:col-span-2 flex justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo-circular.png"
                  alt="GOSEDMA — Founded by Richa Gaur"
                  width={200}
                  height={200}
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Biography */}
      <section className="section-padding">
        <div className="container-narrow">
          <Badge variant="navy" className="mb-4">Biography</Badge>
          <h2 className="section-title font-heading text-3xl mb-6">
            A Journey of Discipline & Dedication
          </h2>
          <div className="prose max-w-none">
            <p className="text-foreground-secondary leading-relaxed mb-5">
              Richa Gaur is the founder and chief instructor of GOSEDMA (Global Institute of Self
              Defence & Martial Arts), a multi-discipline martial arts academy established in{' '}
              {SITE_CONFIG.establishedYear} in {SITE_CONFIG.city}, {SITE_CONFIG.state}.
            </p>
            <p className="text-foreground-secondary leading-relaxed mb-5">
              With deep experience across multiple martial arts disciplines, Richa founded GOSEDMA
              with the vision of making world-class martial arts training accessible and inclusive.
              She has trained students ranging from young children to adults, helping them develop
              not just physical skills but discipline, confidence, and resilience.
            </p>
            <p className="text-foreground-secondary leading-relaxed mb-5">
              Under her leadership, GOSEDMA has grown into a respected academy offering programs in
              Taekwondo, Muay Thai, Krav Maga, MMA, and specialized self-defence training. The
              academy&apos;s students have competed at state, national, and international levels.
            </p>
            <p className="text-foreground-secondary leading-relaxed">
              Richa is also committed to community education through school self-defence workshops,
              women&apos;s empowerment programs, and corporate training sessions.
            </p>
          </div>

          {/* Note about verification */}
          <div className="mt-8 p-4 rounded-lg bg-muted border border-border-light">
            <p className="text-xs text-muted-foreground italic">
              Detailed credentials, awards, and competition achievements will be published upon
              verification. For the most current information, please contact the academy directly.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-muted">
        <div className="container-narrow">
          <Badge variant="green" className="mb-4">Philosophy</Badge>
          <h2 className="section-title font-heading text-3xl mb-6">
            Training Philosophy
          </h2>
          <blockquote className="border-l-4 border-brand-green pl-6 py-2 mb-6">
            <p className="text-xl font-heading text-brand-deep-navy italic">
              &quot;Martial arts is not just about fighting — it&apos;s about building character,
              discipline, and the confidence to stand up for yourself and others.&quot;
            </p>
          </blockquote>
          <p className="text-foreground-secondary leading-relaxed">
            Richa Gaur&apos;s approach to training combines technical excellence with holistic
            development. Every student at GOSEDMA is encouraged to progress at their own pace
            while being challenged to exceed their perceived limits — in a safe, supportive,
            and disciplined environment.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="font-heading font-bold text-3xl text-brand-deep-navy mb-4">
            Train Under Expert Guidance
          </h2>
          <p className="text-foreground-secondary mb-8 max-w-lg mx-auto">
            Experience the GOSEDMA training methodology. Book a trial class and discover
            the difference that expert instruction makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/trial">
              <Button variant="secondary" size="lg">
                Book a Trial Class
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/programs">
              <Button variant="outline" size="lg">
                View Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
