import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AdminNav from '@/components/admin/admin-nav';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('gosedma_demo_admin');
  
  let profile = null;

  if (isDemoMode && demoCookie?.value === 'true') {
    profile = { role: 'super_admin', full_name: 'Demo Admin (No DB)', avatar_url: null };
  } else {
    // Retrieve user authentication status on the server
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no user session is found, redirect to the admin login page
    if (!user) {
      redirect('/admin/login');
    }

    // Fetch the user's role from their profile to ensure they are an administrator
    const { data: dbProfile } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', user.id)
      .single();

    if (!dbProfile || !['super_admin', 'content_admin'].includes(dbProfile.role)) {
      // If not an admin role, force logout and redirect
      await supabase.auth.signOut();
      redirect('/admin/login?error=unauthorized');
    }
    profile = dbProfile;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-deep-navy text-white flex-shrink-0 flex flex-col border-r border-brand-navy-light/20">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-brand-navy-light/10 flex items-center justify-between">
          <Link href="/admin" className="block">
            <h1 className="font-heading font-bold text-2xl tracking-wider text-white">
              GOSEDMA CMS
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-brand-green-light block font-semibold mt-0.5">
              Control Panel
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <AdminNav userRole={profile.role} />
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-brand-navy-light/10 bg-brand-deep-navy/40 flex items-center gap-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Admin'}
              className="w-10 h-10 rounded-full object-cover border border-brand-green/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center font-bold text-brand-green-light border border-brand-green/30">
              {profile.full_name?.charAt(0).toUpperCase() || 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {profile.full_name || 'Administrator'}
            </p>
            <p className="text-[10px] text-white/60 truncate uppercase font-bold tracking-wider">
              {profile.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <header className="bg-white border-b border-border-light h-16 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-2 text-foreground-secondary text-sm">
            <span className="font-semibold text-foreground">Admin Portal</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              target="_blank"
              className="text-xs bg-muted text-foreground-secondary hover:text-brand-navy px-3 py-1.5 rounded-lg border border-border transition font-medium"
            >
              View Live Website ↗
            </Link>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
