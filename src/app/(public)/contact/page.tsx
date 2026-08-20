import type { Metadata } from 'next';
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContactForm } from '@/components/forms/contact-form';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Contact GOSEDMA — the ${SITE_CONFIG.fullName} in ${SITE_CONFIG.city}. Call, WhatsApp, or email us for programme enquiries, trial bookings, and workshop requests.`,
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone',
      value: SITE_CONFIG.phone,
      href: `tel:${SITE_CONFIG.phone}`,
      description: 'Call us during business hours',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: 'Chat with us',
      href: `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi GOSEDMA, I would like some information about your academy.')}`,
      description: 'Quick response on WhatsApp',
      external: true,
    },
    {
      icon: Mail,
      title: 'Email',
      value: SITE_CONFIG.email,
      href: `mailto:${SITE_CONFIG.email}`,
      description: 'Email us anytime',
    },
  ];

  const branches = [
    {
      name: 'Malviya Nagar',
      address: 'Malviya Nagar, Jaipur, Rajasthan',
      note: 'Primary training center',
    },
    {
      name: 'Sitapura',
      address: 'Sitapura, Jaipur, Rajasthan',
      note: 'Training center',
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero text-white pattern-overlay relative">
        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <Badge variant="green" className="mb-4 text-white bg-brand-green/20 border border-brand-green/30">
              Get in Touch
            </Badge>
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white mb-5">
              Contact GOSEDMA
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Have questions about our programs, want to book a trial class, or enquire about school
              workshops? We&apos;re here to help.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-10 mb-16">
            {/* Left Column: Contact Cards */}
            <div className="lg:col-span-2 space-y-4">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="card p-5 flex items-center gap-4 hover:border-brand-green/30"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center shrink-0 group-hover:bg-brand-green/10 transition-colors">
                    <method.icon className="w-6 h-6 text-brand-navy" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-brand-deep-navy mb-0.5">
                      {method.title}
                    </h3>
                    <p className="text-brand-navy text-sm font-semibold mb-0.5">{method.value}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>

          {/* Branches */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <Badge variant="navy" className="mb-4">Our Locations</Badge>
              <h2 className="section-title section-title-center font-heading text-3xl">
                Visit Our Training Centres
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {branches.map((branch) => (
                <div key={branch.name} className="card p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-bold text-lg text-brand-deep-navy">
                        {branch.name}
                      </h3>
                      <p className="text-sm text-foreground-secondary">{branch.address}</p>
                      <p className="text-xs text-muted-foreground mt-1">{branch.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="max-w-md mx-auto card p-6 text-center">
            <Clock className="w-8 h-8 text-brand-navy mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-brand-deep-navy mb-2">
              Training Hours
            </h3>
            <p className="text-sm text-foreground-secondary">
              Please contact us for current batch timings and schedules.
            </p>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent('Hi GOSEDMA, I would like to know about batch timings.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block"
            >
              <Button variant="whatsapp" size="sm">
                <MessageCircle className="w-4 h-4" />
                Ask on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
