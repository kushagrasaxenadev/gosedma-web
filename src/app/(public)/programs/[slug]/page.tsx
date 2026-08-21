import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, ArrowLeft, MessageCircle, Star, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/lib/constants';

interface ProgramDetail {
  title: string;
  category: string;
  description: string;
  longDescription: string;
  benefits: string[];
  pricingNote?: string;
  ctaText: string;
}

const programsData: Record<string, ProgramDetail> = {
  'taekwondo': {
    title: 'Taekwondo',
    category: 'Martial Art',
    description: 'Olympic-style martial arts focusing on speed, precision kicks, and discipline.',
    longDescription: 'Taekwondo is a traditional Korean martial art characterized by its emphasis on head-height kicks, jumping and spinning kicks, and fast kicking techniques. At GOSEDMA, our Taekwondo program is designed for all ages, building physical strength, flexibility, mental discipline, and respect.',
    benefits: [
      'Learn Olympic-style sparring and techniques',
      'Build physical endurance, agility, and flexibility',
      'Develop self-discipline, focus, and self-confidence',
      'Earn internationally recognized belt ranks'
    ],
    pricingNote: 'Contact the academy for pricing options.',
    ctaText: 'Taekwondo program'
  },
  'muay-thai': {
    title: 'Muay Thai / Thai Kickboxing',
    category: 'Striking Art',
    description: 'The art of eight limbs — powerful striking techniques for fitness and self-defence.',
    longDescription: 'Muay Thai is a combat sport of Thailand that uses stand-up striking along with various clinching techniques. It is known as the "Art of Eight Limbs" because it combines strikes using fists, elbows, knees, and shins. Our program focuses on proper conditioning, pad work, and safe sparring.',
    benefits: [
      'High-calorie burning full-body conditioning',
      'Learn powerful striking and defensive techniques',
      'Build core strength, coordination, and stamina',
      'Boost self-confidence and relieve stress'
    ],
    pricingNote: 'Contact the academy for pricing options.',
    ctaText: 'Muay Thai program'
  },
  'krav-maga': {
    title: 'Krav Maga',
    category: 'Self Defence',
    description: 'Real-world self-defence system designed for practical survival situations.',
    longDescription: 'Krav Maga is a military self-defence and fighting system developed for the Israel Defense Forces and security forces. It focuses on real-world situations, efficient counter-attacks, and practical threat neutralization. No artfulness, just survival tactics.',
    benefits: [
      'Learn simple, effective defence techniques',
      'Train to respond under high-stress situations',
      'Develop quick reflexes and situational awareness',
      'Empower yourself with practical safety habits'
    ],
    pricingNote: 'Contact the academy for pricing options.',
    ctaText: 'Krav Maga program'
  },
  'mma': {
    title: 'MMA (Mixed Martial Arts)',
    category: 'Mixed Martial Arts',
    description: 'Mixed Martial Arts combining striking, grappling, and ground techniques.',
    longDescription: 'Mixed Martial Arts (MMA) is a full-contact combat sport that allows a wide variety of fighting techniques and skills from a mixture of other combat sports, including striking (boxing, Muay Thai) and grappling (wrestling, Jiu-Jitsu). Our class focuses on seamless transitions and conditioning.',
    benefits: [
      'Comprehensive combative skillset',
      'High-intensity cardiovascular workout',
      'Learn takedowns, submissions, and defensive guards',
      'Train in a highly structured, safe environment'
    ],
    pricingNote: 'Contact the academy for pricing options.',
    ctaText: 'MMA program'
  },
  'womens-self-defence': {
    title: "Women's Self Defence",
    category: 'Self Defence',
    description: 'Specialized self-defence designed for women — practical, empowering, and confidence-building.',
    longDescription: 'Our Women\'s Self Defence program focuses on identifying threats, establishing boundaries, and executing simple, high-impact escape techniques. We design scenarios based on real-life concerns, helping participants build physical ability and mental preparedness.',
    benefits: [
      'Learn vulnerability-targeted strikes and releases',
      'De-escalation tactics and boundary setting',
      'Empowerment through physical capability',
      'Scenario-based threat awareness'
    ],
    pricingNote: 'Contact the academy for pricing options.',
    ctaText: 'Women\'s Self Defence program'
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const program = programsData[resolvedParams.slug];
  if (!program) return { title: 'Program Not Found' };
  return {
    title: `${program.title} Training`,
    description: program.description,
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const program = programsData[resolvedParams.slug];

  if (!program) {
    notFound();
  }

  return (
    <>
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <Link href="/programs" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Programs
          </Link>
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              {program.category}
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5 leading-tight">
              {program.title} Training
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              {program.description}
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
              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">About the Program</h2>
              <p className="text-foreground-secondary leading-relaxed mb-8">
                {program.longDescription}
              </p>

              <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Key Benefits</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {program.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border-light">
                    <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="font-heading font-bold text-xl text-foreground mb-3">Program Details</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Pricing</p>
                    <p className="text-sm font-semibold text-foreground">{program.pricingNote || 'Contact Academy'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Schedule</p>
                    <p className="text-sm text-foreground-secondary">Morning & Evening Batches available. Contact for batch slots.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/trial" className="block">
                    <Button variant="primary" fullWidth className="font-heading uppercase tracking-wider">
                      <Star className="w-4 h-4" /> Book Trial Class
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(
                      `Hi GOSEDMA, I would like information about the ${program.ctaText}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="whatsapp" fullWidth className="font-heading uppercase tracking-wider">
                      <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
                    </Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
