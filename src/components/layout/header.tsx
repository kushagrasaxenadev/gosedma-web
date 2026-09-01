'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, MessageCircle, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [pathname]);

  // Reset mobile dropdown when mobile menu closes
  useEffect(() => {
    if (!mobileOpen) {
      setMobileOpenDropdown(null);
    }
  }, [mobileOpen]);

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

  // Sync dark mode state from DOM
  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('gosedma-theme', next ? 'dark' : 'light');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Background layer to avoid backdrop-filter trapping the mobile menu */}
      <div 
        className={cn(
          'absolute inset-0 transition-all duration-300 pointer-events-auto',
          scrolled
            ? 'bg-white/95 dark:bg-brand-deep-navy/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 dark:bg-brand-deep-navy/80 backdrop-blur-sm'
        )}
      />

      <div className="relative pointer-events-auto">
        {/* Top bar — contact info */}
        <div
          className={cn(
            'bg-brand-deep-navy dark:bg-black/40 text-white text-xs transition-all duration-300 overflow-hidden',
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
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Go to GOSEDMA home">
              <Image
                src="/images/logo-circular.png"
                alt=""
                role="presentation"
                width={44}
                height={44}
                className="w-10 h-10 lg:w-11 lg:h-11"
                priority
              />
              <div className="hidden xs:block">
                <span className="block text-foreground dark:text-white font-heading font-bold text-lg leading-tight tracking-wide">
                  GOSEDMA
                </span>
                <span className="block text-[10px] text-muted-foreground dark:text-white/60 leading-tight">
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
                            ? 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
                            : 'text-foreground-secondary dark:text-white/80 hover:text-brand-navy dark:hover:text-brand-green hover:bg-brand-navy/5 dark:hover:bg-white/5'
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
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-brand-deep-navy rounded-xl shadow-lg border border-border-light dark:border-white/10 py-2 animate-scale-in origin-top-left z-50">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'block px-4 py-2.5 text-sm transition-colors',
                                'featured' in child && child.featured
                                  ? 'text-brand-green font-semibold hover:bg-brand-green/5'
                                  : 'text-foreground-secondary dark:text-white/70 hover:text-brand-navy dark:hover:text-white hover:bg-brand-navy/5 dark:hover:bg-white/5',
                                isActive(child.href) && 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
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
                          ? 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
                          : 'text-foreground-secondary dark:text-white/80 hover:text-brand-navy dark:hover:text-brand-green hover:bg-brand-navy/5 dark:hover:bg-white/5'
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons + Dark Mode Toggle (desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-foreground-secondary dark:text-white/80 hover:bg-muted dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
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

            {/* Mobile: dark mode + hamburger */}
            <div className="lg:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                type="button"
                className="p-2.5 -mr-1 rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation — Full screen overlay */}
      <div
        id="mobile-menu"
        className={cn(
          'lg:hidden fixed inset-0 z-[70] transition-all duration-300',
          mobileOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop — behind the panel, closes menu on tap */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer pointer-events-auto"
          style={{ zIndex: 1 }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Menu panel — sits above backdrop */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-[85vw] max-w-xs bg-surface dark:bg-brand-deep-navy shadow-2xl overflow-y-auto transition-transform duration-300 border-l border-border-light dark:border-white/10 flex flex-col touch-manipulation pointer-events-auto select-none',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          style={{ zIndex: 2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-white/10 shrink-0 bg-surface dark:bg-brand-deep-navy sticky top-0" style={{ zIndex: 3 }}>
            <Link
              href="/"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              <Image src="/images/logo-circular.png" alt="" role="presentation" width={36} height={36} className="w-9 h-9" />
              <span className="font-heading font-bold text-lg text-foreground dark:text-white">GOSEDMA</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2.5 rounded-lg text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 space-y-1 flex-1">
            {NAV_LINKS.map((link) => (
              <div key={link.href}>
                {'children' in link && link.children ? (
                  <div>
                    <button
                      type="button"
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer text-left',
                        isActive(link.href)
                          ? 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
                          : 'text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 active:bg-muted/80'
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMobileOpenDropdown(
                          mobileOpenDropdown === link.label ? null : link.label
                        );
                      }}
                      aria-expanded={mobileOpenDropdown === link.label}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 transition-transform duration-200 flex-shrink-0 text-foreground-secondary dark:text-white/70',
                          mobileOpenDropdown === link.label && 'rotate-180 text-brand-green dark:text-brand-green'
                        )}
                      />
                    </button>

                    {mobileOpenDropdown === link.label && (
                      <div className="ml-3 mt-1 mb-2 space-y-1 border-l-2 border-brand-green/40 pl-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              'block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer',
                              'featured' in child && child.featured
                                ? 'text-brand-green font-semibold hover:bg-brand-green/5'
                                : 'text-foreground-secondary dark:text-white/70 hover:text-brand-navy dark:hover:text-white hover:bg-muted dark:hover:bg-white/5',
                              isActive(child.href) && 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
                            )}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileOpenDropdown(null);
                            }}
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
                      'block px-3 py-3.5 text-base font-semibold rounded-lg transition-colors cursor-pointer',
                      isActive(link.href)
                        ? 'text-brand-navy dark:text-brand-green bg-brand-navy/5 dark:bg-brand-green/10'
                        : 'text-foreground dark:text-white hover:bg-muted dark:hover:bg-white/5 active:bg-muted/80'
                    )}
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileOpenDropdown(null);
                    }}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTAs */}
            <div className="pt-5 mt-4 border-t border-border-light dark:border-white/10 space-y-3">
              <Link href="/trial" className="block w-full cursor-pointer" onClick={() => setMobileOpen(false)}>
                <Button fullWidth variant="secondary" size="lg" className="w-full justify-center shadow-md">
                  Book a Trial Class
                </Button>
              </Link>
              <Link href="/workshops/schools" className="block w-full cursor-pointer" onClick={() => setMobileOpen(false)}>
                <Button fullWidth variant="outline" size="lg" className="w-full justify-center">
                  School Workshops
                </Button>
              </Link>
            </div>

            {/* Mobile contact shortcuts */}
            <div className="pt-4 mt-4 border-t border-border-light dark:border-white/10 space-y-2">
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Phone className="w-5 h-5 text-brand-navy dark:text-brand-green" />
                <span className="text-sm font-medium text-foreground dark:text-white">{SITE_CONFIG.phone}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="text-sm font-medium text-foreground dark:text-white">WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
