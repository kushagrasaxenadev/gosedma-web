'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  MapPin,
  Image as ImageIcon,
  Award,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  FileText,
  HelpCircle,
  Video,
  UserCheck,
} from 'lucide-react';

interface AdminNavProps {
  userRole: string;
}

export default function AdminNav({ userRole }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navGroups = [
    {
      title: 'Leads & Enquiries',
      items: [
        {
          name: 'Trial Bookings',
          href: '/admin/enquiries/trial',
          icon: UserCheck,
        },
        {
          name: 'School Workshops',
          href: '/admin/enquiries/workshop',
          icon: FileText,
        },
        {
          name: 'General Contacts',
          href: '/admin/enquiries/contact',
          icon: MessageSquare,
        },
      ],
    },
    {
      title: 'Academy Content CMS',
      items: [
        {
          name: 'Training Programs',
          href: '/admin/programs',
          icon: BookOpen,
        },
        {
          name: 'Academy Branches',
          href: '/admin/branches',
          icon: MapPin,
        },
        {
          name: 'Photo Gallery',
          href: '/admin/gallery',
          icon: ImageIcon,
        },
        {
          name: 'YouTube Videos',
          href: '/admin/videos',
          icon: Video,
        },
        {
          name: 'Academy Events',
          href: '/admin/events',
          icon: Calendar,
        },
        {
          name: 'Founder Bio & Awards',
          href: '/admin/founder',
          icon: Award,
        },
      ],
    },
    {
      title: 'System settings',
      items: [
        {
          name: 'Global Settings',
          href: '/admin/settings',
          icon: Settings,
        },
        {
          name: 'Manage Admins',
          href: '/admin/users',
          icon: Users,
          superAdminOnly: true,
        },
      ],
    },
  ];

  return (
    <nav className="space-y-6">
      {/* Dashboard Link */}
      <div>
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            pathname === '/admin'
              ? 'bg-brand-navy text-white'
              : 'text-white/70 hover:text-white hover:bg-brand-navy-light/10'
          }`}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Dashboard Overview</span>
        </Link>
      </div>

      {/* Grouped Links */}
      {navGroups.map((group) => {
        // Filter out super admin links if user is content admin
        const visibleItems = group.items.filter(
          (item) => !item.superAdminOnly || userRole === 'super_admin'
        );

        if (visibleItems.length === 0) return null;

        return (
          <div key={group.title} className="space-y-1.5">
            <h3 className="text-[10px] uppercase tracking-wider text-white/40 font-bold px-3">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-navy-light/20 text-brand-green-light border-l-2 border-brand-green'
                        : 'text-white/70 hover:text-white hover:bg-brand-navy-light/10'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Logout Action */}
      <div className="pt-4 border-t border-brand-navy-light/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors text-left"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
