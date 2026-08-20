import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  CheckCircle,
  Shield,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WorkshopForm } from '@/components/forms/workshop-form';
import { Button } from '@/components/ui/button';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Self-Defence Workshops for Schools',
  description:
    'GOSEDMA delivers professional, age-appropriate self-defence workshops to schools and institutions. Empower students with practical safety skills, awareness, and confidence.',
};

export default function SchoolWorkshopsPage() {
  const benefits = [
    {
      icon: Shield,
      title: 'Practical Self-Defence Skills',
      description:
        'Students learn real-world self-defence techniques appropriate for their age group. Focus on awareness, boundary-setting, and safe responses.',
    },
    {
      icon: Users,
      title: 'Confidence & Empowerment',
      description:
        'Training builds confidence, situational awareness, and the mental strength to respond calmly under pressure.',
    },
    {
      icon: GraduationCap,
      title: 'Age-Appropriate Curriculum',
      description:
        'Workshops are tailored for different grade levels — from primary school through senior secondary — with age-suitable content.',
    },
    {
      icon: Clock,
      title: 'Flexible Duration',
      description:
        'From 1-hour introductory sessions to full-day intensive workshops. Multi-day programs available for comprehensive training.',
    },
    {
      icon: MapPin,
      title: 'At Your Venue or Ours',
      description:
        'We come to your school or institution, or host groups at our professional training facilities.',
    },
  ];

  const workshopTypes = [
    {
      title: 'Introductory Self-Defence',
      duration: '1–2 hours',
      description: 'Basic awareness, boundary skills, and introductory self-defence techniques.',
    },
    {
      title: 'Comprehensive Safety Workshop',
      duration: 'Half-day',
      description: 'In-depth practical self-defence combined with awareness training and scenario practice.',
    },
    {
      title: 'Intensive Self-Defence Program',
      duration: 'Full day / Multi-day',
      description: 'Extended training program with progressive skill development, physical conditioning, and practical drills.',
    },
    {
      title: 'Custom Workshop',
      duration: 'Flexible',
      description: 'Tailored content and duration based on your institution\'s specific needs, age group, and objectives.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
                <GraduationCap className="w-3 h-3" />
                School Self-Defence Workshops
              </Badge>
              <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight">
                Empower Your Students with Self-Defence Skills
              </h1>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Professional, age-appropriate self-defence workshops delivered at your school
                or institution by GOSEDMA&apos;s certified instructors. Build confidence,
                awareness, and practical safety skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#enquiry-form">
                  <Button size="xl" variant="secondary" className="font-heading uppercase tracking-wider">
                    Request a Workshop
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                    'Hi GOSEDMA, I would like to discuss a self-defence workshop for our school.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="xl"
                    variant="whatsapp"
                    className="font-heading uppercase tracking-wider"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp Us
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <Image
                src="/images/gallery/academy-collage.jpg"
                alt="GOSEDMA school workshops and events"
                width={500}
                height={400}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="navy" className="mb-4">Why GOSEDMA Workshops</Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              Why Schools Choose GOSEDMA
            </h2>
            <p className="text-foreground-secondary mt-6 max-w-2xl mx-auto">
              Our workshops go beyond basic physical techniques — we empower students with
              awareness, confidence, and practical skills for real-world safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-brand-green" />
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-deep-navy mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Formats */}
      <section className="section-padding bg-muted">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge variant="green" className="mb-4">Workshop Formats</Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              Flexible Workshop Options
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {workshopTypes.map((workshop) => (
              <div key={workshop.title} className="card p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-heading font-bold text-lg text-brand-deep-navy">
                    {workshop.title}
                  </h3>
                </div>
                <Badge variant="muted" className="mb-3">{workshop.duration}</Badge>
                <p className="text-sm text-foreground-secondary leading-relaxed">
                  {workshop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <Badge variant="navy" className="mb-4">How It Works</Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              Getting Started is Simple
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Submit Your Enquiry',
                description: 'Fill out the form below or contact us via WhatsApp with your requirements.',
              },
              {
                step: '02',
                title: 'Consultation & Customization',
                description: 'Our team discusses your needs, audience, and objectives to design the ideal workshop.',
              },
              {
                step: '03',
                title: 'Proposal & Confirmation',
                description: 'Receive a detailed proposal with content outline, logistics, and pricing.',
              },
              {
                step: '04',
                title: 'Workshop Delivery',
                description: 'Our certified instructors deliver the workshop at your venue or ours, with all equipment provided.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full bg-brand-navy text-white flex items-center justify-center font-heading font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-deep-navy mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form Placeholder */}
      <section id="enquiry-form" className="section-padding bg-muted scroll-mt-24">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <Badge variant="green" className="mb-4">
              <GraduationCap className="w-3 h-3" />
              Get Started
            </Badge>
            <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
              Request a School Workshop
            </h2>
            <p className="text-foreground-secondary mt-6 max-w-xl mx-auto">
              Fill out the form below and our team will contact you within 24 hours to discuss
              your workshop requirements.
            </p>
          </div>

          <WorkshopForm />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero text-white pattern-overlay">
        <div className="container-wide py-14 relative z-10 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
            Ready to Empower Your Students?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Join the growing number of schools that trust GOSEDMA for professional self-defence training.
          </p>
          <a href="#enquiry-form">
            <Button size="xl" variant="secondary" className="font-heading uppercase tracking-wider">
              Request a Workshop Now
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>
    </>
  );
}
