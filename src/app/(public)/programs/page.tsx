import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  Shield,
  Swords,
  Dumbbell,
  Heart,
  Trophy,
  Users,
  Flame,
  Sparkles,
  GraduationCap,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SITE_CONFIG } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // Dynamic server-render for immediate admin updates

export const metadata: Metadata = {
  title: 'Programs',
  description: `Explore GOSEDMA's martial arts and self-defence programs — Taekwondo, Muay Thai, Krav Maga, MMA, Women's Self Defence, and more in ${SITE_CONFIG.city}.`,
};

// Fallback programs if database is completely empty
const FALLBACK_PROGRAMS = [
  {
    title: 'Taekwondo',
    category: 'Martial Art',
    description: 'Olympic-style martial art focusing on speed, precision kicks, forms (poomsae), and discipline. Suitable for all ages from children to adults.',
    slug: 'taekwondo',
    featured: true,
  },
  {
    title: 'Muay Thai / Thai Kickboxing',
    category: 'Striking Art',
    description: 'The art of eight limbs — powerful striking techniques using fists, elbows, knees, and shins. Excellent for fitness and self-defence.',
    slug: 'muay-thai',
    featured: true,
  },
  {
    title: 'Krav Maga',
    category: 'Self Defence',
    description: 'Israel-developed self-defence system designed for real-world survival situations. Practical, direct, and effective.',
    slug: 'krav-maga',
    featured: true,
  },
  {
    title: 'MMA',
    category: 'Mixed Martial Arts',
    description: 'Mixed Martial Arts combining striking, grappling, and ground techniques from multiple disciplines.',
    slug: 'mma',
    featured: true,
  },
  {
    title: "Women's Self Defence",
    category: 'Self Defence',
    description: 'Specialized self-defence designed for women — practical techniques, situational awareness, and confidence building.',
    slug: 'womens-self-defence',
    featured: true,
  },
  {
    title: 'Competition Training',
    category: 'Elite Sport',
    description: 'Rigorous preparation for state, national, and international martial arts competitions under World Taekwondo and WAKO standards.',
    slug: 'competition-training',
    featured: false,
  },
];

const ICON_MAP: Record<string, any> = {
  taekwondo: Target,
  'muay-thai': Swords,
  'krav-maga': Shield,
  mma: Dumbbell,
  'womens-self-defence': Heart,
  'childrens-self-defence': Users,
  'corporate-self-defence': GraduationCap,
  'competition-training': Trophy,
  'fitness-conditioning': Flame,
  'summer-camps': Sparkles,
};

function getProgramIcon(slug: string, category?: string) {
  if (ICON_MAP[slug]) return ICON_MAP[slug];
  if (category === 'Self Defence') return Shield;
  if (category === 'Striking Art') return Swords;
  if (category === 'Elite Sport') return Trophy;
  return Target;
}

export default async function ProgramsPage() {
  const supabase = await createClient();

  // ONLY fetch published programs — drafts are strictly excluded!
  const { data: dbPrograms } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  const rawPrograms = dbPrograms && dbPrograms.length > 0 ? dbPrograms : FALLBACK_PROGRAMS;

  const programs = (rawPrograms as any[]).map((p: any) => ({
    ...p,
    icon: getProgramIcon(p.slug, p.category),
  }));

  const featured = programs.filter((p: any) => p.featured);
  const others = programs.filter((p: any) => !p.featured);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              Training Programs
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              World-Class Martial Arts & Self-Defence Programs
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              From beginners to competitive athletes — explore our comprehensive range of training
              programs tailored to every age and skill level.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <Badge variant="navy" className="mb-4">Featured Programs</Badge>
            <h2 className="section-title font-heading text-3xl md:text-4xl">
              Core Training Programs
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((program: any) => {
              const IconComp = program.icon;
              return (
                <Link href={`/programs/${program.slug}`} key={program.slug} className="group">
                  <Card className="h-full p-6 group-hover:border-brand-green/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-brand-navy/5 dark:bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green/10 transition-colors">
                        <IconComp className="w-6 h-6 text-brand-navy dark:text-brand-green dark:text-brand-green-light group-hover:text-brand-green transition-colors" />
                      </div>
                      <Badge variant="muted">{program.category}</Badge>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                      {program.title}
                    </h3>
                    <p className="text-sm text-foreground-secondary leading-relaxed mb-4">
                      {program.description || program.short_description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy dark:text-brand-green dark:text-brand-green-light group-hover:text-brand-green transition-colors">
                      Learn More
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Programs / Specialized Training */}
      {others.length > 0 && (
        <section className="section-padding bg-muted">
          <div className="container-wide">
            <div className="mb-10">
              <Badge variant="green" className="mb-4">All Programs</Badge>
              <h2 className="section-title font-heading text-3xl md:text-4xl">
                Specialized Training
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((program: any) => {
                const IconComp = program.icon;
                return (
                  <Link href={`/programs/${program.slug}`} key={program.slug} className="group">
                    <Card className="h-full p-6 group-hover:border-brand-navy/30">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComp className="w-5 h-5 text-brand-navy dark:text-brand-green dark:text-brand-green-light" />
                        <Badge variant="muted">{program.category}</Badge>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                        {program.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
                        {program.description || program.short_description}
                      </p>
                      <span className="text-sm font-semibold text-brand-navy dark:text-brand-green dark:text-brand-green-light group-hover:text-brand-green transition-colors">
                        Learn More →
                      </span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-4">
            Not sure which program is right for you?
          </h2>
          <p className="text-foreground-secondary mb-8 max-w-lg mx-auto">
            Book a free trial class and our instructors will help you find the perfect program
            based on your goals and experience level.
          </p>
          <Link href="/trial">
            <Button size="xl" variant="secondary" className="font-heading uppercase tracking-wider">
              Book a Free Trial Class
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
