import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/admin-shell';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();

  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get('gosedma_demo_admin');
  
  let profile: { role: string; full_name: string | null; avatar_url: string | null } | null = null;

  // Demo bypass is ONLY permitted when database is not configured (local preview mode)
  if (isDemoMode && demoCookie?.value === 'true') {
    profile = { role: 'super_admin', full_name: 'Demo Admin (Preview Mode)', avatar_url: null };
  } else {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/admin/login');
    }

    const { data: dbProfile } = await supabase
      .from('profiles')
      .select('full_name, role, avatar_url')
      .eq('id', user.id)
      .single();

    if (!dbProfile || !['super_admin', 'content_admin'].includes(dbProfile.role)) {
      await supabase.auth.signOut();
      redirect('/admin/login?error=unauthorized');
    }
    profile = dbProfile;
  }

  return (
    <AdminShell profile={profile!}>
      {children}
    </AdminShell>
  );
}
