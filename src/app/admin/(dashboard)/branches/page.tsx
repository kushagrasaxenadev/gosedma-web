'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Plus, Search, Edit3, Trash2, Eye, EyeOff, Phone, Mail } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminBranchesPage() {
  const supabase = createClient();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('branches').select('*').order('sort_order', { ascending: true });
    if (!error && data) setBranches(data as Branch[]);
    setLoading(false);
  };

  const togglePublished = async (id: string, current: boolean) => {
    const { error } = await supabase.from('branches').update({ published: !current }).eq('id', id);
    if (!error) setBranches(prev => prev.map(b => b.id === id ? { ...b, published: !current } : b));
  };

  const deleteBranch = async (id: string, name: string) => {
    if (!confirm(`Delete branch "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('branches').delete().eq('id', id);
    if (!error) setBranches(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-green" />
            Academy Branches
          </h2>
          <p className="text-sm text-foreground-secondary mt-1">Manage branch locations and contact details.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy-light transition shadow-sm">
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border-light p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-2/3 mb-3" />
              <div className="h-4 bg-muted rounded w-full mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))
        ) : branches.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-border-light p-12 text-center text-foreground-secondary">
            <MapPin className="w-10 h-10 mx-auto mb-3 text-foreground-secondary/30" />
            <p className="font-medium">No branches yet.</p>
            <p className="text-sm mt-1">Add your first academy branch to get started.</p>
          </div>
        ) : (
          branches.map(branch => (
            <div key={branch.id} className="bg-white rounded-xl border border-border-light shadow-sm p-6 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-bold text-foreground text-lg">{branch.name}</h3>
                <button onClick={() => togglePublished(branch.id, branch.published)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border transition ${branch.published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {branch.published ? 'Live' : 'Draft'}
                </button>
              </div>

              {branch.address && (
                <p className="text-sm text-foreground-secondary flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {branch.address}{branch.city ? `, ${branch.city}` : ''}
                </p>
              )}

              <div className="space-y-1.5 text-sm text-foreground-secondary mb-4">
                {branch.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{branch.phone}</p>}
                {branch.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{branch.email}</p>}
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-border-light">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-brand-navy dark:text-brand-green-light bg-brand-navy/5 hover:bg-brand-navy/10 transition">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => deleteBranch(branch.id, branch.name)} className="flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
