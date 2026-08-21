import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about GOSEDMA martial arts and self-defence training — programs, age requirements, trial classes, fees, and workshops.',
};

const faqCategories = [
  {
    title: 'Getting Started',
    faqs: [
      {
        q: 'What age groups do you train?',
        a: 'GOSEDMA offers programs for children (5+), teens, adults, and seniors. Each program is tailored to the appropriate age group and skill level.',
      },
      {
        q: 'Do I need prior experience in martial arts?',
        a: 'No prior experience is required. Our programs cater to complete beginners through to advanced and competitive athletes. Our instructors will guide you from the very basics.',
      },
      {
        q: 'How do I start training?',
        a: 'Book a free trial class through our website or contact us via phone/WhatsApp. We\'ll help you choose the right program based on your goals and experience.',
      },
      {
        q: 'What should I bring to my first class?',
        a: 'Wear comfortable workout clothes and bring a water bottle. No special equipment is needed for your first class. If you continue training, we\'ll advise on any required gear.',
      },
    ],
  },
  {
    title: 'Programs & Training',
    faqs: [
      {
        q: 'What martial arts do you teach?',
        a: 'GOSEDMA offers training in Taekwondo, Muay Thai / Thai Kickboxing, Krav Maga, MMA, Women\'s Self Defence, Children\'s Self Defence, Military Tactical Self Defence, Stunt Training, Gymnastics, Fitness & Conditioning, and Competition Athlete Training.',
      },
      {
        q: 'What is the class schedule?',
        a: 'Batch timings vary by program and branch. Please contact us via phone or WhatsApp for the current schedule.',
      },
      {
        q: 'Can women join the training?',
        a: 'Absolutely. GOSEDMA strongly encourages women\'s participation and offers a dedicated Women\'s Self Defence program alongside all other programs open to everyone.',
      },
      {
        q: 'Do you prepare students for competitions?',
        a: 'Yes, we have a dedicated Competition Athlete Training program that prepares students for state, national, and international-level martial arts competitions.',
      },
    ],
  },
  {
    title: 'Workshops',
    faqs: [
      {
        q: 'Do you offer self-defence workshops for schools?',
        a: 'Yes! School self-defence workshops are one of our key offerings. We conduct customised, age-appropriate workshops at your institution or at our training centers.',
      },
      {
        q: 'Do you offer corporate workshops?',
        a: 'Yes, we offer corporate self-defence and team-building workshops. Contact us to discuss a custom program for your organization.',
      },
      {
        q: 'How do I request a school workshop?',
        a: 'Visit our School Workshops page and fill out the enquiry form, or contact us directly via phone or WhatsApp. Our team will respond within 24 hours.',
      },
    ],
  },
  {
    title: 'Fees & Policies',
    faqs: [
      {
        q: 'What are the training fees?',
        a: 'Fees vary by program, batch, and duration. Please contact us via phone or WhatsApp for current pricing information.',
      },
      {
        q: 'Is there a registration fee?',
        a: 'Please contact the academy directly for information about registration fees and any joining requirements.',
      },
      {
        q: 'Do you offer trial classes?',
        a: 'Yes, we offer free trial classes so you can experience our training before committing. Book through our website or contact us directly.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-20 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              FAQ
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Find answers to common questions about training at GOSEDMA.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section-padding">
        <div className="container-narrow">
          {faqCategories.map((category) => (
            <div key={category.title} className="mb-12 last:mb-0">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-5">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq) => (
                  <details key={faq.q} className="card p-5 group cursor-pointer">
                    <summary className="flex items-center justify-between font-heading font-bold text-foreground list-none">
                      {faq.q}
                      <ChevronRight className="w-5 h-5 text-brand-navy dark:text-brand-green-light shrink-0 ml-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-sm text-foreground-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted">
        <div className="container-narrow text-center">
          <h2 className="font-heading font-bold text-2xl text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-foreground-secondary mb-6">
            Contact us and we&apos;ll be happy to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button variant="primary">
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/trial">
              <Button variant="secondary">
                Book a Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
