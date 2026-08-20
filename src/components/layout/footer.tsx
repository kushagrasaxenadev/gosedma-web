import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/ui/social-icons';
import { SITE_CONFIG, SOCIAL_LINKS, FOOTER_LINKS } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-deep-navy text-white" role="contentinfo">
      {/* Main footer */}
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5" aria-label="GOSEDMA Home">
              <Image
                src="/images/logo-circular.png"
                alt="GOSEDMA Logo"
                width={52}
                height={52}
                className="w-13 h-13 rounded-full bg-white p-0.5"
              />
              <div>
                <span className="block font-heading font-bold text-xl tracking-wide text-white">
                  GOSEDMA
                </span>
                <span className="block text-xs text-white/60">
                  A Richa Gaur&apos;s Academy
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-5 max-w-xs">
              {SITE_CONFIG.fullName}. Premier martial arts and self-defence training in {SITE_CONFIG.city}, {SITE_CONFIG.state}. Est. {SITE_CONFIG.establishedYear}.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                aria-label="Follow us on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                aria-label="Subscribe on YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Programs column */}
          <div>
            <h3 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Programs
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.programs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-heading font-bold text-base text-white mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-brand-green transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-brand-green transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {SITE_CONFIG.city}, {SITE_CONFIG.state}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 text-center sm:text-left">
            © {currentYear} GOSEDMA – {SITE_CONFIG.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
