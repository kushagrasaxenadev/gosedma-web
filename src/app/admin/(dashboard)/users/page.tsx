'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, Shield, ShieldCheck, Mail, Calendar } from 'lucide-react';

interface AdminUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  updated_at: string | null;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
    if (!error && data) setUsers(data as AdminUser[]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
          <Users className="w-6 h-6 text-brand-green" />
          Admin Users
        </h2>
        <p className="text-sm text-foreground-secondary mt-1">Manage administrator accounts. Super Admin access only.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border-light shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-foreground-secondary">
            <div className="animate-spin w-8 h-8 border-2 border-brand-navy border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-foreground-secondary">
            <Users className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No admin users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {users.map(user => (
              <div key={user.id} className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-navy to-brand-green flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {(user.full_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">{user.full_name || 'Admin User'}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${user.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {user.role === 'super_admin' ? <><ShieldCheck className="w-3 h-3" /> Super Admin</> : <><Shield className="w-3 h-3" /> Content Admin</>}
                    </span>
                    <span className="text-xs text-foreground-secondary flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Joined {new Date(user.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <p className="text-sm text-amber-800 font-medium">
          ⚠️ Admin user creation is managed through Supabase Dashboard for security. New admins must be invited via email.
        </p>
      </div>
    </div>
  );
}
