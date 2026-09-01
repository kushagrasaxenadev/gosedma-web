'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/ui/social-icons';
import { SITE_CONFIG, SOCIAL_LINKS, FOOTER_LINKS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [socials, setSocials] = useState<Record<string, string>>({
    instagram: SOCIAL_LINKS.instagram,
    facebook: SOCIAL_LINKS.facebook,
    youtube: SOCIAL_LINKS.youtube,
  });
  const [contact, setContact] = useState<Record<string, string>>({
    phone: SITE_CONFIG.phone,
    whatsapp: SITE_CONFIG.whatsapp,
    email: SITE_CONFIG.email,
    address: `${SITE_CONFIG.city}, ${SITE_CONFIG.state}`,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('site_settings')
      .select('*')
      .then((res: any) => {
        const data = res?.data;
        if (data && Array.isArray(data) && data.length > 0) {
          const newSocials = { ...socials };
          const newContact = { ...contact };

          data.forEach((s: any) => {
            const rawVal = s.value;
            const valStr =
              typeof rawVal === 'object' && rawVal !== null && 'value' in rawVal
                ? String(rawVal.value)
                : typeof rawVal === 'string'
                ? rawVal
                : null;

            if (s.key === 'youtube_url' && valStr) newSocials.youtube = valStr;
            if (s.key === 'instagram_url' && valStr) newSocials.instagram = valStr;
            if (s.key === 'facebook_url' && valStr) newSocials.facebook = valStr;
            if (s.key === 'primary_phone' && valStr) newContact.phone = valStr;
            if (s.key === 'whatsapp_number' && valStr) newContact.whatsapp = valStr;
            if (s.key === 'primary_email' && valStr) newContact.email = valStr;
            if (s.key === 'primary_address' && valStr) newContact.address = valStr;

            // Handle structured seed rows
            if (s.key === 'social_links' && typeof rawVal === 'object' && rawVal !== null) {
              if (rawVal.youtube) newSocials.youtube = String(rawVal.youtube);
              if (rawVal.instagram) newSocials.instagram = String(rawVal.instagram);
              if (rawVal.facebook) newSocials.facebook = String(rawVal.facebook);
            }
            if (s.key === 'contact_details' && typeof rawVal === 'object' && rawVal !== null) {
              if (rawVal.phone) newContact.phone = String(rawVal.phone);
              if (rawVal.whatsapp) newContact.whatsapp = String(rawVal.whatsapp);
              if (rawVal.email) newContact.email = String(rawVal.email);
              if (rawVal.address) newContact.address = String(rawVal.address);
            }
          });

          setSocials(newSocials);
          setContact(newContact);
        }
      });
  }, []);

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

            {/* Social links - Dynamic from Admin Settings */}
            <div className="flex items-center gap-3">
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-brand-green hover:text-white transition-all"
                  aria-label="Subscribe on YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
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
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-brand-green transition-colors"
                >
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${(contact.whatsapp || '').replace(/[^0-9]/g, '')}`}
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
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-2.5 text-sm text-white/70 hover:text-brand-green transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/70">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  {contact.address}
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
