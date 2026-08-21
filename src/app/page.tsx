import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Users,
  Trophy,
  MapPin,
  GraduationCap,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  Calendar,
  ChevronRight,
  Swords,
  Dumbbell,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SITE_CONFIG } from '@/lib/constants';

// ─── HERO SECTION ────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden pattern-overlay">
      {/* Decorative arcs */}
      <div className="arc-decoration -top-20 -right-20 w-80 h-80 opacity-20" />
      <div className="arc-decoration -bottom-32 -left-32 w-96 h-96 opacity-10" />

      <div className="container-wide relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <Badge variant="green" className="mb-5 text-white bg-brand-green/20 border border-brand-green/30">
              Est. {SITE_CONFIG.establishedYear} • {SITE_CONFIG.city}, {SITE_CONFIG.state}
            </Badge>

            <h1 className="text-white font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.08] mb-5">
              Train with{' '}
              <span className="text-brand-green">Discipline.</span>
              <br />
              Defend with{' '}
              <span className="text-brand-green">Confidence.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {SITE_CONFIG.fullName} — Premier martial arts and self-defence training for all ages. Taekwondo, Muay Thai, Krav Maga, MMA and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/trial">
                <Button size="xl" variant="secondary" className="font-heading uppercase tracking-wider">
                  Book a Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/workshops/schools">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  School Workshops
                  <GraduationCap className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative w-[420px] h-[420px]">
              {/* Glowing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-brand-green/20 animate-[pulse-subtle_3s_ease-in-out_infinite]" />
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <Image
                src="/images/logo-globe.png"
                alt="GOSEDMA — Global Institute of Self Defence & Martial Arts"
                width={380}
                height={380}
                className="absolute inset-5 w-[calc(100%-40px)] h-[calc(100%-40px)] object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-12 md:h-16">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="var(--background)"
          />
        </svg>
      </div>
    </section>
  );
}

// ─── TRUST BAR ───────────────────────────────────────────
function TrustBar() {
  const stats = [
    { icon: Calendar, label: 'Years of Excellence', value: `Since ${SITE_CONFIG.establishedYear}` },
    { icon: Users, label: 'Training Programs', value: '15+' },
    { icon: MapPin, label: 'Training Centers', value: '2 Branches' },
    { icon: Shield, label: 'Disciplines', value: 'Multi-Style' },
  ];

  return (
    <section className="container-wide -mt-6 relative z-10 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card p-5 text-center hover:border-brand-green/30"
          >
            <stat.icon className="w-7 h-7 mx-auto mb-2 text-brand-green" />
            <p className="text-lg font-heading font-bold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── INTRODUCTION SECTION ────────────────────────────────
function IntroSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow text-center">
        <Badge variant="navy" className="mb-4">About GOSEDMA</Badge>
        <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl mb-6">
          Where Discipline Meets Excellence
        </h2>
        <p className="text-lg text-foreground-secondary leading-relaxed max-w-2xl mx-auto">
          GOSEDMA — the {SITE_CONFIG.fullName} — is a premier multi-discipline martial arts
          academy in {SITE_CONFIG.city}, {SITE_CONFIG.state}. Founded by <strong>Richa Gaur</strong>,
          we provide world-class training in Taekwondo, Muay Thai, Krav Maga, MMA, and specialized
          self-defence programs for all ages and skill levels.
        </p>
      </div>
    </section>
  );
}

// ─── CORE PROGRAMS ───────────────────────────────────────
function ProgramsSection() {
  const programs = [
    {
      title: 'Taekwondo',
      description: 'Olympic-style martial arts focusing on speed, precision kicks, and discipline. For all ages.',
      icon: Target,
      slug: 'taekwondo',
    },
    {
      title: 'Muay Thai',
      description: 'The art of eight limbs — powerful striking techniques for fitness and self-defence.',
      icon: Swords,
      slug: 'muay-thai',
    },
    {
      title: 'Krav Maga',
      description: 'Real-world self-defence system designed for practical survival situations.',
      icon: Shield,
      slug: 'krav-maga',
    },
    {
      title: 'MMA',
      description: 'Mixed Martial Arts training combining striking, grappling, and ground techniques.',
      icon: Dumbbell,
      slug: 'mma',
    },
    {
      title: "Women's Self Defence",
      description: 'Specialized self-defence designed for women — practical, empowering, and confidence-building.',
      icon: Heart,
      slug: 'womens-self-defence',
    },
    {
      title: 'Competition Training',
      description: 'Elite athlete preparation for national and international martial arts competitions.',
      icon: Trophy,
      slug: 'competition-training',
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <Badge variant="green" className="mb-4">Our Programs</Badge>
          <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
            World-Class Training Programs
          </h2>
          <p className="text-foreground-secondary mt-6 max-w-2xl mx-auto">
            From beginners to competitive athletes, GOSEDMA offers comprehensive martial arts
            training tailored to your goals and experience level.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link href={`/programs/${program.slug}`} key={program.slug} className="group">
              <Card className="h-full p-6 group-hover:border-brand-green/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-navy/5 flex items-center justify-center mb-4 group-hover:bg-brand-green/10 transition-colors">
                  <program.icon className="w-6 h-6 text-brand-navy group-hover:text-brand-green transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-deep-navy mb-2">
                  {program.title}
                </h3>
                <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                  {program.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy group-hover:text-brand-green transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/programs">
            <Button variant="outline" size="lg">
              View All Programs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── WHY GOSEDMA ─────────────────────────────────────────
function WhySection() {
  const reasons = [
    {
      title: 'Multi-Discipline Training',
      description: 'Learn from Taekwondo to Krav Maga under one roof with specialized coaching.',
    },
    {
      title: 'Expert Instruction',
      description: 'Training by experienced martial artists with national and international credentials.',
    },
    {
      title: 'All Ages & Levels',
      description: 'Programs designed for children, adults, women, and competitive athletes.',
    },
    {
      title: 'Proven Track Record',
      description: 'Academy athletes compete and achieve results at state, national, and international levels.',
    },
    {
      title: 'Safe Environment',
      description: 'Professional training facilities with emphasis on safety and progressive skill building.',
    },
    {
      title: 'Holistic Development',
      description: 'Beyond physical skills — we build discipline, confidence, focus, and resilience.',
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="navy" className="mb-4">Why Choose Us</Badge>
            <h2 className="section-title font-heading text-3xl md:text-4xl mb-6">
              Why Train at GOSEDMA?
            </h2>
            <div className="space-y-4">
              {reasons.map((reason) => (
                <div key={reason.title} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-bold text-brand-deep-navy mb-0.5">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Training facility image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/gallery/training-session.png"
                alt="GOSEDMA training session — students practicing kicks"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white rounded-xl shadow-xl p-4 flex items-center gap-3 border border-border-light">
              <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-brand-deep-navy">Since {SITE_CONFIG.establishedYear}</p>
                <p className="text-xs text-muted-foreground">Years of Training Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SCHOOL WORKSHOPS SECTION (HIGH PRIORITY) ────────────
function SchoolWorkshopSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/3 to-brand-green/3" />
      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/gallery/academy-collage.jpg"
                alt="GOSEDMA workshops and events"
                width={600}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Badge variant="green" className="mb-4">
              <GraduationCap className="w-3 h-3" />
              High Demand
            </Badge>
            <h2 className="section-title font-heading text-3xl md:text-4xl mb-5">
              Self-Defence Workshops for Schools
            </h2>
            <p className="text-foreground-secondary leading-relaxed mb-6">
              Empower your students with practical self-defence skills, awareness, and confidence.
              GOSEDMA delivers customised, age-appropriate self-defence workshops at your school
              or institution.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                'Age-appropriate techniques for all grade levels',
                'Awareness, boundary-setting, and confidence training',
                'Delivered at your school or at our academy',
                'Customised duration and curriculum',
                'Led by certified professional instructors',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span className="text-foreground-secondary">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/workshops/schools">
              <Button size="lg" variant="secondary" className="font-heading uppercase tracking-wider">
                Request a School Workshop
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOUNDER SECTION ─────────────────────────────────────
function FounderSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-wide">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl bg-gradient-to-br from-brand-navy/10 to-brand-green/10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logo-circular.png"
                  alt="GOSEDMA — Founded by Richa Gaur"
                  width={240}
                  height={240}
                  className="w-48 h-48 object-contain"
                />
              </div>
              {/* Accent corner */}
              <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-brand-green rounded-xl -z-10" />
            </div>
          </div>

          <div className="lg:col-span-3">
            <Badge variant="navy" className="mb-4">Our Founder</Badge>
            <h2 className="section-title font-heading text-3xl md:text-4xl mb-5">
              Richa Gaur
            </h2>
            <p className="text-foreground-secondary leading-relaxed mb-4">
              A dedicated martial artist and visionary, Richa Gaur founded GOSEDMA with the
              mission of making world-class martial arts training accessible in Jaipur. With
              years of experience across multiple disciplines, she leads the academy with a
              focus on discipline, safety, and holistic development.
            </p>
            <p className="text-foreground-secondary leading-relaxed mb-6">
              Under her leadership, GOSEDMA has grown into a respected multi-discipline academy,
              training students from beginners to competitive athletes.
            </p>
            <Link href="/founder">
              <Button variant="outline">
                Read Full Profile
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── BRANCHES SECTION ────────────────────────────────────
function BranchesSection() {
  const branches = [
    {
      name: 'Malviya Nagar',
      description: 'Our primary training center with full facilities.',
      slug: 'malviya-nagar',
    },
    {
      name: 'Sitapura',
      description: 'Training center serving the Sitapura area.',
      slug: 'sitapura',
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <div className="text-center mb-10">
          <Badge variant="navy" className="mb-4">Our Locations</Badge>
          <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
            Training Centres in {SITE_CONFIG.city}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {branches.map((branch) => (
            <Link href={`/branches/${branch.slug}`} key={branch.slug} className="group">
              <Card className="p-6 text-center group-hover:border-brand-navy/30">
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-navy/5 flex items-center justify-center mb-4 group-hover:bg-brand-navy/10 transition-colors">
                  <MapPin className="w-7 h-7 text-brand-navy" />
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-deep-navy mb-1">
                  {branch.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{branch.description}</p>
                <span className="text-sm font-semibold text-brand-navy group-hover:text-brand-green transition-colors">
                  View Details →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GALLERY PREVIEW ─────────────────────────────────────
function GalleryPreview() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-10">
          <Badge variant="green" className="mb-4">Inside the Academy</Badge>
          <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
            Training in Action
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1 md:row-span-2 rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/gallery/training-session.png"
              alt="GOSEDMA training session"
              width={400}
              height={500}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/gallery/training-facility.png"
              alt="GOSEDMA training facility"
              width={400}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src="/images/gallery/academy-collage.jpg"
              alt="GOSEDMA events and achievements"
              width={400}
              height={300}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/gallery">
            <Button variant="outline">
              View Full Gallery
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ PREVIEW ─────────────────────────────────────────
function FAQPreview() {
  const faqs = [
    {
      q: 'What age groups do you train?',
      a: 'GOSEDMA offers programs for children (5+), teens, adults, and seniors. Each program is tailored to the appropriate age group and skill level.',
    },
    {
      q: 'Do I need prior experience?',
      a: 'No prior martial arts experience is needed. Our programs are designed for complete beginners through to advanced athletes.',
    },
    {
      q: 'How do I start training?',
      a: 'Book a free trial class through our website or contact us via phone/WhatsApp. We will help you choose the right program.',
    },
    {
      q: 'Do you offer school workshops?',
      a: 'Yes! Self-defence workshops for schools are one of our key offerings. We conduct customised, age-appropriate workshops at your institution.',
    },
  ];

  return (
    <section className="section-padding bg-muted">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <Badge variant="navy" className="mb-4">FAQ</Badge>
          <h2 className="section-title section-title-center font-heading text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="card p-5 group cursor-pointer">
              <summary className="flex items-center justify-between font-heading font-bold text-brand-deep-navy list-none">
                {faq.q}
                <ChevronRight className="w-5 h-5 text-brand-navy shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-foreground-secondary leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/faq">
            <Button variant="ghost">
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FINAL CTA ───────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative bg-gradient-hero text-white overflow-hidden pattern-overlay">
      <div className="arc-decoration top-10 right-10 w-48 h-48 opacity-10" />
      <div className="container-wide py-16 md:py-20 relative z-10 text-center">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mb-5">
          Begin Your Martial Arts Journey
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
          Whether you want to learn self-defence, compete at the highest level, or empower your
          school with safety workshops — GOSEDMA is here for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/trial">
            <Button size="xl" variant="secondary" className="font-heading uppercase tracking-wider">
              Book a Free Trial
              <Star className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/workshops/schools">
            <Button
              size="xl"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white font-heading uppercase tracking-wider"
            >
              School Workshop Enquiry
              <GraduationCap className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── HOMEPAGE ────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <IntroSection />
      <ProgramsSection />
      <WhySection />
      <SchoolWorkshopSection />
      <FounderSection />
      <BranchesSection />
      <GalleryPreview />
      <FAQPreview />
      <FinalCTA />
    </>
  );
}
