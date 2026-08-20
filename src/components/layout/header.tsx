'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Trap focus and prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 backdrop-blur-sm'
      )}
    >
      {/* Top bar — contact info */}
      <div
        className={cn(
          'bg-brand-deep-navy text-white text-xs transition-all duration-300 overflow-hidden',
          scrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'
        )}
      >
        <div className="container-wide flex items-center justify-between py-1.5">
          <p className="hidden sm:block text-white/80">
            {SITE_CONFIG.fullName} — {SITE_CONFIG.city}, {SITE_CONFIG.state}
          </p>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="flex items-center gap-1 text-white/90 hover:text-brand-green transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="hidden sm:inline">{SITE_CONFIG.phone}</span>
              <span className="sm:hidden">Call</span>
            </a>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/90 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <nav ref={navRef} className="container-wide" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="GOSEDMA Home">
            <Image
              src="/images/logo-circular.png"
              alt="GOSEDMA Logo"
              width={44}
              height={44}
              className="w-10 h-10 lg:w-11 lg:h-11"
              priority
            />
            <div className="hidden xs:block">
              <span className="block text-brand-deep-navy font-heading font-bold text-lg leading-tight tracking-wide">
                GOSEDMA
              </span>
              <span className="block text-[10px] text-muted-foreground leading-tight">
                A Richa Gaur&apos;s Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative">
                {'children' in link && link.children ? (
                  <div className="relative">
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                        isActive(link.href)
                          ? 'text-brand-navy bg-brand-navy/5'
                          : 'text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5'
                      )}
                      onClick={() =>
                        setOpenDropdown(openDropdown === link.label ? null : link.label)
                      }
                      aria-expanded={openDropdown === link.label}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform',
                          openDropdown === link.label && 'rotate-180'
                        )}
                      />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === link.label && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-border-light py-2 animate-scale-in origin-top-left z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-4 py-2.5 text-sm transition-colors',
                              'featured' in child && child.featured
                                ? 'text-brand-green font-semibold hover:bg-brand-green/5'
                                : 'text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5',
                              isActive(child.href) && 'text-brand-navy bg-brand-navy/5'
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive(link.href)
                        ? 'text-brand-navy bg-brand-navy/5'
                        : 'text-foreground-secondary hover:text-brand-navy hover:bg-brand-navy/5'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/trial">
              <Button size="sm" variant="secondary">
                Book a Trial
              </Button>
            </Link>
            <Link href="/workshops/schools">
              <Button size="sm" variant="outline">
                School Workshops
              </Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed inset-0 top-[64px] z-40 transition-all duration-300',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Menu panel */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="p-6 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                {'children' in link && link.children ? (
                  <>
                    <button
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-3 text-base font-medium rounded-lg transition-colors',
                        isActive(link.href)
                          ? 'text-brand-navy bg-brand-navy/5'
                          : 'text-foreground hover:bg-muted'
                      )}
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.label ? null : link.label
                        )
                      }
                      aria-expanded={openDropdown === link.label}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform',
                          openDropdown === link.label && 'rotate-180'
                        )}
                      />
                    </button>

                    {openDropdown === link.label && (
                      <div className="ml-4 space-y-0.5 border-l-2 border-brand-green/20 pl-3 mb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-3 py-2 text-sm rounded-lg transition-colors',
                              'featured' in child && child.featured
                                ? 'text-brand-green font-semibold hover:bg-brand-green/5'
                                : 'text-foreground-secondary hover:text-brand-navy hover:bg-muted',
                              isActive(child.href) && 'text-brand-navy bg-brand-navy/5'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'block px-3 py-3 text-base font-medium rounded-lg transition-colors',
                      isActive(link.href)
                        ? 'text-brand-navy bg-brand-navy/5'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTAs */}
            <div className="pt-4 mt-4 border-t border-border-light space-y-3">
              <Link href="/trial" className="block">
                <Button fullWidth variant="secondary" size="lg">
                  Book a Trial Class
                </Button>
              </Link>
              <Link href="/workshops/schools" className="block">
                <Button fullWidth variant="outline" size="lg">
                  School Workshops
                </Button>
              </Link>
            </div>

            {/* Mobile contact shortcuts */}
            <div className="pt-4 mt-4 border-t border-border-light space-y-2">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5 text-brand-navy" />
                <span className="text-sm font-medium">{SITE_CONFIG.phone}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="text-sm font-medium">WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
