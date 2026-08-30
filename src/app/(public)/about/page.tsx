import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Users, Globe, Heart, Shield, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about GOSEDMA — the ${SITE_CONFIG.fullName}. Founded in ${SITE_CONFIG.establishedYear} in ${SITE_CONFIG.city}, ${SITE_CONFIG.state} by Richa Gaur.`,
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Discipline',
      description: 'Martial arts is built on discipline — we instil it in every student from day one.',
    },
    {
      icon: Heart,
      title: 'Safety',
      description: 'Every training session prioritises safety with professional supervision and progressive techniques.',
    },
    {
      icon: Users,
      title: 'Inclusivity',
      description: 'Training for all — children, adults, women, and people of all backgrounds and skill levels.',
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'World-class training methodologies adapted for students in Jaipur and beyond.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              About GOSEDMA
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              The Global Institute of Self Defence & Martial Arts
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              GOSEDMA is a premier multi-discipline martial arts academy in {SITE_CONFIG.city}, {SITE_CONFIG.state},
              founded by Richa Gaur. We train students across Taekwondo, Muay Thai, Krav Maga, MMA,
              and specialized self-defence programs.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="navy" className="mb-4">Our Mission</Badge>
              <h2 className="section-title font-heading text-3xl md:text-4xl mb-5">
                Empowering Through Martial Arts
              </h2>
              <p className="text-foreground-secondary leading-relaxed mb-4">
                Established in {SITE_CONFIG.establishedYear}, GOSEDMA was founded with a clear vision: to make
                professional martial arts and self-defence training accessible to everyone in Jaipur
                and beyond.
              </p>
              <p className="text-foreground-secondary leading-relaxed mb-4">
                We believe that martial arts training goes far beyond physical technique. It builds
                discipline, confidence, mental resilience, and a deep sense of personal safety that
                transforms lives.
              </p>
              <p className="text-foreground-secondary leading-relaxed">
                From young children taking their first steps in Taekwondo to adults seeking practical
                self-defence skills, and from school workshops to competitive athlete preparation —
                GOSEDMA serves a diverse community with dedication and expertise.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/gallery/training-session.png"
                alt="GOSEDMA training session"
                width={600}
                height={450}
                className="rounded-2xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="green" className="mb-4">Our Values</Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-brand-navy/5 dark:bg-brand-green/10 flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-brand-navy dark:text-brand-green dark:text-brand-green-light" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-foreground-secondary">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="navy" className="mb-4">What We Offer</Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              Comprehensive Training Programs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Taekwondo — Olympic-style martial art',
              'Muay Thai — Thai kickboxing for fitness and self-defence',
              'Krav Maga — Practical self-defence system',
              'MMA — Mixed Martial Arts',
              "Women's Self Defence — Specialized empowerment program",
              "Children's Self Defence — Age-appropriate safety training",
              'Competition Training — Elite athlete preparation',
              'School & Corporate Workshops — Customised group programs',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-foreground-secondary">{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/programs">
              <Button variant="primary" size="lg">
                View All Programs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
