'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import AdminNav from '@/components/admin/admin-nav';

interface AdminShellProps {
  profile: {
    role: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  children: React.ReactNode;
}

export function AdminShell({ profile, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Derive breadcrumb label from pathname
  const pageLabel = pathname
    .replace('/admin', '')
    .replace(/\//g, ' › ')
    .replace(/-/g, ' ')
    .trim() || 'Dashboard';

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Top bar for mobile ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-brand-deep-navy text-white flex items-center justify-between px-4 shadow-lg">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-heading font-bold text-lg tracking-wider">GOSEDMA CMS</span>
        <Link
          href="/"
          target="_blank"
          className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md font-medium transition-colors"
        >
          Live ↗
        </Link>
      </div>

      <div className="flex flex-1 md:flex-row flex-col">

        {/* ── Mobile sidebar backdrop ── */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar ── */}
        <aside
          className={[
            // Desktop: always visible, fixed width
            'md:relative md:translate-x-0 md:flex md:w-64',
            // Mobile: slide-in drawer
            'fixed inset-y-0 left-0 z-[70] w-[280px] transition-transform duration-300',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            'bg-brand-deep-navy text-white flex-shrink-0 flex flex-col border-r border-brand-navy-light/20',
          ].join(' ')}
          aria-label="Admin navigation"
        >
          {/* Sidebar header */}
          <div className="p-5 border-b border-brand-navy-light/10 flex items-center justify-between">
            <Link href="/admin" onClick={() => setSidebarOpen(false)} className="block min-w-0">
              <h1 className="font-heading font-bold text-xl tracking-wider text-white leading-tight">
                GOSEDMA CMS
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-brand-green-light block font-semibold mt-0.5">
                Control Panel
              </span>
            </Link>
            {/* Close button — mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer ml-2 flex-shrink-0"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav items — scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <AdminNav
              userRole={profile.role}
              onNavClick={() => setSidebarOpen(false)}
            />
          </div>

          {/* User info footer */}
          <div className="p-4 border-t border-brand-navy-light/10 bg-black/20 flex items-center gap-3">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                aria-hidden="true"
                className="w-9 h-9 rounded-full object-cover border border-brand-green/30 flex-shrink-0"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center font-bold text-brand-green-light border border-brand-green/30 flex-shrink-0 text-sm"
                aria-hidden="true"
              >
                {profile.full_name?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {profile.full_name || 'Administrator'}
              </p>
              <p className="text-[10px] text-white/50 truncate uppercase font-bold tracking-wider">
                {profile.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 flex flex-col overflow-x-hidden min-w-0 md:pt-0 pt-14">
          {/* Desktop top bar */}
          <header className="hidden md:flex bg-surface border-b border-border-light h-14 items-center justify-between px-6 md:px-8 flex-shrink-0">
            <div className="flex items-center gap-2 text-foreground-secondary text-sm">
              <span className="font-semibold text-foreground">Admin Portal</span>
              {pageLabel && (
                <>
                  <span>/</span>
                  <span className="capitalize">{pageLabel}</span>
                </>
              )}
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-muted text-foreground-secondary hover:text-brand-navy hover:bg-muted/80 px-3 py-1.5 rounded-lg border border-border transition font-medium"
            >
              View Live Website ↗
            </Link>
          </header>

          <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
